import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import bcrypt from "bcrypt"
import { createApp } from "../app.js"
import { QueryResult } from "pg"

vi.mock("../database.js", () => ({
  pool: { query: vi.fn(), connect: vi.fn() },
}))

vi.mock("../utils/env.js", () => ({
  default: (key: string) => {
    const vars: Record<string, string> = {
      FRONTEND_URL: "http://localhost:3000",
      JWT_SECRET: "test-secret",
    }
    return vars[key] ?? ""
  },
  getOptionalEnvVar: () => undefined,
}))

import { pool } from "../database.js"

const app = createApp()

describe("POST /auth/login", () => {
  beforeEach(() => vi.clearAllMocks())

  it("restituisce 400 se il body è vuoto", async () => {
    const res = await request(app).post("/auth/login").send({})
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("restituisce 401 se l'utente non esiste", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/login").send({
      email: "nonexistent@example.com",
      password: "SomePass1!",
    })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe("Invalid credentials")
  })

  it("restituisce 401 se la password è sbagliata", async () => {
    const hash = await bcrypt.hash("CorrectPassword1", 10)
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{
        id: 1,
        username: "alice",
        email: "alice@example.com",
        password_hash: hash,
        is_banned: false,
        email_opt_in: true,
        created_at: new Date(),
        role_id: 1,
        role_code: "cittadino",
        role_labels: { it: "Cittadino" },
        role_colour: "#000",
      }],
      rowCount: 1,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "WrongPassword1",
    })

    expect(res.status).toBe(401)
    expect(res.body.error).toBe("Invalid credentials")
  })

  it("restituisce 200 con token e dati utente se le credenziali sono valide", async () => {
    const hash = await bcrypt.hash("CorrectPass1", 10)
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{
        id: 1,
        username: "alice",
        email: "alice@example.com",
        password_hash: hash,
        is_banned: false,
        email_opt_in: true,
        created_at: new Date(),
        role_id: 1,
        role_code: "cittadino",
        role_labels: { it: "Cittadino" },
        role_colour: "#000",
      }],
      rowCount: 1,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "CorrectPass1",
    })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty("accessToken")
    expect(res.body.user.username).toBe("alice")
  })

  it("restituisce 403 se l'utente è bannato", async () => {
    const hash = await bcrypt.hash("CorrectPass1", 10)
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{
        id: 1,
        username: "banned_user",
        email: "banned@example.com",
        password_hash: hash,
        is_banned: true,
        email_opt_in: false,
        created_at: new Date(),
        role_id: 1,
        role_code: "cittadino",
        role_labels: { it: "Cittadino" },
        role_colour: "#000",
      }],
      rowCount: 1,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/login").send({
      email: "banned@example.com",
      password: "CorrectPass1",
    })

    expect(res.status).toBe(403)
    expect(res.body.error).toBe("User is banned")
  })
})

describe("POST /auth/register", () => {
  beforeEach(() => vi.clearAllMocks())

  it("restituisce 400 se il body è vuoto", async () => {
    const res = await request(app).post("/auth/register").send({})
    expect(res.status).toBe(400)
    expect(res.body).toHaveProperty("error")
  })

  it("restituisce 400 se la password è troppo debole", async () => {
    const res = await request(app).post("/auth/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "short",
      confirmPassword: "short",
    })

    expect(res.status).toBe(400)
  })

  it("restituisce 409 se lo username è già in uso", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ id: 1 }],
      rowCount: 1,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/register").send({
      username: "alice",
      email: "newalice@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    })

    expect(res.status).toBe(409)
    expect(res.body.error).toBe("Username already taken")
  })

  it("restituisce 409 se l'email è già registrata", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [],
      rowCount: 0,
    } as unknown as QueryResult)

    vi.mocked(pool.query).mockResolvedValueOnce({
      rows: [{ id: 1 }],
      rowCount: 1,
    } as unknown as QueryResult)

    const res = await request(app).post("/auth/register").send({
      username: "newuser",
      email: "alice@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    })

    expect(res.status).toBe(409)
    expect(res.body.error).toBe("Email already registered")
  })

  it("restituisce 201 con registrazione avvenuta", async () => {
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 } as unknown as QueryResult)
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 } as unknown as QueryResult)
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [{ id: 1 }], rowCount: 1 } as unknown as QueryResult)
    vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 1 } as unknown as QueryResult)

    const res = await request(app).post("/auth/register").send({
      username: "newuser",
      email: "new@example.com",
      password: "StrongPass1",
      confirmPassword: "StrongPass1",
    })

    expect(res.status).toBe(201)
    expect(res.body.message).toBe("User registered")
  })
})

describe("Gestione 404", () => {
  it("restituisce 404 per endpoint sconosciuti", async () => {
    const res = await request(app).get("/nonexistent")
    expect(res.status).toBe(404)
    expect(res.body.error).toBe("Endpoint not found")
  })
})
