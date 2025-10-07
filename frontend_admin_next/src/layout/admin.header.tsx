import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button, Dropdown, Layout, Space } from "antd"
import { MenuProps } from "antd/lib";
import axios from "axios";
import { signOut } from "next-auth/react";
import React from "react";

type PropsType = {
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
    collapsed: boolean,
    session: ISession
}

const AdminHeader = (props: PropsType) => {
    const { setCollapsed, collapsed, session } = props
    const { Header } = Layout;
    const handleLogout = async () => {
        try {
            const token = session?.refresh_token
            if (token) {
                // Gọi API logout trước
                await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/logout`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
            }

            // Sau đó mới signOut (xoá session phía NextAuth)
            await signOut({ callbackUrl: '/auth/login' })
        } catch (err) {
            console.error("Logout failed:", err)
            await signOut({ callbackUrl: '/auth/login' })
        }
    }

    const items: MenuProps['items'] = [
        {
            label: (
                <span className='w-full block text-center'>
                    Settings
                </span>
            ),
            key: '0',
        },
        {
            label: (<span className='w-full block text-center' onClick={handleLogout}>Đăng xuất</span>),
            key: '1',
            danger: true,
        },
    ];

    return (
        <>
            <Header style={{ padding: 0, justifyContent: "space-between", background: "#FFF", display: 'flex', flexDirection: 'row' }}>

                <Button
                    type="text"
                    icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => setCollapsed(!collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <Dropdown className="!mr-2" menu={{ items }}>
                    <div className='mr-3'>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <h1>Welcome {session?.user.email}</h1>
                                <DownOutlined />
                            </Space>
                        </a>
                    </div>
                </Dropdown>

            </Header>
        </>
    )
}

export default AdminHeader