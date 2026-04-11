import { IoPeopleOutline } from 'react-icons/io5'

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
          <div className="mt-4">
            <h5>Student Directory</h5>
            <p>Student management features will be added here.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default StudentsScreen
