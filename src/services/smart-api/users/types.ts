import type { PaginatedResponse } from '../client/types'

export interface User {
  id: string
  enabled: boolean
  username: string
  email: string
  studentOrEmployeeId: string
  firstName: string
  lastName: string
  preferredName: string
  dateOfBirth: string
  gender: string
  genderId: string
  mobilePhone: string
  workPhone: string
  streetAddress: string
  suburb: string
  state: string
  country: string
  postCode: string
  accountSource: string
  organisationId: string
  orgUnitId: string
  mainRoleId: string
  lastUpdated: string
}

export type GetUsersResponse = PaginatedResponse<User>
