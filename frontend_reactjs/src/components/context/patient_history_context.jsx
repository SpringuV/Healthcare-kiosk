import { createContext, useContext, useEffect, useState } from "react";

const PatientHistoryContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const usePatientHistory = () => useContext(PatientHistoryContext)

export const PatientHistoryProvider = ({ children }) => {
    const storedData = sessionStorage.getItem("patient-history-info")
    const [patientHistory, setPatientHistory] = useState(storedData ? JSON.parse(storedData) : {})
    const clearPatientHistory = () => {
        setPatientHistory({})
        sessionStorage.removeItem("patient-history-info")
    }

    useEffect(() => {
        sessionStorage.setItem("patient-history-info", JSON.stringify(patientHistory))
    }, [patientHistory])

    return (
        <PatientHistoryContext.Provider value={{ patientHistory, setPatientHistory, clearPatientHistory }}>
            {children}
        </PatientHistoryContext.Provider>
    )
}