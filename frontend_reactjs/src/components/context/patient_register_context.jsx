import { createContext, useContext, useEffect, useState } from "react"

const PatientRegisterContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const usePatientRegister = () => useContext(PatientRegisterContext)

export const PatientRegisterProvider = ({ children }) => {
    const storedData = sessionStorage.getItem("patient-register-info")
    const [patientRegister, setPatientRegister] = useState(storedData ? JSON.parse(storedData) : {})
    const clearPatientRegister = () => {
        setPatientRegister({})
        sessionStorage.removeItem("patient-register-info")
    }
    useEffect(() => {
        sessionStorage.setItem("patient-register-info", JSON.stringify(patientRegister))
    }, [patientRegister])
    return (
        <PatientRegisterContext.Provider value={{ patientRegister, setPatientRegister, clearPatientRegister }}>
            {children}
        </PatientRegisterContext.Provider>
    )
}