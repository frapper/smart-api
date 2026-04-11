import type { GetOrgUnitsResponse } from './types'
import { getSmartApiClient } from '../client/axiosClient'

export const orgUnitsApi = {
  /**
   * Fetch org-units for a specific organisation
   * GET /users/v4/org-unit?$filter=id eq {organisationId}&$top={pageSize}
   */
  getOrgUnitsByOrganisation: async (
    organisationId: string,
    pageSize?: number
  ): Promise<GetOrgUnitsResponse> => {
    const client = getSmartApiClient().getInstance()

    const params: Record<string, string> = {
      $filter: `organisationid eq '{${organisationId}}'`,
    }

    if (pageSize !== undefined) {
      params.$top = pageSize.toString()
    }

    const response = await client.get<GetOrgUnitsResponse>(
      '/users/v4/org-units',
      {
        params,
      }
    )

    return response.data
  },
}
