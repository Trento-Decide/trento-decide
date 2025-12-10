export interface User {
  id: number
  username: string
  email: string
  notifications: boolean
  role: "amministratore" | "moderatore" | "cittadino"
}

export interface PropostaInfo {
  title: string
  description: string
  category: string
}

export interface Proposta extends PropostaInfo {
  id: number
  author: string
  date: string
  timestamp: string
  status: string
  votes: number
  isFavourited?: boolean
}

export interface Filters {
  authorId?: number
  favourites?: boolean
}
