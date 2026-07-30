import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PrefsProvider } from './context/PrefsContext'
import App from './App'
// Default entrypoints bundle every subset each package ships; inter-tight and
// jetbrains-mono include Cyrillic, but Fraunces has no Cyrillic glyphs upstream
// at all, so Cyrillic text in --display falls back to the serif fallback stack.
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
