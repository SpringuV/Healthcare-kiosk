import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { FormProvider } from './components/context/form_context.jsx'
import { BrowserRouter } from 'react-router-dom'
import { InsurranceProvider } from './components/context/insurrance_context.jsx'
import { ServiceProvider } from './components/context/service_context.jsx'
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <InsurranceProvider>
            <ServiceProvider>
                <FormProvider>
                    <App />
                </FormProvider>
            </ServiceProvider>
        </InsurranceProvider>
    </BrowserRouter>
)
