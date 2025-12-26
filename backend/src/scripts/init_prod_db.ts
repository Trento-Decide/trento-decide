import 'dotenv/config'
import { pool, runQueryFile } from '../database.js'

const initProdDb = async () => {
  await runQueryFile("init.sql")
  await runQueryFile("seed_config.sql")
}

async function main() {
  try {
    await initProdDb()
    console.log('Production database initialized successfully.')
  } catch (error) {
    console.error('Error initializing production database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
