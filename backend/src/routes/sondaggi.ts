import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { conditionalAuthenticateToken } from "../middleware/authMiddleware.js"
import type { Poll, PollQuestion, PollOption } from "../../../shared/models.js"

const router = express.Router()

router.get("/:id", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user?.id

    const pollResult = await pool.query(`
      SELECT p.id, p.title, p.description, p.is_active, p.expires_at, p.created_at,
             u.username as author_name,
             c.labels->>'it' as category_label,
             c.colour as category_colour
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id])

    if (pollResult.rowCount === 0) {
      return res.status(404).json({ error: "Sondaggio non trovato" })
    }
    const pollRow = pollResult.rows[0]

    const questionsResult = await pool.query(`
      SELECT id, text, order_index
      FROM poll_questions
      WHERE poll_id = $1
      ORDER BY order_index ASC
    `, [id])

    // 3. Recupera Opzioni per tutte le domande trovate
    const questionIds = questionsResult.rows.map(q => q.id)
    let optionsMap: Record<number, PollOption[]> = {}
    
    if (questionIds.length > 0) {
      const optionsResult = await pool.query(`
        SELECT id, question_id, text, order_index
        FROM poll_options
        WHERE question_id = ANY($1::int[])
        ORDER BY order_index ASC
      `, [questionIds])

      optionsResult.rows.forEach(opt => {
        if (!optionsMap[opt.question_id]) optionsMap[opt.question_id] = []
        optionsMap[opt.question_id].push({
          id: opt.id,
          question_id: opt.question_id,
          text: opt.text,
          order_index: opt.order_index
        })
      })
    }

    // 4. Se l'utente è loggato, controlla se ha già risposto
    let userHasVoted = false
    if (userId) {
      const voteCheck = await pool.query(`
        SELECT 1 FROM poll_answers 
        WHERE user_id = $1 AND question_id = $2
        LIMIT 1
      `, [userId, questionIds[0]]) // Basta controllare se ha risposto alla prima domanda
      userHasVoted = (voteCheck.rowCount ?? 0) > 0
    }

    // 5. Assembla l'oggetto finale
    const poll: Poll = {
      id: pollRow.id,
      title: pollRow.title,
      description: pollRow.description,
      is_active: pollRow.is_active,
      created_at: new Date(pollRow.created_at).toISOString(),
      expires_at: pollRow.expires_at ? new Date(pollRow.expires_at).toISOString() : undefined,
      created_by: 0, // Non serve esporre l'ID raw qui se abbiamo author
      author: { id: 0, username: pollRow.author_name },
      category: pollRow.category_label ? { 
        id: 0, 
        code: '', 
        colour: pollRow.category_colour, 
        labels: { it: pollRow.category_label } 
      } : undefined,
      
      questions: questionsResult.rows.map(q => ({
        id: q.id,
        poll_id: Number(id),
        text: q.text,
        order_index: q.order_index,
        options: optionsMap[q.id] || []
      }))
    }

    res.json({ data: poll, userHasVoted })

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: "Errore nel recupero sondaggio" })
  }
})

// POST /sondaggi - Crea nuovo sondaggio (Richiede Auth)
router.post("/", authenticateToken, async (req: Request, res: Response) => {
  const client = await pool.connect()
  try {
    const userId = req.user!.id
    const { title, description, category_id, expires_at, questions } = req.body

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Dati mancanti o non validi" })
    }

    await client.query("BEGIN")

    // 1. Inserisci Sondaggio
    const pollRes = await client.query(`
      INSERT INTO polls (title, description, category_id, created_by, expires_at)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id
    `, [title, description, category_id, userId, expires_at])
    const pollId = pollRes.rows[0].id

    // 2. Inserisci Domande e Opzioni
    for (const [qIndex, q] of questions.entries()) {
      const qRes = await client.query(`
        INSERT INTO poll_questions (poll_id, text, order_index)
        VALUES ($1, $2, $3)
        RETURNING id
      `, [pollId, q.text, qIndex])
      const qId = qRes.rows[0].id

      if (q.options && Array.isArray(q.options)) {
        for (const [optIndex, optText] of q.options.entries()) {
          await client.query(`
            INSERT INTO poll_options (question_id, text, order_index)
            VALUES ($1, $2, $3)
          `, [qId, optText, optIndex])
        }
      }
    }

    await client.query("COMMIT")
    res.status(201).json({ success: true, pollId })

  } catch (err) {
    await client.query("ROLLBACK")
    console.error(err)
    res.status(500).json({ error: "Errore creazione sondaggio" })
  } finally {
    client.release()
  }
})

// POST /sondaggi/:id/vota - Invia risposte
router.post("/:id/vota", authenticateToken, async (req: Request, res: Response) => {
  const client = await pool.connect()
  try {
    const userId = req.user!.id
    const pollId = req.params.id
    const { answers } = req.body // Array di { question_id, selected_option_id, text_response }

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ error: "Formato risposte non valido" })
    }

    // Verifica se il sondaggio è attivo
    const pollCheck = await client.query(`SELECT is_active, expires_at FROM polls WHERE id = $1`, [pollId])
    if (pollCheck.rowCount === 0) return res.status(404).json({ error: "Sondaggio non trovato" })
    
    const poll = pollCheck.rows[0]
    if (!poll.is_active) return res.status(400).json({ error: "Sondaggio chiuso" })
    if (poll.expires_at && new Date() > new Date(poll.expires_at)) {
        return res.status(400).json({ error: "Sondaggio scaduto" })
    }

    // Verifica se ha già votato (basta controllare una risposta qualsiasi per questo sondaggio)
    // Nota: questo controllo è semplificato, idealmente si controlla per ogni domanda se la logica lo richiede
    const prevVote = await client.query(`
        SELECT 1 FROM poll_answers pa
        JOIN poll_questions pq ON pa.question_id = pq.id
        WHERE pq.poll_id = $1 AND pa.user_id = $2
        LIMIT 1
    `, [pollId, userId])

    if (prevVote.rowCount! > 0) {
         return res.status(400).json({ error: "Hai già votato in questo sondaggio" })
    }

    await client.query("BEGIN")

    for (const ans of answers) {
      await client.query(`
        INSERT INTO poll_answers (user_id, question_id, selected_option_id, text_response)
        VALUES ($1, $2, $3, $4)
      `, [userId, ans.question_id, ans.selected_option_id, ans.text_response])
    }

    await client.query("COMMIT")
    res.json({ success: true })

  } catch (err) {
    await client.query("ROLLBACK")
    console.error(err)
    // Gestione errore constraint unique (se due richieste arrivano insieme)
    if ((err as any).code === '23505') {
        return res.status(400).json({ error: "Hai già risposto a questa domanda" })
    }
    res.status(500).json({ error: "Errore salvataggio voto" })
  } finally {
    client.release()
  }
})

export default router