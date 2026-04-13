import type { PaginatedResponse } from '../client/types'

export interface GroupType {
  id: string
  name: string
  description: string
  lastUpdated: string
}

export type GetGroupTypesResponse = PaginatedResponse<GroupType>
