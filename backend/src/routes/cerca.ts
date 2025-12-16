import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { conditionalAuthenticateToken } from "../middleware/authMiddleware.js"
import type {
  GlobalSearchItem,
  GlobalSearchFilters,
  ProposalSearchItem,
  PollSearchItem,
} from "../../../shared/models.js"

const router = express.Router()

function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined
  if (value === "true" || value === true) return true
  if (value === "false" || value === false) return false
  return undefined
}

function parseNumber(value: unknown): number | undefined {
  if (value === undefined) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

function parseDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  const d = new Date(value)
  return !isNaN(d.getTime()) ? value : undefined
}

function parseFilters(q: Record<string, unknown>): GlobalSearchFilters {
  const qString = typeof q.q === "string" ? q.q : ""
  const titlesOnly = parseBoolean(q.titlesOnly)
  const authorUsername = typeof q.author === "string" ? q.author : undefined
  const typeVal =
    typeof q.type === "string" && ["all", "proposta", "sondaggio"].includes(q.type)
      ? (q.type as "all" | "proposta" | "sondaggio")
      : "all"
  const dateFrom = parseDate(q.dateFrom)
  const dateTo = parseDate(q.dateTo)
  const categoryCode = typeof q.category === "string" ? q.category : undefined
  const statusCode = typeof q.status === "string" ? q.status : undefined
  const minVotes = parseNumber(q.minVotes)
  const maxVotes = parseNumber(q.maxVotes)
  const sortBy =
    typeof q.sortBy === "string" && ["date", "votes", "title"].includes(q.sortBy)
      ? (q.sortBy as "date" | "votes" | "title")
      : undefined
  const sortOrder =
    typeof q.sortOrder === "string" && ["asc", "desc"].includes(q.sortOrder)
      ? (q.sortOrder as "asc" | "desc")
      : undefined

  return {
    q: qString,
    type: typeVal,
    ...(titlesOnly !== undefined ? { titlesOnly } : {}),
    ...(authorUsername ? { authorUsername } : {}),
    ...(categoryCode ? { categoryCode } : {}),
    ...(statusCode ? { statusCode } : {}),
    ...(dateFrom ? { dateFrom } : {}),
    ...(dateTo ? { dateTo } : {}),
    ...(minVotes !== undefined ? { minVotes } : {}),
    ...(maxVotes !== undefined ? { maxVotes } : {}),
    ...(sortBy ? { sortBy } : {}),
    ...(sortOrder ? { sortOrder } : {}),
  }
}

