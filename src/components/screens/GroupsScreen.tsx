import { IoGitNetworkOutline } from 'react-icons/io5'

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
          <div className="mt-4">
            <h5>Group Management</h5>
            <p>Group creation and management features will be added here.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default GroupsScreen
