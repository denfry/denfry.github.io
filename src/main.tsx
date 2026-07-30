import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from './context/PrefsContext'
import App from './App'
// Default entrypoints already bundle the full unicode range (incl. Cyrillic) for
// these packages — no separate `wght-cyrillic.css` file ships for any of them.
import '@fontsource-variable/fraunces'
import '@fontsource-variable/inter-tight'
import '@fontsource-variable/jetbrains-mono'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PrefsProvider>
      <App />
    </PrefsProvider>
  </StrictMode>,
)
