import 'dotenv/config'
import type { PoolConfig } from 'pg'

export const config = {
    port: process.env.PORT,
    frontendUrl: process.env.FRONTEND_URL, 
}

export const databaseConfig : PoolConfig = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
}