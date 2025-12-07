import { jwtDecode } from "jwt-decode"

import { User } from "../../shared/models"

export const getUserData = (): User | null => {
  if (typeof window === "undefined") return null

  try {
    const userData = localStorage.getItem("userData")
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
    localStorage.removeItem("accessToken")
    localStorage.removeItem("userData")
    try {
      window.dispatchEvent(new CustomEvent("authChange"))
    } catch (err) {
      console.error("Failed to dispatch authChange event", err)
    }
  }
}

export const checkToken = () => {
  const token = localStorage.getItem("token")

  if (token) {
    const decoded = jwtDecode(token)
    const currentTime = Date.now() / 1000

    if (typeof decoded.exp === "number" && decoded.exp < currentTime + 60) {
      logout()
    }
  }
}
