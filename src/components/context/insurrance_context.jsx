/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

const InsurranceContext = createContext()

export const useInsurrance = () => useContext(InsurranceContext)

export const InsurranceProvider = ({ children }) => {
    const storedData = sessionStorage.getItem("insurance-info")
    const [insurranceInfo, setInsurranceInfo] = useState(storedData ? JSON.parse(storedData) : {})
    const clearInsuranceInfo = () => {
        setInsurranceInfo({})
        sessionStorage.removeItem("insurance-info")
    }

    useEffect(() => {
        sessionStorage.setItem("insurance-info", JSON.stringify(insurranceInfo))
    }, [insurranceInfo])
    
    return (
        <InsurranceContext.Provider value={{ insurranceInfo, setInsurranceInfo, clearInsuranceInfo }}>
            {children}
        </InsurranceContext.Provider>
    )
}