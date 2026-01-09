import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken, conditionalAuthenticateToken } from "../middleware/authMiddleware.js"
import type {
  Poll,
  PollQuestion,
  PollOption,
  PollCreateInput,
  ID,
} from "../../../shared/models.js"

const router = express.Router()

router.get("/:id", conditionalAuthenticateToken, async (req: Request<{ id: string }>, res: Response<{ data: Poll; userHasVoted: boolean } | { error: string }>) => {
  try {
    const id = Number(req.params.id)
    const userId = req.user ? Number(req.user.sub) : undefined
    
    if (!Number.isInteger(id)) return res.status(400).json({ error: "ID non valido" })

    const pollResult = await pool.query(
      `
      SELECT p.id, p.title, p.description, p.is_active, p.expires_at, p.created_at,
             p.category_id,
             u.id AS author_id, u.username AS author_name,
             c.code AS category_code, c.labels->>'it' AS category_label, c.colour AS category_color
      FROM polls p
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `,
      [id],
    )

    if (pollResult.rowCount === 0) return res.status(404).json({ error: "Sondaggio non trovato" })
    const p = pollResult.rows[0]

    interface QuestionRow {
      id: number;
      text: string;
      order_index: number;
    }

    const questionsResult = await pool.query(
      `
      SELECT id, text, order_index
      FROM poll_questions
      WHERE poll_id = $1
      ORDER BY order_index ASC
    `,
      [id],
    )

    const questionsData = questionsResult.rows as QuestionRow[]
    const questionIds: number[] = questionsData.map((q) => q.id)
    
    const optionsMap: Record<number, PollOption[]> = {}
    
    interface OptionRow {
      id: number;
      question_id: number;
      text: string;
      order_index: number;
    }

    if (questionIds.length > 0) {
      const optionsResult = await pool.query(
        `
        SELECT id, question_id, text, order_index
        FROM poll_options
        WHERE question_id = ANY($1::int[])
        ORDER BY order_index ASC
      `,
        [questionIds],
      )

      const optionsRows = optionsResult.rows as OptionRow[]

      for (const opt of optionsRows) {
        if (!optionsMap[opt.question_id]) {
            optionsMap[opt.question_id] = []
        }
        optionsMap[opt.question_id]!.push({
          id: opt.id,
          questionId: opt.question_id,
          text: opt.text,
          orderIndex: opt.order_index,
        })
      }
    }

    const fullQuestions: PollQuestion[] = questionsData.map((q) => ({
      id: q.id,
      pollId: p.id,
      text: q.text,
      orderIndex: q.order_index ?? 0,
      options: optionsMap[q.id] || [] 
    }))

    let userHasVoted = false
    if (userId && questionIds.length > 0) {
      const voteCheck = await pool.query(
        `
        SELECT 1
        FROM poll_answers pa
        WHERE pa.user_id = $1 AND pa.question_id = ANY($2::int[])
        LIMIT 1
      `,
        [userId, questionIds],
      )
      userHasVoted = (voteCheck.rowCount ?? 0) > 0
    }

    const poll: Poll = {
      id: p.id,
      title: p.title,
      
      ...(p.description ? { description: p.description } : {}),
      
      ...(p.category_id ? {
          category: {
            id: p.category_id as ID,
            code: p.category_code ?? "unknown",
            ...(p.category_label ? { labels: p.category_label } : {}),
            ...(p.category_color ? { colour: p.category_color } : {})
          }
      } : {}),

      createdBy: { id: p.author_id as ID, username: p.author_name },
      isActive: p.is_active,
      
      ...(p.expires_at ? { expiresAt: new Date(p.expires_at).toISOString() } : {}),
      
      createdAt: new Date(p.created_at).toISOString(),
      questions: fullQuestions
    }

    return res.json({
      data: poll,
      userHasVoted,
    })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Errore nel recupero sondaggio" })
  }
})

router.post("/", authenticateToken, async (req: Request<unknown, unknown, PollCreateInput>, res: Response<{ success: true; pollId: ID } | { error: string }>) => {
  const client = await pool.connect()
  try {
    const userId = Number(req.user!.sub)
    const { title, description, categoryId, expiresAt, isActive, questions } = req.body

    if (!title || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: "Dati mancanti o non validi" })
    }

    await client.query("BEGIN")

    const pollRes = await client.query(
      `
      INSERT INTO polls (title, description, category_id, created_by, is_active, expires_at, created_at)
      VALUES ($1, $2, $3, $4, COALESCE($5, TRUE), $6, NOW())
      RETURNING id
    `,
      [title, description ?? null, categoryId ?? null, userId, isActive ?? true, expiresAt ?? null],
    )
    const pollId: ID = pollRes.rows[0].id

    for (const [qIndex, q] of questions.entries()) {
      const qRes = await client.query(
        `
        INSERT INTO poll_questions (poll_id, text, order_index)
        VALUES ($1, $2, $3)
        RETURNING id
      `,
        [pollId, q.text, q.orderIndex ?? qIndex],
      )
      const qId: ID = qRes.rows[0].id

      if (Array.isArray(q.options)) {
        for (const [optIndex, opt] of q.options.entries()) {
          await client.query(
            `
            INSERT INTO poll_options (question_id, text, order_index)
            VALUES ($1, $2, $3)
          `,
            [qId, opt.text, opt.orderIndex ?? optIndex],
          )
        }
      }
    }

    await client.query("COMMIT")
    return res.status(201).json({ success: true, pollId })
  } catch (err) {
    await client.query("ROLLBACK")
    console.error(err)
    return res.status(500).json({ error: "Errore creazione sondaggio" })
  } finally {
    client.release()
  }
})

router.post("/:id/vota", authenticateToken, async (req: Request<{ id: string }, unknown, { questionId: ID; selectedOptionId?: ID; textResponse?: string }>, res: Response<{ success: boolean } | { error: string }>) => {
  try {
    const userId = Number(req.user!.sub)
    const pollId = Number(req.params.id)
    const { questionId, selectedOptionId, textResponse } = req.body

    if (!Number.isInteger(pollId)) return res.status(400).json({ error: "ID sondaggio non valido" })
    if (!Number.isInteger(questionId)) return res.status(400).json({ error: "ID domanda mancante" })
    if (!selectedOptionId && !textResponse) return res.status(400).json({ error: "Nessuna risposta fornita" })

    const pollCheck = await pool.query(`SELECT is_active, expires_at FROM polls WHERE id = $1`, [pollId])
    if (pollCheck.rowCount === 0) return res.status(404).json({ error: "Sondaggio non trovato" })
    const poll = pollCheck.rows[0]
    
    if (!poll.is_active) return res.status(400).json({ error: "Sondaggio chiuso" })
    if (poll.expires_at && new Date() > new Date(poll.expires_at)) {
      return res.status(400).json({ error: "Sondaggio scaduto" })
    }

    const integrityCheck = await pool.query(
      `SELECT 1 FROM poll_questions WHERE id = $1 AND poll_id = $2`,
      [questionId, pollId]
    )
    if (integrityCheck.rowCount === 0) {
      return res.status(400).json({ error: "La domanda non appartiene a questo sondaggio" })
    }

    await pool.query(
      `
      INSERT INTO poll_answers (user_id, question_id, selected_option_id, text_response, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (user_id, question_id) 
      DO UPDATE SET 
        selected_option_id = EXCLUDED.selected_option_id,
        text_response = EXCLUDED.text_response,
        created_at = NOW()
      `,
      [userId, questionId, selectedOptionId ?? null, textResponse ?? null]
    )

    return res.json({ success: true })

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: "Errore salvataggio voto" })
  }
})

export default router