router.get(
  "/",
  conditionalAuthenticateToken,
  async (req: Request, res: Response<{ data: GlobalSearchItem[] } | { error: string; details?: string }>) => {
    try {
      const filters = parseFilters(req.query as Record<string, unknown>)
      const values: unknown[] = []
      
      const addParam = (val: unknown) => {
        values.push(val)
        return `$${values.length}`
      }

      const propConditions: string[] = []
      if (filters.q && filters.q.length > 0) {
        const idx = addParam(`%${filters.q}%`)
        if (filters.titlesOnly) propConditions.push(`p.title ILIKE ${idx}`)
        else propConditions.push(`(p.title ILIKE ${idx} OR p.description ILIKE ${idx})`)
      }
      if (filters.authorUsername) {
        const idx = addParam(`%${filters.authorUsername}%`)
        propConditions.push(`u.username ILIKE ${idx}`)
      }
      if (filters.categoryCode) {
        const idx = addParam(filters.categoryCode)
        propConditions.push(`c.code = ${idx}`)
      }
      if (filters.statusCode) {
        const idx = addParam(filters.statusCode)
        propConditions.push(`s.code = ${idx}`)
      }
      if (filters.dateFrom) {
        const idx = addParam(filters.dateFrom)
        propConditions.push(`p.created_at >= ${idx}::timestamptz`)
      }
      if (filters.dateTo) {
        const idx = addParam(filters.dateTo)
        propConditions.push(`p.created_at < (${idx}::timestamptz + INTERVAL '1 day')`)
      }
      if (filters.minVotes !== undefined) {
        const idx = addParam(filters.minVotes)
        propConditions.push(`p.vote_value >= ${idx}`)
      }
      if (filters.maxVotes !== undefined) {
        const idx = addParam(filters.maxVotes)
        propConditions.push(`p.vote_value <= ${idx}`)
      }

      const pollConditions: string[] = []
      let skipPolls = false
      if (filters.statusCode || filters.minVotes !== undefined || filters.maxVotes !== undefined) {
        skipPolls = true
      }

      if (!skipPolls) {
        if (filters.q && filters.q.length > 0) {
          const idx = addParam(`%${filters.q}%`)
          if (filters.titlesOnly) pollConditions.push(`pl.title ILIKE ${idx}`)
          else pollConditions.push(`(pl.title ILIKE ${idx} OR pl.description ILIKE ${idx})`)
        }
        if (filters.authorUsername) {
          const idx = addParam(`%${filters.authorUsername}%`)
          pollConditions.push(`u.username ILIKE ${idx}`)
        }
        if (filters.categoryCode) {
          const idx = addParam(filters.categoryCode)
          pollConditions.push(`c.code = ${idx}`)
        }
        if (filters.dateFrom) {
          const idx = addParam(filters.dateFrom)
          pollConditions.push(`pl.created_at >= ${idx}::timestamptz`)
        }
        if (filters.dateTo) {
          const idx = addParam(filters.dateTo)
          pollConditions.push(`pl.created_at < (${idx}::timestamptz + INTERVAL '1 day')`)
        }
      }

      const parts: string[] = []

      if (filters.type === "all" || filters.type === "proposta") {
        const whereProp = propConditions.length > 0 ? "WHERE " + propConditions.join(" AND ") : ""
        parts.push(`
          SELECT 
            'proposta' as item_type,
            p.id, p.title, p.description, p.created_at, p.vote_value,
            u.username AS author_name,
            c.labels ->> 'it' AS category_label_it,
            c.code AS category_code,
            c.colour AS category_colour,
            s.labels ->> 'it' AS status_label_it,
            s.code AS status_code,
            s.colour AS status_colour
          FROM proposals p
          JOIN users u ON p.author_id = u.id
          JOIN categories c ON p.category_id = c.id
          JOIN statuses s ON p.status_id = s.id
          ${whereProp}
        `)
      }

      if (!skipPolls && (filters.type === "all" || filters.type === "sondaggio")) {
        const wherePoll = pollConditions.length > 0 ? "WHERE " + pollConditions.join(" AND ") : ""
        parts.push(`
          SELECT 
            'sondaggio' as item_type,
            pl.id, pl.title, pl.description, pl.created_at,
            NULL::integer as vote_value,
            u.username AS author_name,
            c.labels ->> 'it' AS category_label_it,
            c.code AS category_code,
            c.colour AS category_colour, 
            NULL as status_label_it,
            NULL as status_code,
            NULL as status_colour
          FROM polls pl
          JOIN users u ON pl.created_by = u.id
          LEFT JOIN categories c ON pl.category_id = c.id
          ${wherePoll}
        `)
      }

      if (parts.length === 0) return res.json({ data: [] })

      const sortBy = filters.sortBy ?? "date"
      const dir = filters.sortOrder === "asc" ? "ASC" : "DESC"
      let finalOrderBy = `ORDER BY created_at ${dir}`
      if (sortBy === "title") finalOrderBy = `ORDER BY title ${dir}`
      if (sortBy === "votes") finalOrderBy = `ORDER BY vote_value ${dir} NULLS LAST`

      const limParam = (req.query as Record<string, unknown>).limit
      const lim = parseNumber(limParam) ?? 50
      const safeLimit = Math.max(1, Math.min(lim, 200))

      const finalQuery = `
        ${parts.join(" UNION ALL ")}
        ${finalOrderBy}
        LIMIT ${safeLimit}
      `

      const result = await pool.query(finalQuery, values)

      interface SearchRow {
        item_type: "proposta" | "sondaggio";
        id: number;
        title: string;
        description: string;
        created_at: Date;
        vote_value: number | null;
        author_name: string | null;
        category_label_it: string | null;
        category_code: string | null;
        category_colour: string | null;
        status_label_it: string | null;
        status_code: string | null;
        status_colour: string | null;
      }

      const items: GlobalSearchItem[] = result.rows.map((row) => {
        const r = row as SearchRow
        const type = r.item_type
        
        const categoryVal = r.category_label_it ?? r.category_code
        const categoryColVal = r.category_colour
        const authorVal = r.author_name
        const statusVal = r.status_label_it ?? r.status_code
        const statusColVal = r.status_colour
        const voteVal = r.vote_value

        const base = {
          id: r.id,
          title: r.title,
          description: r.description,
          date: new Date(r.created_at).toLocaleDateString("it-IT"),
          timestamp: new Date(r.created_at).toISOString(),
        }

        if (type === "proposta") {
          const proposalItem: ProposalSearchItem = {
            type: "proposta",
            ...base,
            ...(authorVal ? { author: authorVal } : {}),
            ...(categoryVal ? { category: categoryVal } : {}),
            ...(categoryColVal ? { categoryColour: categoryColVal } : {}),
            ...(statusVal ? { status: statusVal } : {}),
            ...(statusColVal ? { statusColour: statusColVal } : {}),
            ...(voteVal !== null && voteVal !== undefined ? { voteValue: Number(voteVal) } : {}),
          }
          return proposalItem
        } else {
          const pollItem: PollSearchItem = {
            type: "sondaggio",
            ...base,
            ...(authorVal ? { author: authorVal } : {}),
            ...(categoryVal ? { category: categoryVal } : {}),
            ...(categoryColVal ? { categoryColour: categoryColVal } : {}),
          }
          return pollItem
        }
      })

      res.json({ data: items })
    } catch (err) {
      console.error("Search Error:", err)
      res.status(500).json({
        error: "Errore durante la ricerca",
        details: err instanceof Error ? err.message : String(err),
      })
    }
  },
)

export default router