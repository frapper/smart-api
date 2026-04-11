import { useState, useEffect, useMemo } from 'react'
import { IoSchoolOutline } from 'react-icons/io5'
import Form from 'react-bootstrap/Form'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { organisationsApi } from '../../services/smart-api/organisations'
import { orgUnitsApi } from '../../services/smart-api/org-units'
import type { ApiError } from '../../services/smart-api/client/types'
import type { OrgUnit } from '../../services/smart-api/org-units/types'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface SchoolScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
  onNavigateToStudents: () => void
}

function SchoolScreen({ selectedSchool, onSchoolSelect, onNavigateToStudents }: SchoolScreenProps) {
  const [selectedOrganisation, setSelectedOrganisation] = useState<string>('')
  const [organisations, setOrganisations] = useState<
    { id: string; name: string }[] | null
  >(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  const [orgUnits, setOrgUnits] = useState<OrgUnit[] | null>(null)
  const [orgUnitsLoading, setOrgUnitsLoading] = useState<boolean>(false)
  const [orgUnitsError, setOrgUnitsError] = useState<ApiError | null>(null)

  const [schoolIdFilter, setSchoolIdFilter] = useState<string>('')
  const [schoolNameFilter, setSchoolNameFilter] = useState<string>('')
  const [filterOperator, setFilterOperator] = useState<'and' | 'or'>('and')

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

  useEffect(() => {
    const fetchOrgUnits = async () => {
      if (!selectedOrganisation) {
        setOrgUnits(null)
        setOrgUnitsError(null)
        return
      }

      setOrgUnitsLoading(true)
      setOrgUnitsError(null)
      try {
        const response = await orgUnitsApi.getOrgUnitsByOrganisation(
          selectedOrganisation
        )
        setOrgUnits(response.items)
      } catch (err) {
        setOrgUnitsError(err as ApiError)
      } finally {
        setOrgUnitsLoading(false)
      }
    }

    fetchOrgUnits()
  }, [selectedOrganisation])

  const handleSchoolClick = (orgUnit: OrgUnit) => {
    onSchoolSelect({
      id: orgUnit.id,
      name: orgUnit.name,
      identifier: orgUnit.identifier,
    })
    onNavigateToStudents()
  }

  const filteredOrgUnits = useMemo(() => {
    if (!orgUnits) return null

    return orgUnits.filter((orgUnit) => {
      const matchesId = schoolIdFilter === '' || orgUnit.identifier.toLowerCase().includes(schoolIdFilter.toLowerCase())
      const matchesName = schoolNameFilter === '' || orgUnit.name.toLowerCase().includes(schoolNameFilter.toLowerCase())

      if (filterOperator === 'and') {
        return matchesId && matchesName
      } else {
        return matchesId || matchesName
      }
    })
  }, [orgUnits, schoolIdFilter, schoolNameFilter, filterOperator])

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
        <>
          <div className="mb-4">
            <Form.Label htmlFor="organisationSelect">Organisation</Form.Label>
            <Form.Select
              id="organisationSelect"
              value={selectedOrganisation}
              onChange={(e) => {
                setSelectedOrganisation(e.target.value)
              }}
            >
              <option value="">Select an organisation...</option>
              {organisations?.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </Form.Select>
          </div>

          {orgUnits && orgUnits.length > 0 && (
            <>
              <Row className="g-3 mb-3">
                <Col xs={12} md={6}>
                  <Form.Label htmlFor="schoolIdFilter">Filter by School ID</Form.Label>
                  <Form.Control
                    type="text"
                    id="schoolIdFilter"
                    placeholder="Enter school ID..."
                    value={schoolIdFilter}
                    onChange={(e) => setSchoolIdFilter(e.target.value)}
                  />
                </Col>
                <Col xs={12} md={6}>
                  <Form.Label htmlFor="schoolNameFilter">Filter by School Name</Form.Label>
                  <Form.Control
                    type="text"
                    id="schoolNameFilter"
                    placeholder="Enter school name..."
                    value={schoolNameFilter}
                    onChange={(e) => setSchoolNameFilter(e.target.value)}
                  />
                </Col>
              </Row>
              <div className="mb-3">
                <Form.Label htmlFor="filterOperator">Filter Logic</Form.Label>
                <Form.Select
                  id="filterOperator"
                  value={filterOperator}
                  onChange={(e) => setFilterOperator(e.target.value as 'and' | 'or')}
                  style={{ width: '200px' }}
                >
                  <option value="and">AND (match both)</option>
                  <option value="or">OR (match any)</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  {filterOperator === 'and'
                    ? 'Schools must match both the ID and name filters'
                    : 'Schools can match either the ID or name filter'}
                </Form.Text>
              </div>
            </>
          )}
        </>
      )}

      {orgUnitsLoading && (
        <div className="text-center py-3">
          <Spinner animation="border" role="status" size="sm">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      )}

      {orgUnitsError && (
        <Alert variant="danger" className="mt-3">
          <Alert.Heading>API Error</Alert.Heading>
          <p>{orgUnitsError.message}</p>
          {orgUnitsError.status && (
            <p className="mb-0">Status: {orgUnitsError.status}</p>
          )}
        </Alert>
      )}

      {!orgUnitsLoading && !orgUnitsError && filteredOrgUnits && filteredOrgUnits.length > 0 && (
        <>
          <p className="text-muted mb-3">
            Showing <strong>{filteredOrgUnits.length}</strong> of <strong>{orgUnits?.length || 0}</strong> school(s)
          </p>
          <Row className="g-3">
            {filteredOrgUnits.map((orgUnit) => (
            <Col key={orgUnit.id} xs={12} sm={6} md={4} lg={3}>
              <Card
                className="h-100 clickable-card"
                onClick={() => handleSchoolClick(orgUnit)}
                style={{
                  cursor: 'pointer',
                  border:
                    selectedSchool?.id === orgUnit.id
                      ? '2px solid #0d6efd'
                      : '1px solid #dee2e6',
                }}
              >
                <Card.Body>
                  <Card.Title>{orgUnit.name}</Card.Title>
                  <Card.Text className="text-muted small mb-2">
                    <strong>Identifier:</strong> {orgUnit.identifier}
                  </Card.Text>
                  <Card.Text className="text-muted small mb-2">
                    {orgUnit.description}
                  </Card.Text>
                  <Card.Text>
                    <small className="text-muted">
                      {orgUnit.address1}
                      {orgUnit.address2 && `, ${orgUnit.address2}`}
                      <br />
                      {orgUnit.town}, {orgUnit.state} {orgUnit.postcode}
                    </small>
                  </Card.Text>
                  {orgUnit.workPhone && (
                    <Card.Text>
                      <small className="text-muted">
                        📞 {orgUnit.workPhone}
                      </small>
                    </Card.Text>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
        </>
      )}

      {!orgUnitsLoading && !orgUnitsError && selectedOrganisation && filteredOrgUnits && filteredOrgUnits.length === 0 && (
        <Alert variant="info" className="mt-3">
          {schoolIdFilter || schoolNameFilter
            ? 'No schools match your filters. Try adjusting your search criteria.'
            : 'No org-units found for this organisation.'}
        </Alert>
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
