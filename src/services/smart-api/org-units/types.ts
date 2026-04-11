import type { PaginatedResponse } from '../client/types'

export interface OrgUnit {
  id: string
  identifier: string
  name: string
  description: string
  organisationId: string
  address1: string
  address2: string
  town: string
  state: string
  postcode: string
  country: string
  homePhone: string
  workPhone: string
  fax: string
  latitude: string
  longitude: string
  enabled: boolean
  lastUpdated: string
}

export type GetOrgUnitsResponse = PaginatedResponse<OrgUnit>
