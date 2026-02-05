import { logout, getAccessToken, setAccessToken, setUserData, setProviderToken } from "@/lib/local"
import {
  Proposal,
  ProposalSearchItem,
  User,
  ProposalFilters,
  GlobalFilters,
  GlobalSearchItem,
  Status,
  Category,
  CategoryFormSchema,
  ProposalInput,
  ApiError,
  PollFilters,
  PollSearchItem,
  Poll,
  PollCreateInput,
  ID,
  DashboardStats
} from "../../shared/models"

const apiUrl = process.env.NEXT_PUBLIC_API_URL

const getToken = () => {
  return getAccessToken()
}

const getAuthHeaders = (includeJson = true) => {
  const headers: Record<string, string> = {}
  if (includeJson) headers["Content-Type"] = "application/json"
  const token = getToken()
  if (token) headers["Authorization"] = `Bearer ${token}`
  return headers
}

const handleResponse = async <T>(res: Response): Promise<T> => {
  if (res.status === 204 || res.status === 205) {
    return {} as T
  }

  let body: unknown
  const contentType = res.headers.get("content-type")

  try {
    if (contentType && contentType.includes("application/json")) {
      body = await res.json()
    } else {
      body = await res.text()
    }
  } catch {
    if (res.ok) return {} as T
    throw new ApiError("Invalid response format from server")
  }

  if (!res.ok) {
    if (res.status === 401) {
      logout()
    }

    let errorMessage = `Error ${res.status}`
    if (typeof body === 'object' && body !== null) {
      const b = body as Record<string, unknown>
      if (typeof b.error === 'string') errorMessage = b.error
      else if (typeof b.message === 'string') errorMessage = b.message
    } else if (typeof body === 'string') {
      errorMessage = body
    } else if (res.statusText) {
      errorMessage = res.statusText
    }

    throw new ApiError(errorMessage, res.status)
  }

  return body as T
}

const apiFetch = async <T>(input: RequestInfo | URL, init?: RequestInit): Promise<T> => {
  try {
    const res = await fetch(input, init)
    return await handleResponse<T>(res)
  } catch (error: unknown) {
    if (error instanceof ApiError) {
      throw error
    }
    // Network errors or other unexpected errors
    throw new ApiError(error instanceof Error ? error.message : "Si è verificato un errore imprevisto")
  }
}

export const providerLogin = async () => {
  const url = `${apiUrl}/auth/provider`
  const body = await apiFetch<{ providerToken: string }>(url, { method: "GET" })

  setProviderToken(body.providerToken)
}

export const register = async (username: string, email: string, password: string, confirmPassword: string, emailOptIn: boolean) => {
  const url = `${apiUrl}/auth/register`
  await apiFetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, confirmPassword, emailOptIn })
  })
}

export const login = async (email: string, password: string) => {
  const url = `${apiUrl}/auth/login`
  const body = await apiFetch<{ accessToken: string; user: User }>(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  })

  setAccessToken(body.accessToken)
  setUserData(body.user)
  try {
    window.dispatchEvent(new CustomEvent("authChange"))
  } catch {
    /* ignore in non-browser envs */
  }

  return body
}

export const globalSearch = async (filters: GlobalFilters): Promise<{ data: GlobalSearchItem[] }> => {
  const url = new URL(`${apiUrl}/cerca`)

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof GlobalFilters]
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  return apiFetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
    cache: "no-store"
  })
}

export const getProposals = async (filters: ProposalFilters = {}): Promise<ProposalSearchItem[]> => {
  const url = new URL(`${apiUrl}/proposte`)

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof ProposalFilters]
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  return apiFetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
    cache: "no-store"
  })
}

export const getProposal = async (id: number): Promise<Proposal> => {
  const url = `${apiUrl}/proposte/${id}`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false) })
}

export const getMyVoteForProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  const body = await apiFetch<{ vote: number | null }>(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
  })
  return body.vote
}

export const voteOnProposal = async (proposalId: number, vote: 1 | -1) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  return apiFetch<{ vote: number; totalVotes: number }>(url.toString(), {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ vote }),
  })
}

