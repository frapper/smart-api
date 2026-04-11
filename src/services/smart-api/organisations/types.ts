import type { PaginatedResponse } from '../client/types'

export interface Organisation {
  id: string
  identifier: string
  name: string
  description: string
  lastUpdated: string
}

export interface GetOrganisationsParams {
  skip?: number
  take?: number
  search?: string
}

export type GetOrganisationsResponse = PaginatedResponse<Organisation>
