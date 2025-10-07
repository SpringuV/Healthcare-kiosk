/* eslint-disable @typescript-eslint/no-explicit-any */

'use client'
import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import AdminHeader from '@/layout/admin.header';
import AdminSideBar from './admin.sidebar';
import AdminContent from './admin.content';
import { SessionContext } from '@/library/session.context';


interface AdminLayoutClientProps {
    children: React.ReactNode;
    session: any;
}


const AdminLayoutClient: React.FC<AdminLayoutClientProps> = ({ children, session }) => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const [collapsed, setCollapsed] = useState(false);
    return (
        <>
            <SessionContext value={session}>
                <Layout className="min-h-screen w-screen overflow-auto">
                    <AdminSideBar collapsed={collapsed} />
                    <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
                        <AdminHeader session={session} collapsed={collapsed} setCollapsed={setCollapsed} />
                        <AdminContent colorBackground={colorBgContainer} borderRadiusLG={borderRadiusLG}>
                            {children}
                        </AdminContent>
                    </Layout>
                </Layout>
            </SessionContext>
        </>
    );
}

export default AdminLayoutClient