import express, { type Request, type Response } from "express"

import type { Proposta, Filters } from "../../../shared/models.js"
import { pool } from "../database.js"
import { conditionalAuthenticateToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.get("/", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    let filters: Filters = {}
    try {
      if (req.query.filters) {
        filters = JSON.parse(req.query.filters as string)
      }
    } catch {
      return res.status(400).json({ error: "Bad request" })
    }
    const userId = req.user?.id

    const conditions: string[] = []
    const values: (string | number)[] = []

    let selectIsFavourited = "false as is_favourited"
    let favoritesJoin = ""

    if (userId) {
      values.push(userId)
      favoritesJoin = `LEFT JOIN favorite_proposals fp ON p.id = fp.proposal_id AND fp.user_id = $${values.length}`
      selectIsFavourited = `(fp.user_id IS NOT NULL) as is_favourited`
    }

    if (filters.authorId) {
      values.push(filters.authorId)
      conditions.push(`p.author_id = $${values.length}`)
    }

    if (filters.favourites && userId) {
      conditions.push(`fp.user_id IS NOT NULL`)
    }

    const whereClause = conditions.length > 0
      ? "WHERE " + conditions.join(" AND ")
      : ""

    const query = `
      SELECT p.id, p.title, p.description, c.label as category, 
             u.username as author_name, p.created_at, p.status, p.vote_count, 
             p.category_id, 
             ${selectIsFavourited}
      FROM proposals p
      LEFT JOIN categories c ON p.category_id = c.id
      LEFT JOIN users u ON p.author_id = u.id
      ${favoritesJoin}
      ${whereClause}
      ORDER BY p.created_at DESC
    `

    const result = await pool.query(query, values)

    const proposte = result.rows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      author: r.author_name,
      date: new Date(r.created_at).toLocaleDateString("it-IT"),
      timestamp: new Date(r.created_at).toISOString(),
      status: r.status,
      votes: Number(r.vote_count),
      isFavourited: Boolean(r.is_favourited),
    }))

    res.json({ data: proposte as Proposta[] })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to fetch proposals",
      details: err instanceof Error ? err.message : String(err),
    })
  }
})

router.get("/:id", conditionalAuthenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const userId = req.user ? req.user.id : null

    const result = await pool.query(
      `SELECT p.id, p.status, p.vote_count, p.created_at,
             p.title, p.description, p.category_id, c.label as category,
             p.author_id, u.username as author_name,
             (fp.user_id IS NOT NULL) as is_favourited
       FROM proposals p
       LEFT JOIN categories c ON p.category_id = c.id
       LEFT JOIN users u ON p.author_id = u.id
       LEFT JOIN favorite_proposals fp ON p.id = fp.proposal_id AND fp.user_id = $2
       WHERE p.id = $1`,
      [id, userId]
    )

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Proposal not found" })
    }

    const r = result.rows[0]
    const proposta: Proposta = {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      status: r.status,
      votes: Number(r.vote_count),
      author: r.author_name,
      date: new Date(r.created_at).toLocaleDateString("it-IT"),
      timestamp: new Date(r.created_at).toISOString(),
      isFavourited: Boolean(r.is_favourited),
    }

    res.json({ data: proposta })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      error: "Failed to fetch proposal",
      details: err instanceof Error ? err.message : String(err),
    })
  }
})

export default router
