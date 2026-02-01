import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import MainApp from './MainApp.tsx'

const root = document.getElementById('root');
if (!root) {
  throw new Error('Failed to find root element');
}

createRoot(root).render(
  <StrictMode>
    <MainApp />
  </StrictMode>,
)
