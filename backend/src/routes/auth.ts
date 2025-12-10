import express, { type Request, type Response } from "express"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

import type { User } from "../../../shared/models.js"
import getEnvVar from "../../../shared/env.js"
import { pool } from "../database.js"
import { error } from "console"

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
      ` 
        SELECT u.id, u.username, u.email, u.password_hash, u.notifications, r.name AS role
        FROM "user" u
        INNER JOIN role r ON r.id = u.role_id
        WHERE u.email = $1
      `,
      [email],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const user = result.rows[0]

    const passwordMatch = await bcrypt.compare(password, user.password_hash)

    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    const userInfo: User = {
      id: user.id,
      username: user.username,
      email: user.email,
      notifications: user.notifications,
      role: user.role
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

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { username, email, password, notifications } = req.body as {
      username?: string
      email?: string
      password?: string
      notifications?: boolean
    }

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing email or password" })
    }

    const usernameCheck = await pool.query(
      'SELECT id FROM "user" WHERE username = $1',
      [username],
    )

    if (usernameCheck.rowCount !== 0) {
      return res.status(401).json({ error: "Username already exists" })
    }

    const emailCheck = await pool.query(
      'SELECT id FROM "user" WHERE email = $1',
      [email],
    )

    if (emailCheck.rowCount !== 0) {
      return res.status(401).json({ error: "Email already registered" })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    // TODO duddo: si potrebbe globalizzare citizenRole, così è bruttino
    const citizenRole = await pool.query( `SELECT id FROM role WHERE email = 'cittadino'` )

    const insertionResult = await pool.query(
      ` INSERT INTO "user" (username, email, password_hash, notifications, role_id)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [username, email, passwordHash, notifications, citizenRole]
    )

    return res.status(200).json({ message: "User registered"} )
  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

router.get("/provider", async (req: Request, res: Response) => {
  const token = "QuestoTokenNonFunziona"
  try {
    return res.status(200).json({ providerToken: token })
  } catch (err) {
    console.error("Provider error:", err)
    return res.status(500).json({ error: "Internal server error" })
  }
})

export default router
