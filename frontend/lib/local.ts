import { jwtDecode } from "jwt-decode"

import { User } from "../../shared/models"

const ACCESS_TOKEN_KEY = "accessToken"
const USER_DATA_KEY = "userData"
const PROVIDER_TOKEN_KEY = "providerToken"

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(ACCESS_TOKEN_KEY, token)
  }
}

export const setUserData = (user: User) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(user))
  }
}

export const setProviderToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(PROVIDER_TOKEN_KEY, token)
  }
}

export const getUserData = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem(USER_DATA_KEY)
    if (!userData) return null

    return JSON.parse(userData) as User
  } catch (err) {
    console.error("Error parsing user data, clearing invalid localStorage item", err)
    logout()
    return null
  }
}

export const logout = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    localStorage.removeItem(PROVIDER_TOKEN_KEY)
    try {
      window.dispatchEvent(new CustomEvent("authChange"))
    } catch (err) {
      console.error("Failed to dispatch authChange event", err)
    }
  }
}

export const checkToken = () => {
  const token = getAccessToken()

  if (token) {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (typeof decoded.exp === "number" && decoded.exp < currentTime + 60) {
      logout()
    }
  }
}
