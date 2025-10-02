'use client'
import { Layout } from 'antd';

const {Content} = Layout

interface AdminContentProps {
    children?: React.ReactNode;
    colorBackground: string;
    borderRadiusLG: number;
}

const AdminContent: React.FC<AdminContentProps> = ({ children, colorBackground, borderRadiusLG }) =>  {
    return (
        <>
            <Content
                style={{
                    margin: '24px 16px',
                    padding: 24,
                    minHeight: 280,
                    background: colorBackground,
                    borderRadius: borderRadiusLG,
                }}
            >
                {children}
            </Content>
        </>
    )
}

export default AdminContent