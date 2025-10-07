/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { createContext, useContext, useMemo } from "react";

export const SessionContext = createContext<any>(null);
interface SessionProviderProps {
    value: any
    children: React.ReactNode
}

export const SessionProvider: React.FC<SessionProviderProps> = ({ value, children }) => {
    // Dùng useMemo để tránh tạo object mới mỗi lần render
    const memoizedValue = useMemo(() => value, [value])

    return (
        <SessionContext.Provider value={memoizedValue}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSessionContext = () => {
    const context = useContext(SessionContext)
    if (context === undefined) {
        throw new Error('useSessionContext must be used within a SessionProvider')
    }
    return context
}

// admin layout client đang áp dụng
