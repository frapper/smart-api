import { IoSchoolOutline } from 'react-icons/io5'

function SchoolScreen() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoSchoolOutline size={28} />
        <h2 className="mb-0">School</h2>
      </div>
      <p className="text-muted">Manage your school information and settings.</p>

      <div className="mt-4">
        <h5>School Overview</h5>
        <p>School information and management features will be added here.</p>
      </div>
    </div>
  )
}

export default SchoolScreen
