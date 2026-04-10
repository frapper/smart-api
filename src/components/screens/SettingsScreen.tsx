import { IoSettingsOutline } from 'react-icons/io5'

function SettingsScreen() {
  return (
    <div>
      <div className="d-flex align-items-center gap-2 mb-4">
        <IoSettingsOutline size={28} />
        <h2 className="mb-0">Settings</h2>
      </div>
      <p className="text-muted">Configure your application settings here.</p>

      <div className="mt-4">
        <h5>Application Settings</h5>
        <p>Settings configuration will be added here.</p>
      </div>
    </div>
  )
}

export default SettingsScreen
