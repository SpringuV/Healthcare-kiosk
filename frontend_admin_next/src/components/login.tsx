'use client'
import {
    FacebookOutlined,
    GithubOutlined,
    GoogleOutlined,
    LockOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCaptcha,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Button, Space, Tabs, message, theme } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';

type LoginType = 'phone' | 'account';
const LoginUI = () => {
    const { token } = theme.useToken();
    const [loginType, setLoginType] = useState<LoginType>('phone');

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };

    return (
        <ProConfigProvider hashed={false}>
            <div style={{ backgroundColor: token.colorBgContainer }}>
                <LoginForm
                    // Thay đổi text button đăng nhập
                    submitter={{
                        render: () => (
                            <Button
                                type="primary"
                                htmlType="submit"
                                size="large"
                                style={{ width: '100%' }}
                            >
                                Đăng nhập vào hệ thống
                            </Button>
                        ),
                    }}
                    logo="https://github.githubassets.com/favicons/favicon.png"
                    title="Github"
                    subTitle="The world's largest code hosting platform"
                    actions={
                        <Space>
                            Đăng nhập bằng
                            <GoogleOutlined style={iconStyles} /> 
                            <GithubOutlined style={iconStyles} />
                            <FacebookOutlined style={iconStyles} />
                        </Space>
                    }
                >
                    <Tabs
                        centered
                        activeKey={loginType}
                        onChange={(activeKey) => setLoginType(activeKey as LoginType)}
                    >
                        <Tabs.TabPane key={'account'} tab={'Email'} />
                        <Tabs.TabPane key={'phone'} tab={'Số điện thoại'} />
                    </Tabs>
                    {loginType === 'account' && (
                        <>
                            <ProFormText
                                name="username"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <UserOutlined className={'prefixIcon'} />,
                                }}
                                placeholder={'Email: admin or user'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập Email của bạn!',
                                    },
                                ]}
                            />
                            <ProFormText.Password
                                name="password"
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                    strengthText:
                                        'Password should contain numbers, letters and special characters, at least 8 characters long.',
                                    statusRender: (value) => {
                                        const getStatus = () => {
                                            if (value && value.length > 12) {
                                                return 'ok';
                                            }
                                            if (value && value.length > 6) {
                                                return 'pass';
                                            }
                                            return 'poor';
                                        };
                                        const status = getStatus();
                                        if (status === 'pass') {
                                            return (
                                                <div style={{ color: token.colorWarning }}>
                                                    Độ mạnh: Trung bình
                                                </div>
                                            );
                                        }
                                        if (status === 'ok') {
                                            return (
                                                <div style={{ color: token.colorSuccess }}>
                                                    Độ mạnh: Mạnh
                                                </div>
                                            );
                                        }
                                        return (
                                            <div style={{ color: token.colorError }}>Độ mạnh: Yếu</div>
                                        );
                                    },
                                }}
                                placeholder={'Mật khẩu: ant.design'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mật khẩu！',
                                    },
                                ]}
                            />
                        </>
                    )}
                    {loginType === 'phone' && (
                        <>
                            <ProFormText
                                fieldProps={{
                                    size: 'large',
                                    prefix: <MobileOutlined className={'prefixIcon'} />,
                                }}
                                name="mobile"
                                placeholder={'Số điện thoại'}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập số điện thoại của bạn！',
                                    },
                                    {
                                        pattern: /^0\d{10}$/,
                                        message: 'Định dạng số điện thoại di động không chính xác！',
                                    },
                                ]}
                            />
                            <ProFormCaptcha
                                fieldProps={{
                                    size: 'large',
                                    prefix: <LockOutlined className={'prefixIcon'} />,
                                }}
                                captchaProps={{
                                    size: 'large',
                                }}
                                placeholder={'Vui lòng nhập mã xác minh'}
                                captchaTextRender={(timing, count) => {
                                    if (timing) {
                                        return `${count} ${'Nhận mã xác minh'}`;
                                    }
                                    return 'Nhận mã xác minh';
                                }}
                                name="captcha"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mã xác minh！',
                                    },
                                ]}
                                onGetCaptcha={async () => {
                                    message.success('Đã nhận được mã xác minh thành công! Mã xác minh là：1234');
                                }}
                            />
                        </>
                    )}
                    <div
                        style={{
                            marginBlockEnd: 24,
                        }}
                    >
                        <ProFormCheckbox noStyle name="autoLogin">
                            Đăng nhập tự động
                        </ProFormCheckbox>
                        <a
                            style={{
                                float: 'right',
                            }}
                        >
                            Quên mật khẩu
                        </a>
                    </div>
                </LoginForm>
            </div>
        </ProConfigProvider>
    );
}

export default LoginUI