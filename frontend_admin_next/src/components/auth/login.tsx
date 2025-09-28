/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { loginThunk } from '@/redux/slices/user.thunk';
import { AppDispatch, RootState } from '@/redux/store';
import { LoginAccountType } from '@/types/auth';
import { useAppMessageNotification } from '@/utils/message';
import {
    FacebookOutlined,
    GithubOutlined,
    GoogleOutlined,
    LoadingOutlined,
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {
    LoginForm,
    ProConfigProvider,
    ProFormCheckbox,
    ProFormText,
    setAlpha,
} from '@ant-design/pro-components';
import { Button, Modal, Space, theme } from 'antd';
import { useRouter } from 'next/navigation';
import type { CSSProperties } from 'react';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const LoginUI = () => {
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter()
    const { contextHolder, openMessageNotification } = useAppMessageNotification()
    const { token } = theme.useToken();
    const [localLoading, setLocalLoading] = useState(false)
    const [messageModal, setMessageModal] = useState("")
    const auth = useSelector((state: RootState) => state.auth);

    console.log("state auth: ", auth)

    const iconStyles: CSSProperties = {
        marginInlineStart: '16px',
        color: setAlpha(token.colorTextBase, 0.2),
        fontSize: '24px',
        verticalAlign: 'middle',
        cursor: 'pointer',
    };


    const handleOnFinish = async (values: LoginAccountType) => {
        const { email, password, username } = values
        // console.log(">>>> check value: ", values)
        // {username: 'xuanvuaudi2002@gmail.com', password: '123'}
        // {mobile: '0234567890', captcha: '123123'}
        setLocalLoading(true)
        setMessageModal("Đang đăng nhập, vui lòng chờ.")
        try {
            const res = await dispatch(loginThunk({ username: username ?? email, password })).unwrap(); // unwrap() giúp bạn bắt trực tiếp dữ liệu từ fulfilled, và catch sẽ nhận giá trị reject từ rejectWithValue
            // Redirect khi login thành công
            console.log(">>> check res: ", res)
            // console.log(">>> login log: ", res.data)
            //>>> login log: {message: 'Đăng nhập thành công', token_type: 'bearer'}
            openMessageNotification('success', res?.message || 'Đăng nhập thành công', 4);
            setMessageModal("Đang chuyển hướng tới trang chủ")
            router.push('/dashboard')
        } catch (error: any) {
            console.error(error)
            const status = error.response?.status
            const detail = error.response?.data?.detail

            if (status) {
                console.log('HTTP status code:', status) // <-- bạn vẫn nhận được mã lỗi
            }

            openMessageNotification('error', detail, 4)
        } finally {
            setMessageModal("")
            setLocalLoading(false)
        }

    }

    const handleOnFinishFailed = (err: unknown) => {
        console.log("Lỗi validate: ", err);
    }
    return (
        <React.Fragment>
            {contextHolder}
            <Modal
                centered
                open={localLoading}
                footer={null}
                closable={false}
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold">{messageModal}</div>
            </Modal>
            <div className='flex h-screen flex-col justify-center items-center'>
                <ProConfigProvider hashed={false}>
                    <div style={{ backgroundColor: token.colorBgContainer }}>
                        <LoginForm
                            onFinish={handleOnFinish}
                            onFinishFailed={handleOnFinishFailed}
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
                            <>
                                <ProFormText
                                    key={1}
                                    name="username"
                                    fieldProps={{
                                        size: 'large',
                                        autoFocus: true,
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
                                    key={2}
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
                            <div
                                style={{
                                    marginBlockEnd: 24,
                                }}
                            >
                                <ProFormCheckbox noStyle name="autoLogin">
                                    Đăng nhập tự động
                                </ProFormCheckbox>
                                <a
                                    href=''
                                    style={{
                                        float: 'right',
                                    }}
                                >
                                    Quên mật khẩu
                                </a>
                            </div>
                            <div className='!mb-4 text-center'>
                                <span>Bạn chưa có tài khoản ? <a href='/auth/register' className='italic text-blue-300'>Đăng kí tại đây</a> </span>
                            </div>
                        </LoginForm>

                    </div>
                </ProConfigProvider>
            </div>
        </React.Fragment>
    );
}

export default LoginUI