export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: unknown
}

export interface PaginationMetadata {
  totalItemCount: number
  returnedItemCount: number
  skippedItemCount: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: PaginationMetadata
}

export interface SmartApiConfig {
  baseURL: string
  token: string
  subscriptionKey: string
  timeout?: number
}