export const removeVoteFromProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/vota`)

  return apiFetch<{ totalVotes: number }>(url.toString(), {
    method: "DELETE",
    headers: getAuthHeaders(false),
  })
}

export const addFavouriteProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  return apiFetch<{ isFavourited: boolean }>(url.toString(), {
    method: "POST",
    headers: getAuthHeaders(false),
  })
}

export const removeFavouriteProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  return apiFetch<{ isFavourited: boolean }>(url.toString(), {
    method: "DELETE",
    headers: getAuthHeaders(false),
  })
}

export const getFavouriteForProposal = async (proposalId: number) => {
  const url = new URL(`${apiUrl}/proposte/${proposalId}/preferisco`)

  const body = await apiFetch<{ isFavourited: boolean }>(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
  })
  return body.isFavourited
}

export const getStatuses = async (): Promise<{ data: Status[] }> => {
  const url = `${apiUrl}/config/statuses`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false), cache: "no-store" })
}

export const getCategories = async (): Promise<{ data: Category[] }> => {
  const url = `${apiUrl}/config/categories`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false), cache: "no-store" })
}

export const getCategoryFormSchema = async (categoryId: number): Promise<{ data: CategoryFormSchema }> => {
  const url = `${apiUrl}/config/categories/${categoryId}/form`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false), cache: "no-store" })
}

export const createDraft = async (input: ProposalInput) => {
  const url = `${apiUrl}/proposte/bozza`
  return apiFetch<{ id: number }>(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(input),
  })
}

export const saveDraft = async (proposalId: number, input: Partial<ProposalInput>) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  return apiFetch(url, {
    method: "PATCH",
    headers: getAuthHeaders(true),
    body: JSON.stringify(input),
  })
}

export const publishProposal = async (proposalId: number) => {
  const url = `${apiUrl}/proposte/${proposalId}/pubblica`
  return apiFetch(url, { method: "POST", headers: getAuthHeaders(false) })
}

export const updateProposal = async (proposalId: number, input: ProposalInput) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  return apiFetch(url, { method: "PUT", headers: getAuthHeaders(true), body: JSON.stringify(input) })
}

export const deleteProposal = async (proposalId: number) => {
  const url = `${apiUrl}/proposte/${proposalId}`
  return apiFetch(url, { method: "DELETE", headers: getAuthHeaders(false) })
}

export const deleteProfile = async () => {
  const url = `${apiUrl}/utente`
  // Special case for deleteProfile because it might return 204
  const res = await fetch(url, { method: "DELETE", headers: getAuthHeaders(false) })
  if (res.status === 204) {
    logout()
    return
  }
  return handleResponse(res).catch((err) => {
    if (err instanceof ApiError) throw err
    throw new ApiError(err instanceof Error ? err.message : "Si è verificato un errore imprevisto")
  })
}

export const getPolls = async (filters: PollFilters = {}): Promise<PollSearchItem[]> => {
  const url = new URL(`${apiUrl}/sondaggi`)

  Object.keys(filters).forEach(key => {
    const value = filters[key as keyof PollFilters]
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value))
    }
  })

  return apiFetch(url.toString(), {
    method: "GET",
    headers: getAuthHeaders(false),
    cache: "no-store"
  })
}

export const getPoll = async (id: number): Promise<{ data: Poll; userHasVoted: boolean }> => {
  const url = `${apiUrl}/sondaggi/${id}`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false) })
}

export const createPoll = async (input: PollCreateInput): Promise<{ success: true; pollId: ID }> => {
  const url = `${apiUrl}/sondaggi`
  return apiFetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify(input)
  })
}

export const votePoll = async (pollId: number, questionId: number, selectedOptionId: number): Promise<{ success: boolean }> => {
  const url = `${apiUrl}/sondaggi/${pollId}/vota`
  return apiFetch(url, {
    method: "POST",
    headers: getAuthHeaders(true),
    body: JSON.stringify({ questionId, selectedOptionId })
  })
}



export const getDashboardStats = async (): Promise<DashboardStats> => {
  const url = `${apiUrl}/dashboard/stats`
  return apiFetch(url, { method: "GET", headers: getAuthHeaders(false) })
}