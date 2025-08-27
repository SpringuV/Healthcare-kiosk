import { BrowserRouter } from "react-router-dom"
import { InsurranceProvider } from "../insurrance_context"
import { ServiceProvider } from "../service_context"
import { FormProvider } from "../form_context"
import { StateStepProvider } from "../state_step_context"
import { PatientRegisterProvider } from "../patient_register_context"
import { PatientHistoryProvider } from "../patient_history_context"

function AppProviders({ children }) {
    return (
        <BrowserRouter>
            <InsurranceProvider>
                <ServiceProvider>
                    <FormProvider>
                        <StateStepProvider>
                            <PatientRegisterProvider>
                                <PatientHistoryProvider>
                                    {children}
                                </PatientHistoryProvider>
                            </PatientRegisterProvider>
                        </StateStepProvider>
                    </FormProvider>
                </ServiceProvider>
            </InsurranceProvider>
        </BrowserRouter>

    )
}
export default AppProviders