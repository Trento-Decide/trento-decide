import express, {
  type Application,
} from "express"
import cors from "cors"

import getEnvVar from "../../shared/env.js"
import proposteRouter from "./routes/proposte.js"
import authRouter from "./routes/auth.js"

export function createApp(): Application {
  const app = express()

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin || origin === getEnvVar("FRONTEND_URL")) {
          callback(null, true)
        } else {
          callback(new Error("Not allowed by CORS"))
        }
      },
      credentials: true,
    }),
  )

  app.use(express.json())

  app.use("/proposte", proposteRouter)
  app.use("/auth", authRouter)

  return app
}
