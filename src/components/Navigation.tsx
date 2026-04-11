import { useState, useEffect } from 'react'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Offcanvas from 'react-bootstrap/Offcanvas'
import Badge from 'react-bootstrap/Badge'
import useWindowSize from '../hooks/useWindowSize'
import {
  IoSettingsOutline,
  IoSchoolOutline,
  IoPeopleOutline,
  IoGitNetworkOutline,
  IoCardOutline,
  IoMenu,
} from 'react-icons/io5'

// Screen Components
import SettingsScreen from './screens/SettingsScreen'
import SchoolScreen from './screens/SchoolScreen'
import StudentsScreen from './screens/StudentsScreen'
import GroupsScreen from './screens/GroupsScreen'
import MembershipScreen from './screens/MembershipScreen'

type ScreenType = 'settings' | 'school' | 'students' | 'groups' | 'membership'

interface NavigationItem {
  id: ScreenType
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface SelectedSchool {
  id: string
  name: string
  identifier: string
}

const navigationItems: NavigationItem[] = [
  { id: 'settings', label: 'Settings', icon: IoSettingsOutline },
  { id: 'school', label: 'School', icon: IoSchoolOutline },
  { id: 'students', label: 'Students', icon: IoPeopleOutline },
  { id: 'groups', label: 'Groups', icon: IoGitNetworkOutline },
  { id: 'membership', label: 'Membership', icon: IoCardOutline },
]

// Screens that require a school to be selected
const screensRequiringSchool: ScreenType[] = ['students', 'groups', 'membership']

const SCHOOL_STORAGE_KEY = 'smart-api-selected-school'

function Navigation() {
  const [activeScreen, setActiveScreen] = useState<ScreenType>('school')
  const [showOffcanvas, setShowOffcanvas] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<SelectedSchool | null>(() => {
    // Load selected school from localStorage on initialization
    const stored = localStorage.getItem(SCHOOL_STORAGE_KEY)
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  })
  const windowSize = useWindowSize()

  const isMobile = (windowSize.width ?? 0) < 768

  // Save selected school to localStorage whenever it changes
  useEffect(() => {
    if (selectedSchool) {
      localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(selectedSchool))
    } else {
      localStorage.removeItem(SCHOOL_STORAGE_KEY)
    }
  }, [selectedSchool])

  const handleScreenChange = (screen: ScreenType) => {
    // Check if screen requires a school selection
    if (screensRequiringSchool.includes(screen) && !selectedSchool) {
      return // Don't allow navigation to school-requiring screens
    }
    setActiveScreen(screen)
    if (isMobile) {
      setShowOffcanvas(false)
    }
  }

  const renderScreen = () => {
    const commonProps = {
      selectedSchool,
      onSchoolSelect: setSelectedSchool,
    }

    switch (activeScreen) {
      case 'settings':
        return <SettingsScreen {...commonProps} />
      case 'school':
        return <SchoolScreen {...commonProps} onNavigateToStudents={() => handleScreenChange('students')} />
      case 'students':
        return <StudentsScreen {...commonProps} />
      case 'groups':
        return <GroupsScreen {...commonProps} />
      case 'membership':
        return <MembershipScreen {...commonProps} />
      default:
        return <SchoolScreen {...commonProps} onNavigateToStudents={() => handleScreenChange('students')} />
    }
  }

  const renderSidebar = () => (
    <div className="p-3">
      <h5 className="mb-4">Smart API</h5>
      <Nav variant="pills" className="flex-column">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const requiresSchool = screensRequiringSchool.includes(item.id)
          const isDisabled = requiresSchool && !selectedSchool

          return (
            <Nav.Item key={item.id} className="mb-2">
              <Nav.Link
                active={activeScreen === item.id}
                disabled={isDisabled}
                onClick={() => handleScreenChange(item.id)}
                className="d-flex align-items-center gap-2"
                style={{
                  opacity: isDisabled ? 0.5 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Nav.Link>
            </Nav.Item>
          )
        })}
      </Nav>
    </div>
  )

  return (
    <Container fluid className="min-vh-100 p-0">
      {/* Mobile Header */}
      {isMobile && (
        <div className="bg-white border-bottom p-3 d-flex align-items-center gap-3">
          <Button
            variant="outline-primary"
            onClick={() => setShowOffcanvas(true)}
            className="p-2"
          >
            <IoMenu size={24} />
          </Button>
          <h5 className="mb-0">Smart API</h5>
        </div>
      )}

      <Row className="g-0">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Col xs={12} md={3} lg={2} className="bg-light border-end d-none d-md-block">
            {renderSidebar()}
          </Col>
        )}

        {/* Main Content Area */}
        <Col xs={12} md={9} lg={10} className={isMobile ? '' : 'd-none d-md-block'}>
          <div className="p-3 p-md-4 p-lg-5">
            {selectedSchool && (
              <div className="mb-3 d-flex align-items-center gap-2">
                <IoSchoolOutline size={20} className="text-primary" />
                <span className="text-muted">Selected School:</span>
                <Badge bg="primary" className="fs-6">
                  {selectedSchool.name} ({selectedSchool.identifier})
                </Badge>
              </div>
            )}
            <Card>
              <Card.Body className="p-3 p-md-4">
                {renderScreen()}
              </Card.Body>
            </Card>
          </div>
        </Col>

        {/* Mobile Offcanvas Sidebar */}
        <Offcanvas show={showOffcanvas} onHide={() => setShowOffcanvas(false)} placement="start">
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>Smart API</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav variant="pills" className="flex-column">
              {navigationItems.map((item) => {
                const Icon = item.icon
                const requiresSchool = screensRequiringSchool.includes(item.id)
                const isDisabled = requiresSchool && !selectedSchool

                return (
                  <Nav.Item key={item.id} className="mb-2">
                    <Nav.Link
                      active={activeScreen === item.id}
                      disabled={isDisabled}
                      onClick={() => handleScreenChange(item.id)}
                      className="d-flex align-items-center gap-2"
                      style={{
                        opacity: isDisabled ? 0.5 : 1,
                        cursor: isDisabled ? 'not-allowed' : 'pointer'
                      }}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Nav.Link>
                  </Nav.Item>
                )
              })}
            </Nav>
          </Offcanvas.Body>
        </Offcanvas>
      </Row>
    </Container>
  )
}

export default Navigation
