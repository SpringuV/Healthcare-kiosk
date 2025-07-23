import { useContext, useState, createContext } from "react"
const FormContext = createContext()

export const useForm = () => useContext(FormContext)

export const FormProvider = ({children}) =>{
    const [formData, setFormData] = useState({})
    return (
        <FormContext.Provider value={{formData, setFormData}}>
            {children}
        </FormContext.Provider>
    )
}