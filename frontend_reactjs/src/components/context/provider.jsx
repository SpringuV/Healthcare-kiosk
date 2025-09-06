/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const GlobalContext = createContext()

export const useGlobalContext = () => useContext(GlobalContext)

export const GlobalContextProvider = ({ children }) => {
    // payment again
    const paymentAgainData = sessionStorage.getItem("payment-again")
    const [paymentAgain, setPaymentAgain] = useState(paymentAgainData ? JSON.parse(paymentAgainData) : {})
    const clearPaymentAgain = () => {
        setPaymentAgain({})
        sessionStorage.removeItem("payment-again")
    }
    useEffect(() => {
        sessionStorage.setItem("payment-again", JSON.stringify(paymentAgain))
    }, [paymentAgain])

    // patient register
    const patient_register_data = sessionStorage.getItem("patient-register-info")
    const [patientRegister, setPatientRegister] = useState(patient_register_data ? JSON.parse(patient_register_data) : {})
    const clearPatientRegister = () => {
        setPatientRegister({})
        sessionStorage.removeItem("patient-register-info")
    }
    useEffect(() => {
        sessionStorage.setItem("patient-register-info", JSON.stringify(patientRegister))
    }, [patientRegister])

    // history check 
    const history_data = sessionStorage.getItem("patient-history-info")
    const [patientHistory, setPatientHistory] = useState(history_data ? JSON.parse(history_data) : {})
    const clearPatientHistory = () => {
        setPatientHistory({})
        sessionStorage.removeItem("patient-history-info")
    }

    useEffect(() => {
        sessionStorage.setItem("patient-history-info", JSON.stringify(patientHistory))
    }, [patientHistory])

    // service select
    const [selectedService, setSelectedService] = useState(null)


    // state step
    const state_step_data = JSON.parse(sessionStorage.getItem("step_and_flowType") || "{}");
    const [stateStep, setStateStep] = useState(state_step_data.stepState ?? 1);
    const [flowType, setFlowType] = useState(state_step_data.flow ?? null);
    const clearStateStepAndFlowType = () => {
        setFlowType(null)
        setStateStep(1)
        sessionStorage.removeItem("step_and_flowType")
    }

    useEffect(() => {
        sessionStorage.setItem("step_and_flowType", JSON.stringify({ stepState: stateStep, flow: flowType }))
    }, [stateStep, flowType])

    const value = useMemo(() => ({
        stateStep, setStateStep,
        flowType, setFlowType,
        clearStateStepAndFlowType,
        selectedService, setSelectedService,
        paymentAgain, setPaymentAgain, clearPaymentAgain,
        patientRegister, setPatientRegister, clearPatientRegister,
        patientHistory, setPatientHistory, clearPatientHistory
    }), [stateStep, flowType, selectedService, paymentAgain, patientRegister, patientHistory])
    return (
        <GlobalContext.Provider value={value}>
            {children}
        </GlobalContext.Provider>
    )
}