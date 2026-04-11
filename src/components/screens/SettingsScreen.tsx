import { IoSettingsOutline } from 'react-icons/io5'

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

interface SettingsScreenProps {
  selectedSchool: SelectedSchool | null
  onSchoolSelect: (school: SelectedSchool) => void
}

function SettingsScreen({ selectedSchool }: SettingsScreenProps) {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoSettingsOutline size={28} />
        <h2 className="mb-0">Settings</h2>
      </div>
      <p className="text-muted">Configure your application settings here.</p>

      {selectedSchool && (
        <div className="alert alert-info mt-3">
          Settings for <strong>{selectedSchool.name}</strong>
        </div>
      )}

      <div className="mt-4">
        <h5>Application Settings</h5>
        <p>Settings configuration will be added here.</p>
      </div>
    </div>
  )
}

export default SettingsScreen
