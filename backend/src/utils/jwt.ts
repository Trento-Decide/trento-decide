import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import getEnvVar from "../../../shared/env.js"
import type { JwtUserPayload } from "../../../shared/auth.js"

export function signJwt(
  payload: Omit<JwtUserPayload, "iat" | "exp">,
  opts?: { expiresIn?: SignOptions["expiresIn"] }
) {
  const secretValue = getEnvVar("JWT_SECRET")
  if (!secretValue) {
    throw new Error("JWT_SECRET missing")
  }
  const secret: Secret = secretValue

  const finalPayload: JwtUserPayload = {
    ...payload,
    v: payload.v ?? 1,
  }

  const options: SignOptions =
    typeof opts?.expiresIn !== "undefined"
      ? { expiresIn: opts.expiresIn }
      : { expiresIn: "24h" }

  return jwt.sign(finalPayload as object, secret, options)
}