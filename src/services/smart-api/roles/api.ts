import type { GetRolesResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const rolesApi = {
  /**
   * Fetch all roles
   * GET /users/v4/roles?$top=200
   */
  getRoles: async (): Promise<GetRolesResponse> => {
    const client = getSmartApiClient().getInstance()

    const response = await client.get<GetRolesResponse>('/users/v4/roles', {
      params: {
        $top: '200',
      },
    })

    return response.data
  },
}
