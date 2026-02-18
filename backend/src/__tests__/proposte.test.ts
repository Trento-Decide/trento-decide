import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import jwt from "jsonwebtoken"
import { createApp } from "../app.js"
import type { QueryResult } from "pg"

const TEST_SECRET = "test-secret"

const mockClient = {
    query: vi.fn(),
    release: vi.fn(),
}

vi.mock("../database.js", () => ({
    pool: {
        query: vi.fn(),
        connect: vi.fn(() => mockClient),
    },
}))

vi.mock("../utils/env.js", () => ({
    default: (key: string) => {
        const vars: Record<string, string> = {
            FRONTEND_URL: "http://localhost:3000",
            JWT_SECRET: TEST_SECRET,
        }
        return vars[key] ?? ""
    },
    getOptionalEnvVar: () => undefined,
}))

vi.mock("../services/formValidation.js", () => ({
    validateProposalInput: vi.fn().mockResolvedValue(true),
}))

import { pool } from "../database.js"

const app = createApp()

function makeToken(userId: number, username = "testuser") {
    return jwt.sign({ sub: userId, username, v: 1 }, TEST_SECRET, { expiresIn: "1h" })
}

describe("POST /proposte/bozza", () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it("restituisce 401 senza token", async () => {
        const res = await request(app).post("/proposte/bozza").send({
            title: "Test Proposal",
            categoryId: 1,
        })

        expect(res.status).toBe(401)
    })

    it("restituisce 201 con token valido e dati corretti", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ id: 99 }],
            rowCount: 1,
        } as unknown as QueryResult)

        const token = makeToken(1)
        const res = await request(app)
            .post("/proposte/bozza")
            .set("Authorization", `Bearer ${token}`)
            .send({ title: "La mia bozza", categoryId: 1, description: "Un test" })

        expect(res.status).toBe(201)
        expect(res.body.id).toBe(99)
    })
})

describe("DELETE /proposte/:id", () => {
    beforeEach(() => vi.clearAllMocks())

    it("restituisce 401 senza token", async () => {
        const res = await request(app).delete("/proposte/1")
        expect(res.status).toBe(401)
    })

    it("restituisce 404 se la proposta non esiste", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 0 } as unknown as QueryResult)

        const token = makeToken(1)
        const res = await request(app)
            .delete("/proposte/1")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(404)
    })

    it("restituisce 403 se l'utente non è l'autore", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ author_id: 999 }],
            rowCount: 1,
        } as unknown as QueryResult)

        const token = makeToken(1)
        const res = await request(app)
            .delete("/proposte/1")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(403)
    })

    it("restituisce 204 se l'autore elimina la propria proposta", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ author_id: 1 }],
            rowCount: 1,
        } as unknown as QueryResult)
        vi.mocked(pool.query).mockResolvedValueOnce({ rows: [], rowCount: 1 } as unknown as QueryResult)

        const token = makeToken(1)
        const res = await request(app)
            .delete("/proposte/1")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(204)
    })
})

describe("POST /proposte/:id/vota", () => {
    beforeEach(() => {
        vi.clearAllMocks()
        mockClient.query.mockReset()
        mockClient.release.mockReset()
    })

    it("restituisce 401 senza token", async () => {
        const res = await request(app).post("/proposte/1/vota").send({ vote: 1 })
        expect(res.status).toBe(401)
    })

    it("restituisce 400 con valore di voto non valido", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ status_id: 2 }],
            rowCount: 1,
        } as unknown as QueryResult)

        const token = makeToken(1)
        const res = await request(app)
            .post("/proposte/1/vota")
            .set("Authorization", `Bearer ${token}`)
            .send({ vote: 5 })

        expect(res.status).toBe(400)
        expect(res.body.error).toBe("Invalid vote")
    })

    it("restituisce 200 con voto valido (+1)", async () => {
        vi.mocked(pool.query).mockResolvedValueOnce({
            rows: [{ status_id: 2, status_code: "pubblicata" }],
            rowCount: 1,
        } as unknown as QueryResult)

        mockClient.query.mockResolvedValueOnce({})
        mockClient.query.mockResolvedValueOnce({
            rows: [{ current_version: 1 }],
            rowCount: 1,
        })
        mockClient.query.mockResolvedValueOnce({})
        mockClient.query.mockResolvedValueOnce({
            rows: [{ total: 3 }],
        })
        mockClient.query.mockResolvedValueOnce({})
        mockClient.query.mockResolvedValueOnce({})

        const token = makeToken(1)
        const res = await request(app)
            .post("/proposte/1/vota")
            .set("Authorization", `Bearer ${token}`)
            .send({ vote: 1 })

        expect(res.status).toBe(200)
        expect(res.body.vote).toBe(1)
        expect(res.body.totalVotes).toBe(3)
    })
})
