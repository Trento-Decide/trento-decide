import fs from "fs/promises"
import { Pool } from "pg"

import getEnvVar, { getOptionalEnvVar } from "./utils/env.js"

export const pool = new Pool({
  host: getEnvVar("DB_HOST"),
  port: Number(getEnvVar("DB_PORT")),
  database: getEnvVar("DB_NAME"),
  user: getEnvVar("DB_USER"),
  password: getOptionalEnvVar("DB_PASSWORD"),
})

export const runQueryFile = async (file: string) => {
  console.log(`Running ${file}`)
  const sqlPath = new URL(`./sql/${file}`, import.meta.url)
  const sql = await fs.readFile(sqlPath, "utf8")
  await pool.query(sql)
  console.log(`Successfully ran ${file}`)
}
