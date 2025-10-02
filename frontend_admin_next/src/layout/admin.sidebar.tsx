import { UploadOutlined, UserOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Layout, Menu } from 'antd';
const { Sider } = Layout;
type PropsType = {
    collapsed: boolean
}

const AdminSideBar = (props: PropsType) => {
    const {collapsed} = props
    return (
        <>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={[
                        {
                            key: '1',
                            icon: <UserOutlined />,
                            label: 'Trang chính',
                        },
                        {
                            key: '2',
                            icon: <VideoCameraOutlined />,
                            label: 'Quản lý tài khoản',
                        },
                        {
                            key: '3',
                            icon: <UploadOutlined />,
                            label: 'Lịch sử giao dịch',
                        },
                    ]}
                />
            </Sider>
        </>
    )
}

export default AdminSideBar