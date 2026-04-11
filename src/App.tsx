import Navigation from './components/Navigation'
import { SettingsProvider } from './contexts/SettingsContext'

function App() {
  return (
    <SettingsProvider>
      <Navigation />
    </SettingsProvider>
  )
}

export default App
