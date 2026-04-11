import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.tsx'
import { initSmartApiClient } from './services/smart-api/client/axiosClient'

// Initialize SMART-API client
initSmartApiClient({
  baseURL: import.meta.env.VITE_SMART_API_ENDPOINT,
  token: import.meta.env.VITE_SMART_TOKEN,
  subscriptionKey: import.meta.env.VITE_APIM_SUBSCRIPTION_KEY,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
