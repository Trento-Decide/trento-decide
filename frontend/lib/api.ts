import { ApiError } from "next/dist/server/api-utils"

import { logout } from "@/lib/local"
import type {
  Proposal,
  ProposalSearchItem,
  User,
  ProposalFilters,
  GlobalSearchFilters,
  GlobalSearchItem,
  Category,
  CategoryFormSchema,
  ProposalInput,
} from "../../shared/models"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getToken = () => {
  if (typeof window === "undefined") return null
  return localStorage.getItem("accessToken")
}

const getAuthHeaders = (includeJson = true) => {
  const headers: Record<string, string> = {}
  if (includeJson) headers["Content-Type"] = "application/json"
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  const text = await res.text()
  const body = text ? JSON.parse(text) : {}

  if (!res.ok) {
    if (res.status === 401) {
      logout()
    }
    const message = body.error || res.statusText
    throw new ApiError(res.status, message)
  }

  return body as T
}

export const providerLogin = async () => {
  const url = `${apiUrl}/auth/provider`
  const res = await fetch(url, { method: "GET" })
  const body = (await handleResponse(res)) as { providerToken: string }

  if (typeof window !== "undefined") {
    localStorage.setItem("providerToken", body.providerToken)
  }
}

export const register = async (username: string, email: string, password: string) => {
  const url = `${apiUrl}/auth/register`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password })
  })
  await handleResponse(res)
}

export const login = async (email: string, password: string) => {
  const url = `${apiUrl}/auth/login`
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })
  const body = (await handleResponse(res)) as { accessToken: string; user: User }

  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", body.accessToken)
    localStorage.setItem("userData", JSON.stringify(body.user))
    try {
      window.dispatchEvent(new CustomEvent("authChange"))
    } catch {
      /* ignore in non-browser envs */
    }
  }
  return body
}

export const globalSearch = async (filters: GlobalSearchFilters): Promise<{ data: GlobalSearchItem[] }> => {
  const url = new URL(`${apiUrl}/cerca`)

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof GlobalSearchFilters]
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
    cache: "no-store"
  })

  return handleResponse(res)
}

export const getProposals = async (filters: ProposalFilters = {}): Promise<ProposalSearchItem[]> => {
  const url = new URL(`${apiUrl}/proposte`)

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ProposalFilters]
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
    cache: "no-store"
  })

  return handleResponse(res)
}

export const getProposal = async (id: number): Promise<Proposal> => {
  const url = `${apiUrl}/proposte/${id}`
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders(false) })
  return handleResponse(res)
}

export const getMyVoteForProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
  })

  const body = (await handleResponse(res)) as { vote: number | null }
  return body.vote
}

export const voteOnProposal = async (proposalId: number, vote: 1 | -1) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ vote }),
  })

  const body = (await handleResponse(res)) as { vote: number; totalVotes: number }
  return body
}

export const removeVoteFromProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: getAuthHeaders(false),
  })

  const body = (await handleResponse(res)) as { totalVotes: number }
  return body
}

export const addFavouriteProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  const res = await fetch(url.toString(), {
    method: "POST",
    headers: getAuthHeaders(false),
  })

  const body = (await handleResponse(res)) as { isFavourited: boolean }
  return body
}

export const removeFavouriteProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: getAuthHeaders(false),
  })

  const body = (await handleResponse(res)) as { isFavourited: boolean }
  return body
}

export const getFavoriteForProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
  })

  const body = (await handleResponse(res)) as { isFavourited: boolean }
  return body.isFavourited
}

export const getCategories = async (): Promise<{ data: Category[] }> => {
  const url = `${apiUrl}/config/categories`
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders(false), cache: "no-store" })
  return handleResponse(res)
}

export const getCategoryFormSchema = async (categoryId: number): Promise<{ data: CategoryFormSchema }> => {
  const url = `${apiUrl}/config/categories/${categoryId}/form`
  const res = await fetch(url, { method: "GET", headers: getAuthHeaders(false), cache: "no-store" })
  return handleResponse(res)
}

export const createDraft = async (input: ProposalInput) => {
  const url = `${apiUrl}/proposte/bozza`
  const res = await fetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(input),
  })
  return handleResponse<{ id: number }>(res)
}

export const saveDraft = async (proposalId: number, input: Partial<ProposalInput>) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  const res = await fetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(input),
  })
  return handleResponse(res)
}

export const publishProposal = async (proposalId: number) => {
  const url = `${apiUrl}/proposte/${proposalId}/pubblica`
  const res = await fetch(url, { method: "POST", headers: getAuthHeaders(false) })
  return handleResponse(res)
}

export const updateProposal = async (proposalId: number, input: ProposalInput) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  const res = await fetch(url, { method: "PUT", headers: getAuthHeaders(true), body: JSON.stringify(input) })
  return handleResponse(res)
}

export const deleteProposal = async (proposalId: number) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  const res = await fetch(url, { method: "DELETE", headers: getAuthHeaders(false) })
  return handleResponse(res)
}
