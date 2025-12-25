import { Pool } from "pg"
import fs from "fs/promises"

import getEnvVar, { getOptionalEnvVar } from "./utils/env.js"

export const pool = new Pool({
  host: getEnvVar("DB_HOST"),
  port: Number(getEnvVar("DB_PORT")),
  database: getEnvVar("DB_NAME"),
  user: getEnvVar("DB_USER"),
  password: getOptionalEnvVar("DB_PASSWORD"),
})

const runQueryFile = async (file: string) => {
  console.log(`Running ${file}`)
  const sqlPath = new URL(`./sql/${file}`, import.meta.url)
  const sql = await fs.readFile(sqlPath, "utf8")
  await pool.query(sql)
  console.log(`Succesfully ran ${file}`)
}

export const initDevDb = async () => {
  await runQueryFile("wipe_db.sql")
  await runQueryFile("init.sql")
  await runQueryFile("seed_config.sql")
  await runQueryFile("init_mock.sql")
}

export const initProdDb = async () => {
  await runQueryFile("init.sql")
  await runQueryFile("seed_config.sql")
}
