import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import AppProviders from './components/context/provider/index.jsx'
createRoot(document.getElementById('root')).render(
    <AppProviders>
        <App />
    </AppProviders>
)
