import { useState, useEffect } from 'react'
import { IoPeopleOutline } from 'react-icons/io5'
import Spinner from 'react-bootstrap/Spinner'
import Alert from 'react-bootstrap/Alert'
import Table from 'react-bootstrap/Table'
import Button from 'react-bootstrap/Button'
import Badge from 'react-bootstrap/Badge'
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
  const [students, setStudents] = useState<User[] | null>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<ApiError | null>(null)

  useEffect(() => {
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

    fetchStudents()
  }, [selectedSchool, settings.pageSize])

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
                  <th>Name</th>
                  <th>Username</th>
                  <th>Student ID</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Groups</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>
                      {student.firstName} {student.lastName}
                      {student.preferredName && (
                        <div className="text-muted small">
                          ({student.preferredName})
                        </div>
                      )}
                    </td>
                    <td>{student.username}</td>
                    <td>{student.studentOrEmployeeId}</td>
                    <td>{student.email}</td>
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
    </div>
  )
}

export default StudentsScreen
