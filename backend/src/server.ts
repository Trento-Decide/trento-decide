import "dotenv/config"

import getEnvVar from "../../shared/env.js"
import { pool, initDevDb, initProdDb } from "./database.js"
import { createApp } from "./app.js"

// Se siamo in fase di sviluppo inizializza il database con valori fasulli
if (getEnvVar("NODE_ENV") === "development") {
  try {
    await initDevDb()
  } catch (err) {
    console.error(err)
  }
} else if (getEnvVar("NODE_ENV") === "production") {
  try {
    await initProdDb()
  } catch (err) {
    console.error(err)
  }
}

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
