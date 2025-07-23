import { createContext, useContext, useState } from 'react'

const ServiceContext = createContext()

export const useService = () => useContext(ServiceContext)

export const ServiceProvider = ({ children }) => {
  const [selectedService, setSelectedService] = useState(null)

  return (
    <ServiceContext.Provider value={{ selectedService, setSelectedService }}>
      {children}
    </ServiceContext.Provider>
  )
}