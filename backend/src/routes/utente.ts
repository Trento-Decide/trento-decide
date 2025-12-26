import express, { type Request, type Response } from "express"
import { pool } from "../database.js"
import { authenticateToken } from "../middleware/authMiddleware.js"

const router = express.Router()

router.delete("/", authenticateToken, async (req: Request, res: Response) => {
  const client = await pool.connect()
  try {
    const userId = Number(req.user!.sub)

    const result = await client.query("DELETE FROM users WHERE id = $1", [userId])

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found" })
    }

    return res.status(204).send()
  } catch (err) {
    console.error("Error deleting user profile:", err)
    return res.status(500).json({ error: "Internal server error during profile deletion" })
  } finally {
    client.release()
  }
})

export default router
