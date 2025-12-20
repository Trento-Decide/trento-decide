import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken } from "../middleware/authMiddleware.js"
import type { Notification } from "../../../shared/models.js"

const router = express.Router()

router.get(
  "/",
  authenticateToken,
  async (req: Request<{}, unknown, {}, { unreadOnly?: string }>, res: Response<Notification[] | { error: string }>) => {
    const userId = Number(req.user!.sub) 
    
    const unreadOnly = req.query.unreadOnly === "true"

    try {
      const { rows } = await pool.query(
        `
        SELECT n.id, n.user_id, n.notification_type, n.title, n.message, n.is_read, n.related_object_id, n.related_object_type, n.created_at
        FROM notifications n
        WHERE n.user_id = $1 ${unreadOnly ? "AND n.is_read = false" : ""}
        ORDER BY n.created_at DESC
        `,
        [userId],
      )

      const data: Notification[] = rows.map(r => ({
        id: r.id,
        userId: r.user_id,
        notificationType: r.notification_type,
        title: r.title,
        message: r.message ?? undefined,
        isRead: r.is_read,
        relatedObjectId: r.related_object_id ?? undefined,
        relatedObjectType: r.related_object_type ?? undefined,
        createdAt: new Date(r.created_at).toISOString(),
      }))

      return res.json(data)
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Errore nel recupero notifiche" })
    }
  },
)

router.patch(
  "/:id/leggi",
  authenticateToken,
  async (req: Request<{ id: string }, unknown, { isRead?: boolean }>, res: Response<{ id: number; isRead: boolean } | { error: string }>) => {
    const userId = Number(req.user!.sub)
    const notificationId = Number(req.params.id)
    const isRead = req.body.isRead ?? true

    if (!Number.isInteger(notificationId)) return res.status(400).json({ error: "Invalid notification id" })

    try {
      const upd = await pool.query(
        `UPDATE notifications 
         SET is_read = $2 
         WHERE id = $1 AND user_id = $3 
         RETURNING id`, 
        [notificationId, isRead, userId]
      )

      if (upd.rowCount === 0) {
        return res.status(404).json({ error: "Notification not found" })
      }

      return res.status(200).json({ id: notificationId, isRead })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ error: "Errore nell'aggiornamento notifica" })
    }
  },
)

export default router