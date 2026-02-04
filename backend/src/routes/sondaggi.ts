import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken, conditionalAuthenticateToken, requireAdmin } from "../middleware/authMiddleware.js"
import type {
  Poll,
  PollQuestion,
  PollOption,
  PollCreateInput,
  ID,
  PollSearchItem,
  UserRef,
  CategoryRef,
  LocalizedText,
} from "../../../shared/models.js"

const router = express.Router()

router.get(
  "/",
  conditionalAuthenticateToken,
  async (
    req: Request<unknown, unknown, unknown, Record<string, unknown>>,
    res: Response<PollSearchItem[] | { error: string }>,
  ) => {
    try {
      const conditions: string[] = []
      const values: unknown[] = []

      const q = req.query.q as string | undefined
      const titlesOnly = req.query.titlesOnly === 'true'
      const authorId = req.query.authorId ? Number(req.query.authorId) : undefined
      const authorUsername = req.query.authorUsername as string | undefined
      const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined
      const categoryCode = req.query.categoryCode as string | undefined
      const isActive = req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined
      const dateFrom = req.query.dateFrom as string | undefined
      const dateTo = req.query.dateTo as string | undefined

      if (q) {
        const idx = values.push(`%${q}%`)
        if (titlesOnly) {
          conditions.push(`p.title ILIKE $${idx}`)
        } else {
          conditions.push(`(p.title ILIKE $${idx} OR p.description ILIKE $${idx})`)
        }
      }

      if (authorId) {
        const idx = values.push(authorId)
        conditions.push(`p.created_by = $${idx}`)
      } else if (authorUsername) {
        const idx = values.push(authorUsername)
        conditions.push(`u.username = $${idx}`)
      }

      if (categoryId) {
        const idx = values.push(categoryId)
        conditions.push(`p.category_id = $${idx}`)
      } else if (categoryCode) {
        const idx = values.push(categoryCode)
        conditions.push(`c.code = $${idx}`)
      }

      if (isActive !== undefined) {
        const idx = values.push(isActive)
        conditions.push(`p.is_active = $${idx}`)
      }

      if (dateFrom) {
        const idx = values.push(dateFrom)
        conditions.push(`p.created_at >= $${idx}::timestamptz`)
      }
      if (dateTo) {
        const idx = values.push(dateTo)
        conditions.push(`p.created_at <= $${idx}::timestamptz`)
      }

      const whereClause = conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : ""

      const query = `
        SELECT
          p.id, p.title, p.description, p.is_active, p.expires_at, p.created_at,
          
          u.id AS author_id,
          u.username AS author_username,
          
          c.id AS category_id,
          c.labels AS category_labels,
          c.code AS category_code, 
          c.colour AS category_colour,

          (
            SELECT COUNT(DISTINCT pa.user_id)
            FROM poll_answers pa
            INNER JOIN poll_questions pq ON pa.question_id = pq.id
            WHERE pq.poll_id = p.id
          ) AS total_votes
        FROM polls p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN users u ON p.created_by = u.id
        ${whereClause}
        ORDER BY p.created_at DESC
      `

      const result = await pool.query(query, values)

      interface PollRow {
        id: number
        title: string
        description: string | null
        is_active: boolean
        expires_at: Date | null
        created_at: Date

        author_id: number
        author_username: string

        category_id: number | null
        category_labels: LocalizedText
        category_code: string
        category_colour: string

        total_votes: string | number
      }

      const items: PollSearchItem[] = result.rows.map((row) => {
        const r = row as PollRow

        const authorRef: UserRef = {
          id: r.author_id,
          username: r.author_username,
        }

        const categoryRef: CategoryRef | undefined = r.category_id ? {
          id: r.category_id,
          code: r.category_code,
          labels: r.category_labels,
          colour: r.category_colour
        } as CategoryRef : undefined

        return {
          type: "sondaggio" as const,
          id: r.id,
          title: r.title,
          description: r.description ?? "",
          isActive: r.is_active,
          date: new Date(r.created_at).toLocaleDateString("it-IT"),
          timestamp: new Date(r.created_at).toISOString(),
          totalVotes: Number(r.total_votes),

          author: authorRef,

          ...(categoryRef ? { category: categoryRef } : {}),
          ...(r.expires_at ? { expiresAt: new Date(r.expires_at).toISOString() } : {}),
        }
      })

      return res.json(items)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Errore nel recupero sondaggi" })
    }
  },
)

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

    interface VoteCountRow {
      selected_option_id: number;
      count: string;
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

      // Get vote counts for all options
      const optionIds = optionsRows.map(o => o.id)
      let voteCounts: Record<number, number> = {}

      if (optionIds.length > 0) {
        const voteCountsResult = await pool.query(
          `
          SELECT selected_option_id, COUNT(*) as count
          FROM poll_answers
          WHERE selected_option_id = ANY($1::int[])
          GROUP BY selected_option_id
          `,
          [optionIds]
        )
        for (const row of voteCountsResult.rows as VoteCountRow[]) {
          voteCounts[row.selected_option_id] = Number(row.count)
        }
      }

      for (const opt of optionsRows) {
        if (!optionsMap[opt.question_id]) {
          optionsMap[opt.question_id] = []
        }
        optionsMap[opt.question_id]!.push({
          id: opt.id,
          questionId: opt.question_id,
          text: opt.text,
          orderIndex: opt.order_index,
          voteCount: voteCounts[opt.id] || 0,
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

router.post("/", authenticateToken, requireAdmin, async (req: Request<unknown, unknown, PollCreateInput>, res: Response<{ success: true; pollId: ID } | { error: string }>) => {
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