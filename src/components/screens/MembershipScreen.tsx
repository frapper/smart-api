import { IoCardOutline } from 'react-icons/io5'

function MembershipScreen() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoCardOutline size={28} />
        <h2 className="mb-0">Membership</h2>
      </div>
      <p className="text-muted">Manage membership plans and subscriptions.</p>

      <div className="mt-4">
        <h5>Membership Plans</h5>
        <p>Membership management features will be added here.</p>
      </div>
    </div>
  )
}

export default MembershipScreen
