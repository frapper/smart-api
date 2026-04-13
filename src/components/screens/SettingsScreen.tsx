import { useState, useEffect } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Badge from 'react-bootstrap/Badge'
import Form from 'react-bootstrap/Form'
import { useSettings } from '../../contexts/SettingsContext'
import { rolesApi } from '../../services/smart-api/roles'
import { groupTypesApi } from '../../services/smart-api/group-types'
import type { ApiError } from '../../services/smart-api/client/types'
import type { Role } from '../../services/smart-api/roles/types'
import type { GroupType } from '../../services/smart-api/group-types/types'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface SettingsScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
}

function SettingsScreen({ selectedSchool }: SettingsScreenProps) {
  const { settings, updatePageSize, updateStudentRoleId, updateDefaultGroupTypeId } = useSettings()
  const [pageSize, setPageSize] = useState(settings.pageSize.toString())
  const [studentRoleId, setStudentRoleId] = useState(settings.studentRoleId)
  const [defaultGroupTypeId, setDefaultGroupTypeId] = useState(settings.defaultGroupTypeId)
  const [showRoles, setShowRoles] = useState<boolean>(false)
  const [roles, setRoles] = useState<Role[] | null>(null)
  const [loadingRoles, setLoadingRoles] = useState<boolean>(false)
  const [rolesError, setRolesError] = useState<ApiError | null>(null)
  const [showGroupTypes, setShowGroupTypes] = useState<boolean>(false)
  const [groupTypes, setGroupTypes] = useState<GroupType[] | null>(null)
  const [loadingGroupTypes, setLoadingGroupTypes] = useState<boolean>(false)
  const [groupTypesError, setGroupTypesError] = useState<ApiError | null>(null)

  // Load group types on component mount to populate the dropdown
  useEffect(() => {
    const fetchGroupTypes = async () => {
      setLoadingGroupTypes(true)
      setGroupTypesError(null)

      try {
        const response = await groupTypesApi.getGroupTypes()
        setGroupTypes(response.items)
      } catch (err) {
        setGroupTypesError(err as ApiError)
      } finally {
        setLoadingGroupTypes(false)
      }
    }

    fetchGroupTypes()
  }, [])

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPageSize(value)
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      updatePageSize(numValue)
    }
  }

  const handlePageSizeBlur = () => {
    // Reset to current setting if invalid
    const numValue = parseInt(pageSize, 10)
    if (isNaN(numValue) || numValue <= 0) {
      setPageSize(settings.pageSize.toString())
    }
  }

  const handleStudentRoleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setStudentRoleId(value)
    updateStudentRoleId(value)
  }

  const handleStudentRoleIdBlur = () => {
    // Reset to current setting if invalid GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (studentRoleId && !guidRegex.test(studentRoleId)) {
      setStudentRoleId(settings.studentRoleId)
    }
  }

  const handleDefaultGroupTypeIdChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setDefaultGroupTypeId(value)
    updateDefaultGroupTypeId(value)
  }

  const handleDefaultGroupTypeIdBlur = () => {
    // Reset to current setting if invalid GUID format
    const guidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    if (defaultGroupTypeId && !guidRegex.test(defaultGroupTypeId)) {
      setDefaultGroupTypeId(settings.defaultGroupTypeId)
    }
  }

  const handleViewRoles = async () => {
    if (showRoles) {
      setShowRoles(false)
      return
    }

    setShowRoles(true)
    setLoadingRoles(true)
    setRolesError(null)

    try {
      const response = await rolesApi.getRoles()
      setRoles(response.items)
    } catch (err) {
      setRolesError(err as ApiError)
    } finally {
      setLoadingRoles(false)
    }
  }

  const handleViewGroupTypes = async () => {
    if (showGroupTypes) {
      setShowGroupTypes(false)
      return
    }

    setShowGroupTypes(true)
    setLoadingGroupTypes(true)
    setGroupTypesError(null)

    try {
      const response = await groupTypesApi.getGroupTypes()
      setGroupTypes(response.items)
    } catch (err) {
      setGroupTypesError(err as ApiError)
    } finally {
      setLoadingGroupTypes(false)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoSettingsOutline size={28} />
        <h2 className="mb-0">Settings</h2>
      </div>
      <p className="text-muted">Configure your application settings here.</p>

      {selectedSchool && (
        <div className="alert alert-info mt-3">
          Settings for <strong>{selectedSchool.name}</strong>
        </div>
      )}

      <div className="mt-4">
        <h5>Application Settings</h5>

        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="pageSize" className="form-label">
                Page Size
              </label>
              <input
                id="pageSize"
                type="number"
                className="form-control"
                value={pageSize}
                onChange={handlePageSizeChange}
                onBlur={handlePageSizeBlur}
                min="1"
                placeholder="Number of records per page"
              />
              <div className="form-text">
                Number of records to return in API calls (default: 50)
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="studentRoleId" className="form-label">
                Student Role ID
              </label>
              <input
                id="studentRoleId"
                type="text"
                className="form-control"
                value={studentRoleId}
                onChange={handleStudentRoleIdChange}
                onBlur={handleStudentRoleIdBlur}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                pattern="^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$"
              />
              <div className="form-text">
                GUID of the student role (e.g., 879B3012-DF7C-463D-A3EA-BC1C975468BC)
              </div>
            </div>
            <div className="mb-3">
              <label htmlFor="defaultGroupTypeId" className="form-label">
                Default Group Type ID
              </label>
              <Form.Select
                id="defaultGroupTypeId"
                value={defaultGroupTypeId}
                onChange={handleDefaultGroupTypeIdChange}
                onBlur={handleDefaultGroupTypeIdBlur}
              >
                <option value="">Select a group type...</option>
                {groupTypes && groupTypes.map((gt) => (
                  <option key={gt.id} value={gt.id}>
                    {gt.name}
                  </option>
                ))}
              </Form.Select>
              <div className="form-text">
                Default group type for creating new groups (select from list below)
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <h5>Roles Management</h5>
        <Button
          variant={showRoles ? 'secondary' : 'primary'}
          onClick={handleViewRoles}
          aria-expanded={showRoles}
        >
          {showRoles ? 'Hide Roles' : 'View Roles'}
        </Button>

        {showRoles && (
          <div className="mt-3">
            {loadingRoles && (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}

            {rolesError && (
              <Alert variant="danger">
                <Alert.Heading>API Error</Alert.Heading>
                <p>{rolesError.message}</p>
                {rolesError.status && (
                  <p className="mb-0">Status: {rolesError.status}</p>
                )}
              </Alert>
            )}

            {!loadingRoles && !rolesError && roles && roles.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    All Roles ({roles.length})
                  </h6>
                  <div className="row g-3">
                    {roles.map((role) => (
                      <div key={role.id} className="col-12 col-md-6 col-lg-4">
                        <Card className="h-100">
                          <Card.Body>
                            <Card.Title className="d-flex justify-content-between align-items-start">
                              <div>
                                <div>{role.name}</div>
                                <div className="text-muted small mt-1">
                                  {role.id}
                                </div>
                              </div>
                              <div>
                                {role.mainRole && (
                                  <Badge bg="primary" className="me-1">
                                    Main Role
                                  </Badge>
                                )}
                                {role.notInUse && (
                                  <Badge bg="warning">Not In Use</Badge>
                                )}
                              </div>
                            </Card.Title>
                            <Card.Text className="mb-0">{role.description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loadingRoles && !rolesError && roles && roles.length === 0 && (
              <Alert variant="info">No roles found.</Alert>
            )}
          </div>
        )}
      </div>

      <div className="mt-4">
        <h5>Group Types Management</h5>
        <Button
          variant={showGroupTypes ? 'secondary' : 'primary'}
          onClick={handleViewGroupTypes}
          aria-expanded={showGroupTypes}
        >
          {showGroupTypes ? 'Hide Group Types' : 'View Group Types'}
        </Button>

        {showGroupTypes && (
          <div className="mt-3">
            {loadingGroupTypes && (
              <div className="text-center py-5">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            )}

            {groupTypesError && (
              <Alert variant="danger">
                <Alert.Heading>API Error</Alert.Heading>
                <p>{groupTypesError.message}</p>
                {groupTypesError.status && (
                  <p className="mb-0">Status: {groupTypesError.status}</p>
                )}
              </Alert>
            )}

            {!loadingGroupTypes && !groupTypesError && groupTypes && groupTypes.length > 0 && (
              <div className="card">
                <div className="card-body">
                  <h6 className="card-title mb-3">
                    All Group Types ({groupTypes.length})
                  </h6>
                  <div className="row g-3">
                    {groupTypes.map((groupType) => (
                      <div key={groupType.id} className="col-12 col-md-6 col-lg-4">
                        <Card className="h-100">
                          <Card.Body>
                            <Card.Title>
                              {groupType.name}
                            </Card.Title>
                            <Card.Text className="text-muted small mb-2">
                              <strong>ID:</strong> {groupType.id}
                            </Card.Text>
                            <Card.Text className="mb-0">{groupType.description}</Card.Text>
                          </Card.Body>
                        </Card>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!loadingGroupTypes && !groupTypesError && groupTypes && groupTypes.length === 0 && (
              <Alert variant="info">No group types found.</Alert>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default SettingsScreen
