import type { GetUsersResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const usersApi = {
  /**
   * Fetch users/students for a specific org-unit
   * GET /users/v4/users?$filter=orgUnitId eq '{orgUnitId}'&$top={pageSize}
   */
  getUsersByOrgUnit: async (
    orgUnitId: string,
    pageSize?: number
  ): Promise<GetUsersResponse> => {
    const client = getSmartApiClient().getInstance()

    const params: Record<string, string> = {
      $filter: `orgUnitId eq '{${orgUnitId}}'`,
    }

    if (pageSize !== undefined) {
      params.$top = pageSize.toString()
    }

    const response = await client.get<GetUsersResponse>(
      '/users/v4/users',
      {
        params,
      }
    )

    return response.data
  },
}
