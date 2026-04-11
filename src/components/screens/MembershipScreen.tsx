import { IoCardOutline } from 'react-icons/io5'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface MembershipScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
}

function MembershipScreen({ selectedSchool }: MembershipScreenProps) {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoCardOutline size={28} />
        <h2 className="mb-0">Membership</h2>
      </div>
      {!selectedSchool && (
        <div className="alert alert-info">
          Please select a school from the School page to view membership.
        </div>
      )}
      {selectedSchool && (
        <>
          <p className="text-muted">
            Managing membership for <strong>{selectedSchool.name}</strong>
          </p>
          <div className="mt-4">
            <h5>Membership Plans</h5>
            <p>Membership management features will be added here.</p>
          </div>
        </>
      )}
    </div>
  )
}

export default MembershipScreen
