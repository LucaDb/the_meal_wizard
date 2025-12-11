import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorProvider, PreferenceProvider } from './context'
import App from './pages/App'
import './styles/index.scss'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorProvider>
      <PreferenceProvider>
        <App />
      </PreferenceProvider>
    </ErrorProvider>
  </StrictMode>
)
