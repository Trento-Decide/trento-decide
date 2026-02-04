import express, { type Application } from "express"
import cors from "cors"

import getEnvVar from "./utils/env.js"

import authRouter from "./routes/auth.js"
import utenteRouter from "./routes/utente.js"
import proposteRouter from "./routes/proposte.js"
import cercaRouter from "./routes/cerca.js"
import sondaggiRouter from "./routes/sondaggi.js"
import allegatiRouter from "./routes/allegati.js"
import notificheRouter from "./routes/notifiche.js"
import configRouter from "./routes/config.js"
import dashboardRouter from "./routes/dashboard.js"

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

  app.use("/auth", authRouter)

  app.use("/utente", utenteRouter)

  app.use("/proposte", proposteRouter)

  app.use("/sondaggi", sondaggiRouter)

  app.use("/cerca", cercaRouter)

  app.use("/notifiche", notificheRouter)

  app.use("/", allegatiRouter)

  app.use("/config", configRouter)

  app.use("/dashboard", dashboardRouter)

  app.use((req, res) => {
    res.status(404).json({ error: "Endpoint not found" })
  })

  return app
}
