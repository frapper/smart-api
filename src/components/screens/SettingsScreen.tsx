import { useState } from 'react'
import { IoSettingsOutline } from 'react-icons/io5'
import { useSettings } from '../../contexts/SettingsContext'

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
  const { settings, updatePageSize } = useSettings()
  const [pageSize, setPageSize] = useState(settings.pageSize.toString())

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setPageSize(value)
    const numValue = parseInt(value, 10)
    if (!isNaN(numValue) && numValue > 0) {
      updatePageSize(numValue)
    }
  }

  const handlePageSizeBlur = () => {
    // Reset to current setting if invalid
    const numValue = parseInt(pageSize, 10)
    if (isNaN(numValue) || numValue <= 0) {
      setPageSize(settings.pageSize.toString())
    }
  }

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

        <div className="card">
          <div className="card-body">
            <div className="mb-3">
              <label htmlFor="pageSize" className="form-label">
                Page Size
              </label>
              <input
                id="pageSize"
                type="number"
                className="form-control"
                value={pageSize}
                onChange={handlePageSizeChange}
                onBlur={handlePageSizeBlur}
                min="1"
                placeholder="Number of records per page"
              />
              <div className="form-text">
                Number of records to return in API calls (default: 50)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsScreen
