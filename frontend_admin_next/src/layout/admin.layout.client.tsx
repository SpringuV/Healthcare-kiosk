
'use client'
import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import AdminHeader from '@/layout/admin.header';
import AdminSideBar from './admin.sidebar';
import AdminContent from './admin.content';


interface AdminLayoutClientProps {
    children: React.ReactNode;
    // session: any;
}


const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children }) =>{
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
            <Layout className="h-screen w-screen overflow-hidden">
                <AdminSideBar collapsed={collapsed} />
                <Layout>
                    <AdminHeader collapsed={collapsed} setCollapsed={setCollapsed}/>
                    <AdminContent colorBackground={colorBgContainer} borderRadiusLG={borderRadiusLG}>
                        {children}
                    </AdminContent>
                </Layout>
            </Layout>
        </>
    );
}

export default AdminLayoutClient