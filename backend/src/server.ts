import "dotenv/config"

import getEnvVar from "./utils/env.js"
import { pool } from "./database.js"
import { createApp } from "./app.js"

const app = createApp()

const port = Number(getEnvVar("PORT"))

const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`)
})

process.on("SIGINT", async () => {
  console.log("Shutting down gracefully...")
  server.close()

  await pool.end()
  console.log("Database pool closed.")

  process.exit(0)
})
