import { Pool } from 'pg'
import { databaseConfig } from './config.js'

export const pool = new Pool(databaseConfig)