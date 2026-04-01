import { createRoot } from 'react-dom/client'
import './index.css'
import './services/api'
import App from './App.jsx'

// Khoi tao React root va render ung dung.
createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
