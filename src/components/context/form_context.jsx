/* eslint-disable react-refresh/only-export-components */
// set form to non insurrance
import { useContext, useState, createContext, useEffect } from "react"
const FormContext = createContext()

export const useForm = () => useContext(FormContext)

export const FormProvider = ({ children }) => {
    const storedData = sessionStorage.getItem("non-surance-patient")
    const [formData, setFormData] = useState(storedData ? JSON.parse(storedData) : {})
    const clearFormData = () => {
        setFormData({})
        sessionStorage.removeItem("non-surance-patient")
    }

    useEffect(() => {
        sessionStorage.setItem("non-surance-patient", JSON.stringify(formData))
    }, [formData])
    return (
        <FormContext.Provider value={{ formData, setFormData, clearFormData }}>
            {children}
        </FormContext.Provider>
    )
}