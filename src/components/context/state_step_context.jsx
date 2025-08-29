/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react"

const StateStepContext = createContext()

export function StateStepProvider({ children }) {

    const storedData = JSON.parse(sessionStorage.getItem("step_and_flowType") || "{}");
    const [stateStep, setStateStep] = useState(storedData.stepState ?? 1);
    const [flowType, setFlowType] = useState(storedData.flow ?? null);
    const clearStateStepAndFlowType = () => {
        setFlowType(null)
        setStateStep(1)
        sessionStorage.removeItem("step_and_flowType")
    }

    useEffect(() => {
        sessionStorage.setItem("step_and_flowType", JSON.stringify({ stepState: stateStep, flow: flowType }))
    }, [stateStep, flowType])
    return (
        <StateStepContext.Provider value={{ stateStep, setStateStep, flowType, setFlowType, clearStateStepAndFlowType }}>
            {children}
        </StateStepContext.Provider>
    )
}

export function useStateStep() {
    return useContext(StateStepContext)
}
