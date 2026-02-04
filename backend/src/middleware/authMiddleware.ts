import { type Request, type Response, type NextFunction } from "express"
import jwt, { type Secret } from "jsonwebtoken"

import { pool } from "../database.js"
import getEnvVar from "../utils/env.js"
import type { JwtUserPayload } from "../../../shared/auth.js"

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtUserPayload
  }
}

function extractBearerToken(req: Request): string | undefined {
  const authHeader = req.headers["authorization"]
  if (!authHeader) {
    return undefined
  }
  const parts = authHeader.split(" ")
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return undefined
  }
  return parts[1]
}

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
  const token = extractBearerToken(req)
  if (!token) {
    return res.status(401).json({
      error: "Missing Authorization token",
    })
  }

  const secretValue = getEnvVar("JWT_SECRET")
  if (!secretValue) {
    return res.status(500).json({
      error: "Server configuration error",
    })
  }
  const secret: Secret = secretValue

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(403).json({
        error: "Invalid or expired token",
      })
    }
    if (typeof decoded === "object" && decoded !== null) {
      req.user = decoded as JwtUserPayload
    }
    return next()
  })
}

export function conditionalAuthenticateToken(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req)
  if (!token) {
    return next()
  }

  const secretValue = getEnvVar("JWT_SECRET")
  if (!secretValue) {
    return next()
  }
  const secret: Secret = secretValue

  jwt.verify(token, secret, (err, decoded) => {
    if (!err && typeof decoded === "object" && decoded !== null) {
      req.user = decoded as JwtUserPayload
    }
    return next()
  })
}

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user?.sub) {
    return res.status(401).json({ error: "Non autenticato" })
  }

  try {
    const result = await pool.query(
      `SELECT r.code FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = $1`,
      [req.user.sub]
    )

    if (result.rowCount === 0 || result.rows[0].code !== 'admin') {
      return res.status(403).json({ error: "Accesso riservato agli amministratori" })
    }

    return next()
  } catch (err) {
    console.error("requireAdmin error:", err)
    return res.status(500).json({ error: "Errore verifica permessi" })
  }
}
