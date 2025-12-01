const express = require('express')
const cors = require('cors')
const { Pool } = require('pg')
require('dotenv').config()

const port = process.env.PORT

const app = express()

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
})

app.use(cors({
    origin: function (origin, callback) {
        if (origin == process.env.FRONTEND_URL)
            callback(null, true)
        else
            callback(new Error('Not allowed by CORS'))
    }
}))

app.use(express.json())

app.get('/', async (req, res) => {
    try {
        const client = await pool.connect()
        const result = await client.query('SELECT NOW()')
        client.release()

        res.json({ message: 'Database connected successfully', timestamp: result.rows[0].now })
    } catch (err) {
        console.error(err)

        res.status(500).json({ error: 'Database connection failed', details: err.message })
    }
})

app.listen(port, () => {
    console.log(`Backend listening at http://localhost:${port}`)
})

process.on('SIGINT', () => {
    console.log('Shutting down gracefully...')
    pool.end(() => {
        console.log('Database pool closed.')
        process.exit(0)
    })
})
