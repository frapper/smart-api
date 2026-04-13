import type { GetGroupTypesResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const groupTypesApi = {
  /**
   * Fetch all group types
   * GET /users/v4/group-types?$top=200
   */
  getGroupTypes: async (): Promise<GetGroupTypesResponse> => {
    const client = getSmartApiClient().getInstance()

    const response = await client.get<GetGroupTypesResponse>('/users/v4/group-types', {
      params: {
        $top: '200',
      },
    })

    return response.data
  },
}
