import express, { type Request, type Response, type Application} from 'express'
import cors from 'cors'
import { config } from './config.js'
import { pool } from './database.js'

export function createApp() : Application {

    const app = express()

    app.use(cors({
        origin: (origin, callback) => {
            if (!origin || origin === config.frontendUrl) {
                callback(null, true)
            } else {
                callback(new Error('Not allowed by CORS'))
            }
        },
    }))

    app.use(express.json())

    app.get('/', async (_req: Request, res: Response) => {
        try {
            const result = await pool.query('SELECT NOW()')

            res.json({
                message: 'Database connected successfully',
                timestamp: result.rows[0].now,
            })

        } catch (err) {
            console.error(err)
            res.status(500).json({
                error: 'Database connection failed',
                details: err instanceof Error ? err.message : String(err),
            })
        }
    })

    return app;
}