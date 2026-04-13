import type { GetGroupsResponse, CreateGroupRequest, Group } from './types'
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

  /**
   * Create a new group
   * POST /users/v4/groups
   */
  createGroup: async (group: CreateGroupRequest): Promise<Group> => {
    const client = getSmartApiClient().getInstance()

    const response = await client.post<Group>('/users/v4/groups', group)

    return response.data
  },

  /**
   * Update a group
   * PUT /users/v4/groups/{groupId}
   */
  updateGroup: async (groupId: string, group: CreateGroupRequest): Promise<Group> => {
    const client = getSmartApiClient().getInstance()

    const response = await client.put<Group>(`/users/v4/groups/${groupId}`, group)

    return response.data
  },

  /**
   * Delete a group
   * DELETE /users/v4/groups/{id}
   */
  deleteGroup: async (id: string): Promise<void> => {
    const client = getSmartApiClient().getInstance()

    await client.delete(`/users/v4/groups/${id}`)
  },
}
