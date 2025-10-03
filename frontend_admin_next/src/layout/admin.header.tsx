import { DownOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button, Dropdown, Space } from "antd"
import { Header } from "antd/es/layout/layout"
import { MenuProps } from "antd/lib";
import React from "react";

type PropsType = {
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
    collapsed: boolean
}

const items: MenuProps['items'] = [
    {
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                1st menu item
            </a>
        ),
        key: '0',
    },
    {
        label: (
            <Button rel="noopener noreferrer">
                Đăng xuất
            </Button>
        ),
        key: '1',
    },
    // {
    //     type: 'divider',
    // },
];

const AdminHeader = (props: PropsType) => {
    const { setCollapsed, collapsed } = props
    return (
        <>
            <Header style={{ padding: 0,justifyContent: "space-between", background: "#FFF", display: 'flex', flexDirection: 'row' }}>

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
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            Xin chào admin
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>

            </Header>
        </>
    )
}

export default AdminHeader