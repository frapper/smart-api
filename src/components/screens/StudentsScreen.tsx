import { IoPeopleOutline } from 'react-icons/io5'

function StudentsScreen() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoPeopleOutline size={28} />
        <h2 className="mb-0">Students</h2>
      </div>
      <p className="text-muted">Manage student records and information.</p>

      <div className="mt-4">
        <h5>Student Directory</h5>
        <p>Student management features will be added here.</p>
      </div>
    </div>
  )
}

export default StudentsScreen
