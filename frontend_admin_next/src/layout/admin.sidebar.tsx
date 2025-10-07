'use client'
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Layout, Menu } from 'antd';
import { useRouter } from "next/navigation";
const { Sider } = Layout;
type PropsType = {
    collapsed: boolean
}

const AdminSideBar = (props: PropsType) => {
    const { collapsed } = props
    const router = useRouter()
    return (
        <>
            <Sider style={{ transitionDuration: "300", transform: "ease-in" }} trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    style={{ position: "sticky" }}
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Trang chính',
                            onClick: () => {
                                router.push('/dashboard')
                            }
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'Quản lý tài khoản',
                            onClick: () => {
                                router.push('/account')
                            }
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'Lịch sử giao dịch',
                            onClick: () => {
                                router.push('/history-transaction')
                            }
                        },
                    ]}
                />
            </Sider>
        </>
    )
}

export default AdminSideBar