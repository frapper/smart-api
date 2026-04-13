import { useState, useEffect } from 'react'
import { IoGitNetworkOutline } from 'react-icons/io5'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
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
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [showEditModal, setShowEditModal] = useState<boolean>(false)
  const [createLoading, setCreateLoading] = useState<boolean>(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [editLoading, setEditLoading] = useState<boolean>(false)
  const [editError, setEditError] = useState<string | null>(null)

  // Form state
  const [identifier, setIdentifier] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [description, setDescription] = useState<string>('')
  const [enabled, setEnabled] = useState<boolean>(true)
  const [groupTypeId, setGroupTypeId] = useState<string>('')

  // Load selected organisation from localStorage
  const organisationId = localStorage.getItem('smart-api-selected-organisation') || ''

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

  useEffect(() => {
    fetchGroups()
  }, [selectedSchool, settings.pageSize])

  const handleOpenCreateModal = () => {
    setShowCreateModal(true)
    setCreateError(null)
    // Reset form
    setIdentifier('')
    setName('')
    setDescription('')
    setEnabled(true)
    setGroupTypeId('')
  }

  const handleCloseCreateModal = () => {
    setShowCreateModal(false)
    setCreateError(null)
  }

  const handleGroupSelect = (group: Group) => {
    setSelectedGroup(group)
  }

  const handleOpenEditModal = () => {
    if (!selectedGroup) return

    setShowEditModal(true)
    setEditError(null)
    // Populate form with selected group data
    setIdentifier(selectedGroup.identifier)
    setName(selectedGroup.name)
    setDescription(selectedGroup.description)
    setEnabled(selectedGroup.enabled)
    setGroupTypeId(selectedGroup.groupTypeId)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditError(null)
  }

  const handleEditGroup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedGroup || !selectedSchool || !organisationId) {
      setEditError('Group, school, and organisation must be selected')
      return
    }

    setEditLoading(true)
    setEditError(null)

    try {
      await groupsApi.updateGroup(selectedGroup.id, {
        identifier,
        name,
        description,
        enabled,
        groupTypeId,
        organisationId,
        orgUnitId: selectedSchool.id,
      })

      // Refetch groups to get the complete data
      await fetchGroups()

      // Close modal and reset form
      handleCloseEditModal()
      setSelectedGroup(null)
      setIdentifier('')
      setName('')
      setDescription('')
      setEnabled(true)
      setGroupTypeId('')
    } catch (err) {
      const error = err as ApiError
      setEditError(error.message || 'Failed to update group')
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteGroup = async () => {
    if (!selectedGroup) return

    if (!window.confirm(`Are you sure you want to delete "${selectedGroup.name}"?`)) {
      return
    }

    setEditLoading(true)
    setEditError(null)

    try {
      await groupsApi.deleteGroup(selectedGroup.id)

      // Refetch groups to get the updated list
      await fetchGroups()

      // Clear selection
      setSelectedGroup(null)
    } catch (err) {
      const error = err as ApiError
      setEditError(error.message || 'Failed to delete group')
    } finally {
      setEditLoading(false)
    }
  }

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSchool || !organisationId) {
      setCreateError('School and organisation must be selected')
      return
    }

    setCreateLoading(true)
    setCreateError(null)

    try {
      await groupsApi.createGroup({
        identifier,
        name,
        description,
        enabled,
        groupTypeId,
        organisationId,
        orgUnitId: selectedSchool.id,
      })

      // Refetch groups to get the complete data
      await fetchGroups()

      // Close modal and reset form
      handleCloseCreateModal()
      setIdentifier('')
      setName('')
      setDescription('')
      setEnabled(true)
      setGroupTypeId('')
    } catch (err) {
      const error = err as ApiError
      setCreateError(error.message || 'Failed to create group')
    } finally {
      setCreateLoading(false)
    }
  }

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
            Managing groups for <strong>{selectedSchool.name}</strong> ({selectedSchool.identifier})
          </p>

          <Button
            variant="primary"
            className="mb-3"
            onClick={handleOpenCreateModal}
          >
            Create New Group
          </Button>

          {selectedGroup && (
            <div className="mb-3 d-flex gap-2">
              <Button
                variant="warning"
                onClick={handleOpenEditModal}
                disabled={editLoading}
              >
                Edit Selected
              </Button>
              <Button
                variant="danger"
                onClick={handleDeleteGroup}
                disabled={editLoading}
              >
                Delete Selected
              </Button>
              <Button
                variant="secondary"
                onClick={() => setSelectedGroup(null)}
                disabled={editLoading}
              >
                Clear Selection
              </Button>
            </div>
          )}

          {editError && !showEditModal && (
            <Alert variant="danger" className="mb-3">
              {editError}
            </Alert>
          )}

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
                  <Card
                    className="h-100"
                    style={{
                      cursor: 'pointer',
                      border: selectedGroup?.id === group.id
                        ? '3px solid #0d6efd'
                        : undefined,
                    }}
                    onClick={() => handleGroupSelect(group)}
                  >
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
        </>
      )}

      {/* Create Group Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && (
            <Alert variant="danger" className="mb-3">
              {createError}
            </Alert>
          )}

          <Form onSubmit={handleCreateGroup}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="identifier">Identifier *</Form.Label>
              <Form.Control
                id="identifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., year-7-group-1"
                required
                disabled={createLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="name">Name *</Form.Label>
              <Form.Control
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Year 7 Group 1"
                required
                disabled={createLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="description">Description</Form.Label>
              <Form.Control
                id="description"
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group description..."
                disabled={createLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="enabled"
                label="Enabled"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                disabled={createLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="groupTypeId">Group Type ID</Form.Label>
              <Form.Control
                id="groupTypeId"
                type="text"
                value={groupTypeId}
                onChange={(e) => setGroupTypeId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                disabled={createLoading}
              />
              <Form.Text className="text-muted">
                Leave empty for now (will be set later)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Organisation ID</Form.Label>
              <Form.Control
                type="text"
                value={organisationId}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Automatically set from selected organisation
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Org Unit ID (School)</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchool?.id || ''}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Automatically set from selected school
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseCreateModal}
            disabled={createLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateGroup}
            disabled={createLoading || !identifier || !name}
          >
            {createLoading ? 'Creating...' : 'Create Group'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Group Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Group</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editError && (
            <Alert variant="danger" className="mb-3">
              {editError}
            </Alert>
          )}

          <Form onSubmit={handleEditGroup}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="editIdentifier">Identifier *</Form.Label>
              <Form.Control
                id="editIdentifier"
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g., year-7-group-1"
                required
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="editName">Name *</Form.Label>
              <Form.Control
                id="editName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Year 7 Group 1"
                required
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="editDescription">Description</Form.Label>
              <Form.Control
                id="editDescription"
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Group description..."
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="editEnabled"
                label="Enabled"
                checked={enabled}
                onChange={(e) => setEnabled(e.target.checked)}
                disabled={editLoading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label htmlFor="editGroupTypeId">Group Type ID</Form.Label>
              <Form.Control
                id="editGroupTypeId"
                type="text"
                value={groupTypeId}
                onChange={(e) => setGroupTypeId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                disabled={editLoading}
              />
              <Form.Text className="text-muted">
                Leave empty for now (will be set later)
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Organisation ID</Form.Label>
              <Form.Control
                type="text"
                value={organisationId}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Automatically set from selected organisation
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Org Unit ID (School)</Form.Label>
              <Form.Control
                type="text"
                value={selectedSchool?.id || ''}
                disabled
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Automatically set from selected school
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseEditModal}
            disabled={editLoading}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            onClick={handleEditGroup}
            disabled={editLoading || !identifier || !name}
          >
            {editLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default GroupsScreen
