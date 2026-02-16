import type { ProposalFilters, ProposalInput } from "../../../shared/models.js"

export function parseBoolean(value: unknown): boolean | undefined {
  if (value === undefined) return undefined
  if (value === "true" || value === true) return true
  if (value === "false" || value === false) return false
  return undefined
}

export function parseNumber(value: unknown): number | undefined {
  if (value === undefined) return undefined
  const n = Number(value)
  return Number.isFinite(n) ? n : undefined
}

export function parseDate(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined
  return value
}

export function parseFilters(q: Record<string, unknown>): ProposalFilters {
  const filters: ProposalFilters = {}

  if (typeof q.q === "string" && q.q.length > 0) filters.q = q.q
  if (typeof q.authorUsername === "string") filters.authorUsername = q.authorUsername
  if (typeof q.categoryCode === "string") filters.categoryCode = q.categoryCode
  if (typeof q.statusCode === "string") filters.statusCode = q.statusCode

  const titlesOnly = parseBoolean(q.titlesOnly)
  if (titlesOnly !== undefined) filters.titlesOnly = titlesOnly

  const favourites = parseBoolean(q.favourites)
  if (favourites !== undefined) filters.favourites = favourites

  const authorId = parseNumber(q.authorId)
  if (authorId !== undefined) filters.authorId = authorId

  const categoryId = parseNumber(q.categoryId)
  if (categoryId !== undefined) filters.categoryId = categoryId

  const statusId = parseNumber(q.statusId)
  if (statusId !== undefined) filters.statusId = statusId

  const minVotes = parseNumber(q.minVotes)
  if (minVotes !== undefined) filters.minVotes = minVotes

  const maxVotes = parseNumber(q.maxVotes)
  if (maxVotes !== undefined) filters.maxVotes = maxVotes

  const dateFrom = parseDate(q.dateFrom)
  if (dateFrom !== undefined) filters.dateFrom = dateFrom

  const dateTo = parseDate(q.dateTo)
  if (dateTo !== undefined) filters.dateTo = dateTo

  const limit = parseNumber(q.limit)
  if (limit !== undefined) filters.limit = limit

  if (typeof q.sortBy === "string" && ["date", "votes", "title"].includes(q.sortBy)) {
    filters.sortBy = q.sortBy as "date" | "votes" | "title"
  }

  if (typeof q.sortOrder === "string" && ["asc", "desc"].includes(q.sortOrder)) {
    filters.sortOrder = q.sortOrder as "asc" | "desc"
  }

  return filters
}

export function normalizeProposalInput(input: ProposalInput) {
  if (typeof input.title === 'string') input.title = input.title.trim()
  if (typeof input.description === 'string') input.description = input.description.trim()
}
