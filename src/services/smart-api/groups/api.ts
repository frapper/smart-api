import type { GetGroupsResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const groupsApi = {
  /**
   * Fetch groups for a specific org-unit
   * GET /users/v4/groups?$filter=orgunitid eq '{orgUnitId}'&$top={pageSize}
   */
  getGroupsByOrgUnit: async (
    orgUnitId: string,
    pageSize?: number
  ): Promise<GetGroupsResponse> => {
    const client = getSmartApiClient().getInstance()

    const params: Record<string, string> = {
      $filter: `orgunitid eq '{${orgUnitId}}'`,
    }

    if (pageSize !== undefined) {
      params.$top = pageSize.toString()
    }

    const response = await client.get<GetGroupsResponse>(
      '/users/v4/groups',
      {
        params,
      }
    )

    return response.data
  },
}
