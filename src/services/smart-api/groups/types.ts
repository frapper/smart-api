import type { PaginatedResponse } from '../client/types'

export interface Group {
  id: string
  enabled: boolean
  identifier: string
  name: string
  description: string
  groupTypeId: string
  organisationId: string
  orgUnitId: string
  accountSource: string
  lastUpdated: string
}

export interface CreateGroupRequest {
  identifier: string
  name: string
  description: string
  enabled: boolean
  groupTypeId: string
  organisationId: string
  orgUnitId: string
}

export type GetGroupsResponse = PaginatedResponse<Group>
