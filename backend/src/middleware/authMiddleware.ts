import { type Request, type Response, type NextFunction } from "express"
import jwt from "jsonwebtoken"

import type { User } from "../../../shared/models.js"
import getEnvVar from "../../../shared/env.js"

declare module "express-serve-static-core" {
  interface Request {
    user?: User
  }
}

export const conditionalAuthenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  const secret = getEnvVar("JWT_SECRET")

  if (token) {
    jwt.verify(token, secret, (err, decoded) => {
      if (!err && typeof decoded === "object" && decoded !== null) {
        req.user = decoded as User
      }
      next()
    })
  } else {
    next()
  }
}
