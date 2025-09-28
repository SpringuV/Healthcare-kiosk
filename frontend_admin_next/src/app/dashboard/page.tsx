import AuthGuard from '@/components/auth/auth.guard'
import Dashboard from '@/components/dashboard/dashboard'
import React from 'react'

const DashboardPage = () => {
    return (
        <>
            <AuthGuard>
                <Dashboard />
            </AuthGuard>
        </>
    )
}

export default DashboardPage
