import { useState, useEffect } from 'react'
import { IoSchoolOutline } from 'react-icons/io5'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import { organisationsApi } from '../../services/smart-api/organisations'
import type { ApiError } from '../../services/smart-api/client/types'

function SchoolScreen() {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('')
  const [organisations, setOrganisations] = useState<
    { id: string; name: string }[] | null
  >(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchOrganisations = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await organisationsApi.getOrganisations()
        setOrganisations(response.items)
      } catch (err) {
        setError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    fetchOrganisations()
  }, [])

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoSchoolOutline size={28} />
        <h2 className="mb-0">School</h2>
      </div>

      {loading && (
        <div className="text-center py-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          <Alert.Heading>API Error</Alert.Heading>
          <p>{error.message}</p>
          {error.status && <p className="mb-0">Status: {error.status}</p>}
        </Alert>
      )}

      {!loading && !error && (
        <div className="mb-4">
          <Form.Label htmlFor="organisationSelect">Organisation</Form.Label>
          <Form.Select
            id="organisationSelect"
            value={selectedOrganisation}
            onChange={(e) => setSelectedOrganisation(e.target.value)}
          >
            <option value="">Select an organisation...</option>
            {organisations?.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </Form.Select>
        </div>
      )}

      <p className="text-muted">Manage your school information and settings.</p>

      <div className="mt-4">
        <h5>School Overview</h5>
        <p>School information and management features will be added here.</p>
      </div>
    </div>
  )
}

export default SchoolScreen
