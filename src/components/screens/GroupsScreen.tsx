import { useState, useEffect } from 'react'
import { IoGitNetworkOutline } from 'react-icons/io5'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import { groupsApi } from '../../services/smart-api/groups'
import type { ApiError } from '../../services/smart-api/client/types'
import type { Group } from '../../services/smart-api/groups/types'
import { useSettings } from '../../contexts/SettingsContext'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface GroupsScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
}

function GroupsScreen({ selectedSchool }: GroupsScreenProps) {
  const { settings } = useSettings()
  const [groups, setGroups] = useState<Group[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
    const fetchGroups = async () => {
      if (!selectedSchool) {
        setGroups(null)
        setError(null)
        return
      }

      setLoading(true)
      setError(null)
      try {
        const response = await groupsApi.getGroupsByOrgUnit(
          selectedSchool.id,
          settings.pageSize
        )
        setGroups(response.items)
      } catch (err) {
        setError(err as ApiError)
      } finally {
        setLoading(false)
      }
    }

    fetchGroups()
  }, [selectedSchool, settings.pageSize])

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoGitNetworkOutline size={28} />
        <h2 className="mb-0">Groups</h2>
      </div>
      {!selectedSchool && (
        <div className="alert alert-info">
          Please select a school from the School page to view groups.
        </div>
      )}
      {selectedSchool && (
        <>
          <p className="text-muted">
            Managing groups for <strong>{selectedSchool.name}</strong>
          </p>

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

          {!loading && !error && groups && groups.length > 0 && (
            <Row className="g-3">
              {groups.map((group) => (
                <Col key={group.id} xs={12} sm={6} md={4} lg={3}>
                  <Card className="h-100">
                    <Card.Body>
                      <Card.Title>{group.name}</Card.Title>
                      <Card.Text className="text-muted small mb-2">
                        <strong>Identifier:</strong> {group.identifier}
                      </Card.Text>
                      <Card.Text className="text-muted small mb-2">
                        {group.description}
                      </Card.Text>
                      <div className="mt-2">
                        <Badge bg={group.enabled ? 'success' : 'secondary'}>
                          {group.enabled ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {!loading && !error && selectedSchool && groups && groups.length === 0 && (
            <Alert variant="info" className="mt-3">
              No groups found for this school.
            </Alert>
          )}

          <div className="mt-4">
            <h5>Group Management</h5>
            <p>Additional group management features will be added here.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default GroupsScreen
