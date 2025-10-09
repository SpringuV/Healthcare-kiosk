'use client'
import { HistoryOutlined, HomeOutlined, UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Layout, Menu } from 'antd';
import { usePathname, useRouter } from "next/navigation";
const { Sider } = Layout;
type PropsType = {
    collapsed: boolean
}

const items = [
    { key: '/dashboard', icon: <HomeOutlined />, label: 'Trang chính' },
    { key: '/account', icon: <UserOutlined />, label: 'Quản lý tài khoản' },
    { key: '/history-transaction', icon: <HistoryOutlined />, label: 'Lịch sử giao dịch' },
]

const AdminSideBar = (props: PropsType) => {
    const { collapsed } = props
    const router = useRouter()
    const pathname = usePathname()

    const onSideBarClick = (e: { key: string }) => {
        router.push(e.key)
    }
    return (
        <>
            <Sider style={{ transitionDuration: "300", transform: "ease-in" }} trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    style={{ position: "sticky" }}
                    theme="dark"
                    mode="inline"
                    onClick={onSideBarClick}
                    defaultSelectedKeys={['/dashboard']}
                    selectedKeys={[pathname]}
                    items={items}
                />
            </Sider>
        </>
    )
}

export default AdminSideBar