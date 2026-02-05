import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken, requireAdmin } from "../middleware/authMiddleware.js"
import type { DashboardStats } from "../../../shared/models.js"

const router = express.Router()

router.get(
    "/stats",
    authenticateToken,
    requireAdmin,
    async (_req: Request, res: Response<DashboardStats | { error: string }>) => {
        try {
            // Users count by role
            const usersResult = await pool.query(`
        SELECT 
          r.code AS role_code,
          COUNT(u.id) AS count
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        GROUP BY r.code
      `)

            const usersByRole: Record<string, number> = {}
            for (const row of usersResult.rows) {
                usersByRole[row.role_code || 'unknown'] = Number(row.count)
            }

            const totalUsers = Object.values(usersByRole).reduce((a, b) => a + b, 0)

            // Proposals count
            const proposalsCountResult = await pool.query(`
        SELECT COUNT(*) AS total FROM proposals
      `)
            const totalProposals = Number(proposalsCountResult.rows[0].total)

            // Proposals by status
            const proposalsByStatusResult = await pool.query(`
        SELECT 
          s.code AS status_code,
          s.labels->>'it' AS status_label,
          COUNT(p.id) AS count
        FROM proposals p
        LEFT JOIN statuses s ON p.status_id = s.id
        GROUP BY s.code, s.labels
        ORDER BY count DESC
      `)

            const byStatus = proposalsByStatusResult.rows.map(row => ({
                code: row.status_code || 'unknown',
                label: row.status_label || row.status_code || 'Sconosciuto',
                count: Number(row.count)
            }))

            const publishedCount = byStatus.find(s => s.code === 'pubblicata')?.count || 0
            const draftsCount = byStatus.find(s => s.code === 'bozza')?.count || 0

            // Proposals by category
            const proposalsByCategoryResult = await pool.query(`
        SELECT 
          c.code AS category_code,
          c.labels->>'it' AS category_label,
          COUNT(p.id) AS count
        FROM proposals p
        LEFT JOIN categories c ON p.category_id = c.id
        GROUP BY c.code, c.labels
        ORDER BY count DESC
      `)

            const byCategory = proposalsByCategoryResult.rows.map(row => ({
                code: row.category_code || 'unknown',
                label: row.category_label || row.category_code || 'Sconosciuta',
                count: Number(row.count)
            }))

            // Polls count
            const pollsResult = await pool.query(`
        SELECT 
          COUNT(*) AS total,
          COUNT(*) FILTER (WHERE is_active = true AND (expires_at IS NULL OR expires_at > NOW())) AS active,
          COUNT(*) FILTER (WHERE is_active = false OR (expires_at IS NOT NULL AND expires_at <= NOW())) AS closed
        FROM polls
      `)

            const pollsRow = pollsResult.rows[0]

            // Votes count
            const proposalVotesResult = await pool.query(`SELECT COUNT(*) AS count FROM proposal_votes`)
            const pollVotesResult = await pool.query(`SELECT COUNT(*) AS count FROM poll_answers`)

            const stats: DashboardStats = {
                users: {
                    total: totalUsers,
                    citizens: usersByRole['cittadino'] || 0,
                    moderators: usersByRole['moderatore'] || 0,
                    admins: usersByRole['admin'] || 0
                },
                proposals: {
                    total: totalProposals,
                    published: publishedCount,
                    drafts: draftsCount,
                    byCategory,
                    byStatus
                },
                polls: {
                    total: Number(pollsRow.total),
                    active: Number(pollsRow.active),
                    closed: Number(pollsRow.closed)
                },
                votes: {
                    proposalVotes: Number(proposalVotesResult.rows[0].count),
                    pollVotes: Number(pollVotesResult.rows[0].count)
                }
            }

            return res.json(stats)
        } catch (err) {
            console.error("Dashboard stats error:", err)
            return res.status(500).json({ error: "Errore nel recupero statistiche" })
        }
    }
)

export default router
