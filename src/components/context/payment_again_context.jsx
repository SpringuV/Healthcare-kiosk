import { createContext, useContext, useEffect, useState } from "react"

const PaymentAgainContext = createContext()

// eslint-disable-next-line react-refresh/only-export-components
export const usePaymentAgain = () => useContext(PaymentAgainContext)


export const PaymentAgainProvider = ({ children }) => {
    const storedData = sessionStorage.getItem("payment-again")
    const [paymentAgain, setPaymentAgain] = useState(storedData ? JSON.parse(storedData) : {})
    const clearPatientRegister = () => {
        setPaymentAgain({})
        sessionStorage.removeItem("payment-again")
    }
    useEffect(() => {
        sessionStorage.setItem("payment-again", JSON.stringify(paymentAgain))
    }, [paymentAgain])
    return (
        <PaymentAgainContext.Provider value={{ paymentAgain, setPaymentAgain, clearPatientRegister }}>
            {children}
        </PaymentAgainContext.Provider>
    )
}

// setPaymentAgain({
//   info_user: patientHistory.patient,
//   info_order: order
//})