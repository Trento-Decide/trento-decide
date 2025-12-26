import 'dotenv/config'
import { pool, runQueryFile } from '../database.js'

const initDevDb = async () => {
  await runQueryFile("wipe_db.sql")
  await runQueryFile("init.sql")
  await runQueryFile("seed_config.sql")
  await runQueryFile("init_mock.sql")
}

async function main() {
  try {
    await initDevDb()
    console.log('Development database initialized successfully.')
  } catch (error) {
    console.error('Error initializing development database:', error)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
