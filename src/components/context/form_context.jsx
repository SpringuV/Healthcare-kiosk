// set form to non insurrance

import { useContext, useState, createContext } from "react"
const FormContext = createContext()

export const useForm = () => useContext(FormContext)

export const FormProvider = ({children}) =>{
    const [formData, setFormData] = useState({})
    const clearFormData = () => setFormData(null);
    return (
        <FormContext.Provider value={{formData, setFormData, clearFormData}}>
            {children}
        </FormContext.Provider>
    )
}