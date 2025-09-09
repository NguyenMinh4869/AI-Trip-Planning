import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// Expose maps key (if provided) so index.html loader can read it
window.__VITE_GOOGLE_MAPS_API_KEY__ = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
import App from './App.jsx'
import { initMap } from './lib/map'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

window.addEventListener('load', () => {
  setTimeout(initMap, 500)
})
