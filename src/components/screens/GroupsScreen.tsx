import { IoGitNetworkOutline } from 'react-icons/io5'

function GroupsScreen() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoGitNetworkOutline size={28} />
        <h2 className="mb-0">Groups</h2>
      </div>
      <p className="text-muted">Manage student groups and assignments.</p>

      <div className="mt-4">
        <h5>Group Management</h5>
        <p>Group creation and management features will be added here.</p>
      </div>
    </div>
  )
}

export default GroupsScreen
