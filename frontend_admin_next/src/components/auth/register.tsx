'use client'
import React from 'react';
import type { FormProps } from 'antd';
import { Button, Checkbox, Form, Input } from 'antd';
import { useAppNotification } from '@/utils/notification';

type FieldType = {
    username: string;
    email: string;
    realname: string;
    citizen_id: string;
};

const Register = () => {
    const { contextHolder, openNotificationWithIcon } = useAppNotification()
    const onFinish: FormProps<FieldType>['onFinish'] = (values: FieldType) => {
        // console.log('>>>> check value:', values);
        // citizen_id: "12356123512345"
        // email: "xuanvuaudi2002@gmail.com"
        // realname: "tran xuan vu"
        // username: "ádfasdfasdf"


    };

    const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            {contextHolder}
            <div className='flex flex-col h-screen justify-center items-center'>
                <h1 className='py-3 text-2xl font-semibold text-center'>Đăng kí thông tin người mới</h1>
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >
                    <Form.Item<FieldType>
                        label="Username"
                        name="username"
                        rules={[
                            { required: true, message: 'Vui lòng nhập tên tài khoản!' },
                            { pattern: /^[A-Za-z0-9_]+$/, message: "Username chỉ được chứa chữ, số và dấu gạch dưới (_)" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<FieldType>
                        label="Email"
                        name="email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập Email!' },
                            { type: "email", message: "Email không hợp lệ" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Căn cước công dân"
                        name="citizen_id"
                        rules={[
                            { required: true, message: 'Vui lòng nhập căn cước công dân!' },
                            { pattern: /^\d{12}$/, message: "CCCD phải gồm đúng 12 chữ số" }
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item<FieldType>
                        label="Họ và tên"
                        name="realname"
                        rules={[
                            { required: true, message: 'Vui lòng nhập đầy đủ họ tên' },
                            { pattern: /^[A-Za-zÀ-ỹ\s]+$/, message: "Họ và tên không được chứa số hoặc ký tự đặc biệt" }
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item label={null}>
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </>
    )
}

export default Register


// import axios from "axios";

// const api = axios.create({
//   baseURL: "http://localhost:8000/api",
// });

// // cờ để tránh loop vô hạn
// let isRefreshing = false;
// let refreshSubscribers: ((token: string) => void)[] = [];

// // hàm gọi khi có token mới
// function onRefreshed(token: string) {
//   refreshSubscribers.forEach((cb) => cb(token));
//   refreshSubscribers = [];
// }

// // interceptor request → tự gắn token vào header
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("access_token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // interceptor response → bắt lỗi hết hạn token
// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // nếu lỗi do token hết hạn (401 hoặc 499)
//     if ((error.response?.status === 401 || error.response?.status === 499) && !originalRequest._retry) {
//       originalRequest._retry = true;

//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const refreshToken = localStorage.getItem("refresh_token");
//           const res = await axios.post("http://localhost:8000/api/refresh_token", {
//             refresh_token: refreshToken,
//           });

//           const newAccessToken = res.data.access_token;
//           localStorage.setItem("access_token", newAccessToken);

//           isRefreshing = false;
//           onRefreshed(newAccessToken);

//           // gắn token mới rồi retry request
//           originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//           return api(originalRequest);
//         } catch (err) {
//           isRefreshing = false;
//           // refresh cũng fail → logout
//           localStorage.removeItem("access_token");
//           localStorage.removeItem("refresh_token");
//           window.location.href = "/login";
//           return Promise.reject(err);
//         }
//       }

//       // nếu đang refresh thì chờ token mới rồi retry
//       return new Promise((resolve) => {
//         refreshSubscribers.push((token: string) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(api(originalRequest));
//         });
//       });
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
