import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FormProvider } from './components/context/form_context.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <FormProvider>
            <App />
        </FormProvider>
    </BrowserRouter>
)
