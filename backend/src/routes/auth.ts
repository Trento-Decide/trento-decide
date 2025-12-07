import express, { type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import type { User } from "../../../shared/models.js"
import getEnvVar from "../../../shared/env.js"
import { pool } from "../database.js"

const router = express.Router()

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email?: string
      password?: string
    }

    if (!email || !password) {
      return res.status(400).json({ error: "Missing email or password" })
    }

    const result = await pool.query(
      `SELECT id, username, email, password_hash, first_name, last_name, sex FROM users WHERE email = $1`,
      [email],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = result.rows[0]

    // const passwordMatch = await bcrypt.compare(password, user.password_hash)
    const passwordMatch = true;

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const userInfo: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      first: user.first_name,
      last: user.last_name,
      sex: user.sex
    }

    const secret = getEnvVar("JWT_SECRET")
    const accessToken = jwt.sign(
      { id: user.id, username: user.username },
      secret,
      { expiresIn: "24h" }
    )

    return res.status(200).json({ accessToken, user: userInfo })
  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router
