import { describe, it, expect, vi, beforeEach } from "vitest"
import request from "supertest"
import jwt from "jsonwebtoken"
import express from "express"
import { authenticateToken } from "../middleware/authMiddleware.js"

vi.mock("../utils/env.js", () => ({
    default: (key: string) => {
        const vars: Record<string, string> = {
            JWT_SECRET: "test-secret",
        }
        return vars[key] ?? ""
    },
    getOptionalEnvVar: () => undefined,
}))

vi.mock("../database.js", () => ({
    pool: { query: vi.fn() },
}))

function createTestApp() {
    const app = express()
    app.use(express.json())
    app.get("/protected", authenticateToken, (req, res) => {
        res.json({ userId: req.user?.sub, username: req.user?.username })
    })
    return app
}

const TEST_SECRET = "test-secret"

describe("Middleware authenticateToken", () => {
    const app = createTestApp()

    beforeEach(() => vi.clearAllMocks())

    it("restituisce 401 senza header Authorization", async () => {
        const res = await request(app).get("/protected")
        expect(res.status).toBe(401)
        expect(res.body.error).toBe("Missing Authorization token")
    })

    it("restituisce 401 con header Authorization malformato", async () => {
        const res = await request(app)
            .get("/protected")
            .set("Authorization", "NotBearer abc123")
        expect(res.status).toBe(401)
    })

    it("restituisce 403 con token scaduto", async () => {
        const token = jwt.sign({ sub: 1, username: "alice", v: 1 }, TEST_SECRET, {
            expiresIn: "-1s",
        })
        const res = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(403)
        expect(res.body.error).toBe("Invalid or expired token")
    })

    it("restituisce 200 con dati utente decodificati se il token è valido", async () => {
        const token = jwt.sign({ sub: 42, username: "bob", v: 1 }, TEST_SECRET, {
            expiresIn: "1h",
        })
        const res = await request(app)
            .get("/protected")
            .set("Authorization", `Bearer ${token}`)

        expect(res.status).toBe(200)
        expect(res.body.userId).toBe(42)
        expect(res.body.username).toBe("bob")
    })
})
