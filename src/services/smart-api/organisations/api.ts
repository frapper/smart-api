import type { GetOrganisationsResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const organisationsApi = {
  /**
   * Fetch organisations
   * GET /user/v4/org
   */
  getOrganisations: async (): Promise<GetOrganisationsResponse> => {
    const client = getSmartApiClient().getInstance()

    const response =
      await client.get<GetOrganisationsResponse>('/users/v4/orgs')

    return response.data
  },
}
