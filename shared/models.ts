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

export interface ProposalFilters extends Filters {
  q?: string
  titlesOnly?: boolean 
  author?: string
  category?: string
  status?: string
  minVotes?: number
  maxVotes?: number
  dateFrom?: string
  dateTo?: string
  sortBy?: 'date' | 'votes' | 'title'
  sortOrder?: 'asc' | 'desc'
}

export interface GlobalSearchFilters {
  q: string;
  titlesOnly?: boolean;
  author?: string;
  type?: 'all' | 'proposta' | 'sondaggio';
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  status?: string;
  minVotes?: number;
  maxVotes?: number;
}

export interface SearchResultItem {
  type: 'proposta' | 'sondaggio'
  id: number
  title: string
  description: string
  author?: string
  category?: string
  date?: string
  timestamp?: string
  score?: number
}