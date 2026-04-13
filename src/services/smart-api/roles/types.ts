import type { PaginatedResponse } from '../client/types'

export interface Role {
  id: string
  identifier: string
  name: string
  description: string
  mainRole: boolean
  notInUse: boolean
  lastUpdated: string
}

export type GetRolesResponse = PaginatedResponse<Role>
