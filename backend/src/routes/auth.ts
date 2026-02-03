import express, { type Request, type Response } from "express"
import bcrypt from "bcrypt"

import { pool } from "../database.js"
import { signJwt } from "../utils/jwt.js"

import { loginSchema, registerSchema } from "../../../shared/validation/auth.js"

const router = express.Router()

router.post("/login", async (req: Request, res: Response) => {
  try {
    const validation = loginSchema.safeParse(req.body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]!.message
      return res.status(400).json({
        error: firstError,
      })
    }

    const { email, password } = validation.data

    const result = await pool.query(
      `
        SELECT u.id, u.username, u.email, u.password_hash, u.is_banned, u.email_opt_in, u.created_at,
               r.id AS role_id, r.code AS role_code, r.labels AS role_labels, r.colour AS role_colour
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE u.email = $1
      `,
      [email],
    )

    if (result.rowCount === 0) {
      return res.status(401).json({
        error: "Invalid credentials",
      })
    }

    const user = result.rows[0] as {
      id: number
      username: string
      email: string
      password_hash: string
      is_banned: boolean
      email_opt_in: boolean
      created_at: Date
      role_id: number
      role_code: string
      role_labels: { [key: string]: string }
      role_colour: string
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash)
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid credentials",
      })
    }

    if (user.is_banned) {
      return res.status(403).json({
        error: "User is banned",
      })
    }

    const accessToken = signJwt({
      sub: user.id,
      username: user.username,
      v: 1
    }, { expiresIn: "24h" })

    return res.status(200).json({
      accessToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailOptIn: user.email_opt_in,
        isBanned: user.is_banned,
        createdAt: new Date(user.created_at).toISOString(),
        role: {
          id: user.role_id,
          code: user.role_code,
          labels: user.role_labels,
          colour: user.role_colour
        }
      },
    })
  } catch (err) {
    console.error("Login error:", err)
    return res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.post("/register", async (req: Request, res: Response) => {
  try {
    const validation = registerSchema.safeParse(req.body)

    if (!validation.success) {
      const firstError = validation.error.issues[0]!.message
      return res.status(400).json({
        error: firstError,
      })
    }

    const { username, email, password, emailOptIn } = validation.data

    const usernameCheck = await pool.query(
      `SELECT id FROM users WHERE username = $1`,
      [username],
    )
    if (usernameCheck.rowCount !== 0) {
      return res.status(409).json({
        error: "Username already taken",
      })
    }

    const emailCheck = await pool.query(
      `SELECT id FROM users WHERE email = $1`,
      [email],
    )
    if (emailCheck.rowCount !== 0) {
      return res.status(409).json({
        error: "Email already registered",
      })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const DEFAULT_ROLE_CODE = "cittadino";

    const roleResult = await pool.query(
      `SELECT id FROM roles WHERE code = $1`,
      [DEFAULT_ROLE_CODE],
    )
    if (roleResult.rowCount === 0) {
      console.error(`Critical Error: Default role '${DEFAULT_ROLE_CODE}' not found in DB`);
      return res.status(500).json({
        error: "Registration unavailable",
      })
    }
    const roleId: number = roleResult.rows[0].id

    const emailOptInBool = !!emailOptIn

    const insertionResult = await pool.query(
      `
        INSERT INTO users (username, email, password_hash, role_id, email_opt_in)
        VALUES ($1, $2, $3, $4, $5)
      `,
      [username, email, passwordHash, roleId, emailOptInBool],
    )

    if (insertionResult.rowCount !== 1) {
      return res.status(500).json({
        error: "User registration failed",
      })
    }

    return res.status(201).json({
      message: "User registered",
    })
  } catch (err) {
    console.error("Register error:", err)
    return res.status(500).json({
      error: "Internal server error",
    })
  }
})

router.get("/provider", async (_req: Request, res: Response) => {
  const token = "QuestoTokenNonFunziona"
  try {
    return res.status(200).json({
      providerToken: token,
    })
  } catch (err) {
    console.error("Provider error:", err)
    return res.status(500).json({
      error: "Internal server error",
    })
  }
})

export default router