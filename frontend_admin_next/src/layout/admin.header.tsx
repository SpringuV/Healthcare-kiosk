import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons"
import { Button } from "antd"
import { Header } from "antd/es/layout/layout"
import React from "react";

type PropsType = {
    setCollapsed: React.Dispatch<React.SetStateAction<boolean>>,
    collapsed: boolean
}

const AdminHeader = (props: PropsType) => {
    const {setCollapsed, collapsed} = props
    return (
        <>
            <Header style={{ padding: 0, background: "#FFF", display: 'flex', flexDirection: 'row' }}>
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
            </Header>
        </>
    )
}

export default AdminHeader