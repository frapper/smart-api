import type { GetOrgUnitsResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const orgUnitsApi = {
  /**
   * Fetch org-units for a specific organisation
   * GET /users/v4/org-unit?$filter=id eq {organisationId}
   */
  getOrgUnitsByOrganisation: async (
    organisationId: string
  ): Promise<GetOrgUnitsResponse> => {
    const client = getSmartApiClient().getInstance()

    const response = await client.get<GetOrgUnitsResponse>(
      '/users/v4/org-units',
      {
        params: {
          $filter: `organisationid eq '{${organisationId}}'`,
        },
      }
    )

    return response.data
  },
}
