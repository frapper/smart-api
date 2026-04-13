import { useState, useEffect } from 'react'
import { IoPeopleOutline } from 'react-icons/io5'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import { usersApi } from '../../services/smart-api/users'
import type { ApiError } from '../../services/smart-api/client/types'
import type { User } from '../../services/smart-api/users/types'
import { useSettings } from '../../contexts/SettingsContext'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface StudentsScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
}

function StudentsScreen({ selectedSchool }: StudentsScreenProps) {
  const { settings } = useSettings()
  const organisationId = localStorage.getItem('smart-api-selected-organisation') || ''
  const [students, setStudents] = useState<User[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  // Create Student Modal state
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false)
  const [createLoading, setCreateLoading] = useState<boolean>(false)
  const [createError, setCreateError] = useState<string | null>(null)

  // Generate Students Modal state
  const [showGenerateModal, setShowGenerateModal] = useState<boolean>(false)
  const [generateLoading, setGenerateLoading] = useState<boolean>(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [generateResults, setGenerateResults] = useState<{
    success: number
    failed: number
    errors: Array<{ nsn: string; error: string }>
  } | null>(null)

  // Create Student form state
  const [newStudent, setNewStudent] = useState({
    username: '',
    email: '',
    studentOrEmployeeId: '',
    firstName: '',
    lastName: '',
    gender: 'M',
    preferredName: '',
    dateOfBirth: '',
    enabled: true,
  })

  // Form state
  const [numberOfStudents, setNumberOfStudents] = useState<number>(10)
  const [nsnPrefix, setNsnPrefix] = useState<string>('')
  const [schoolId, setSchoolId] = useState<string>('')
  const [firstNamePrefix, setFirstNamePrefix] = useState<string>('')
  const [lastNamePrefix, setLastNamePrefix] = useState<string>('')
  const [gender, setGender] = useState<string>('M')

  const fetchStudents = async () => {
    if (!selectedSchool) {
      setStudents(null)
      setError(null)
      return
    }

    setLoading(true)
    setError(null)
    try {
      const response = await usersApi.getUsersByOrgUnit(
        selectedSchool.id,
        settings.pageSize
      )
      setStudents(response.items)
    } catch (err) {
      setError(err as ApiError)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [selectedSchool, settings.pageSize])

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedSchool) {
      setCreateError('No school selected')
      return
    }

    // Validation
    if (!newStudent.username || !newStudent.email || !newStudent.studentOrEmployeeId ||
        !newStudent.firstName || !newStudent.lastName) {
      setCreateError('Please fill in all required fields')
      return
    }

    setCreateLoading(true)
    setCreateError(null)

    try {
      await usersApi.createUser({
        username: newStudent.username,
        email: newStudent.email,
        studentOrEmployeeId: newStudent.studentOrEmployeeId,
        firstName: newStudent.firstName,
        lastName: newStudent.lastName,
        gender: newStudent.gender,
        preferredName: newStudent.preferredName || undefined,
        dateOfBirth: newStudent.dateOfBirth || undefined,
        enabled: newStudent.enabled,
        organisationId: organisationId,
        orgUnitId: selectedSchool.id,
        mainRoleId: 'student', // You may want to make this configurable
      })

      // Reset form and close modal
      setNewStudent({
        username: '',
        email: '',
        studentOrEmployeeId: '',
        firstName: '',
        lastName: '',
        gender: 'M',
        preferredName: '',
        dateOfBirth: '',
        enabled: true,
      })
      setShowCreateModal(false)

      // Refresh students list
      await fetchStudents()
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : 'Failed to create student')
    } finally {
      setCreateLoading(false)
    }
  }

  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoPeopleOutline size={28} />
        <h2 className="mb-0">Students</h2>
      </div>
      {!selectedSchool && (
        <div className="alert alert-info">
          Please select a school from the School page to view students.
        </div>
      )}
      {selectedSchool && (
        <>
          <p className="text-muted">
            Managing students for <strong>{selectedSchool.name}</strong>
          </p>

          <div className="mb-3 d-flex gap-2">
            <Button
              variant="primary"
              onClick={() => setShowCreateModal(true)}
            >
              Create Student
            </Button>
            <Button
              variant="info"
              onClick={() => console.log('Load Students from AST clicked')}
            >
              Load Students from AST
            </Button>
            <Button
              variant="success"
              onClick={() => console.log('Generate Students clicked')}
            >
              Generate Students
            </Button>
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

          {!loading && !error && students && students.length > 0 && (
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>NSN</th>
                  <th>School ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Gender</th>
                  <th>Groups</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.username}</td>
                    <td>{student.studentOrEmployeeId}</td>
                    <td>{student.firstName}</td>
                    <td>{student.lastName}</td>
                    <td>{student.gender}</td>
                    <td>-</td>
                    <td>
                      <Badge bg={student.enabled ? 'success' : 'secondary'}>
                        {student.enabled ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="primary"
                        size="sm"
                        className="me-2"
                        onClick={() => console.log('Edit student:', student.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => console.log('Delete student:', student.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}

          {!loading && !error && selectedSchool && students && students.length === 0 && (
            <Alert variant="info" className="mt-3">
              No students found for this school.
            </Alert>
          )}
        </>
      )}

      {/* Create Student Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateStudent}>
            <Form.Group className="mb-3">
              <Form.Label>Username *</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.username}
                onChange={(e) => setNewStudent({ ...newStudent, username: e.target.value })}
                placeholder="Enter username"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                value={newStudent.email}
                onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                placeholder="Enter email"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>NSN (Student ID) *</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.studentOrEmployeeId}
                onChange={(e) => setNewStudent({ ...newStudent, studentOrEmployeeId: e.target.value })}
                placeholder="Enter NSN"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>First Name *</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.firstName}
                onChange={(e) => setNewStudent({ ...newStudent, firstName: e.target.value })}
                placeholder="Enter first name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Last Name *</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.lastName}
                onChange={(e) => setNewStudent({ ...newStudent, lastName: e.target.value })}
                placeholder="Enter last name"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Preferred Name</Form.Label>
              <Form.Control
                type="text"
                value={newStudent.preferredName}
                onChange={(e) => setNewStudent({ ...newStudent, preferredName: e.target.value })}
                placeholder="Enter preferred name (optional)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender *</Form.Label>
              <Form.Select
                value={newStudent.gender}
                onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}
                required
              >
                <option value="M">Male</option>
                <option value="F">Female</option>
                <option value="U">Unknown</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type="date"
                value={newStudent.dateOfBirth}
                onChange={(e) => setNewStudent({ ...newStudent, dateOfBirth: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Enabled"
                checked={newStudent.enabled}
                onChange={(e) => setNewStudent({ ...newStudent, enabled: e.target.checked })}
              />
            </Form.Group>

            {createError && (
              <Alert variant="danger" className="mt-3">
                {createError}
              </Alert>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateStudent}
            disabled={createLoading}
          >
            {createLoading ? 'Creating...' : 'Create Student'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default StudentsScreen
