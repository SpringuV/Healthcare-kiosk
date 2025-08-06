import { createContext, useContext, useState } from "react";

const InsurranceContext = createContext()

export const useInsurrance = ()=> useContext(InsurranceContext)

export const InsurranceProvider = ({children}) =>{
    const [insurranceInfo, setInsurranceInfo] = useState(null)
    const clearInsuranceInfo = () => setInsurranceInfo({});
    return (
        <InsurranceContext.Provider value={{insurranceInfo, setInsurranceInfo, clearInsuranceInfo}}>
            {children}
        </InsurranceContext.Provider>
    )
}