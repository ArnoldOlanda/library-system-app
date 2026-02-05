import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AbilityContext } from './rbac/AbilityContext.ts'
import ability from './rbac/ability.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AbilityContext.Provider value={ability}>
      <App />
    </AbilityContext.Provider>
  </StrictMode>,
)
