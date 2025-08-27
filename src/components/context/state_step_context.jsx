/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react"

const StateStepContext = createContext()

export function StateStepProvider({ children }) {
    const [stateStep, setStateStep] = useState(1);
    const [flowType, setFlowType] = useState(null);
    const clearStateStepAndFlowType = () => { setFlowType(null); setStateStep(1) }
    return (
        <StateStepContext.Provider value={{ stateStep, setStateStep, flowType, setFlowType, clearStateStepAndFlowType }}>
            {children}
        </StateStepContext.Provider>
    )
}

export function useStateStep() {
    return useContext(StateStepContext)
}
