/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Popconfirm, Row, Space, Switch, Table, Tag } from 'antd';
import { useState } from 'react';
const { Column, ColumnGroup } = Table;

function Cashier() {
    interface DataType {
        key: React.Key;
        firstName: string;
        lastName: string;
        username: string;
        cccd: string;
        status: string;
    }

    interface CashierCreateType {
        firstName: string;
        lastName: string;
        username: string;
        cccd: string;
        password: string;
    }
    const [formData, setFormData] = useState<CashierCreateType>({
        firstName: '',
        lastName: '',
        username: '',
        cccd: '',
        password: ''
    })
    const [isModalOpen, setIsModalOpen] = useState(false)
    const data: DataType[] = [
        {
            key: '1',
            firstName: 'John',
            lastName: 'Brown',
            username: 'test1',
            cccd: '094758365823',
            status: 'Không hoạt động',
        },
        {
            key: '2',
            firstName: 'Jim',
            lastName: 'Green',
            username: 'test2',
            cccd: '053759274823',
            status: 'Hoạt động',
        },
        {
            key: '3',
            firstName: 'Joe',
            lastName: 'Black',
            username: 'test3',
            cccd: '034443665823',
            status: 'Hoạt động',
        },
    ];

    const handleCreateCashier = async () => {
        console.log('Dữ liệu thu ngân:', formData)
        // TODO: gọi API tạo tài khoản ở đây
        setIsModalOpen(false)
    }
    return (
        <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">Quản lý tài khoản thu ngân</h1>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsModalOpen(true)}
                >
                    Tạo tài khoản mới
                </Button>
            </div>
            <Table<DataType> className='text-center'
                pagination={{ position: ['bottomCenter'] }}
                sticky={true}
                dataSource={data}
                scroll={{ x: 'max-content' }}>
                <Column className='text-center' title="TT" dataIndex="key" key="key" />
                <ColumnGroup title="Tên">
                    <Column className='text-center' title="Họ và tên đệm" dataIndex="lastName" key="lastName" />
                    <Column className='text-center' title="Tên" dataIndex="firstName" key="firstName" />
                </ColumnGroup>
                <Column className='text-center' title="Tên đăng nhập" dataIndex="username" key="username" />
                <Column className='text-center' title="CCCD" dataIndex="cccd" key="cccd" />
                <Column
                    className='text-center'
                    title="Trạng thái"
                    dataIndex="status"
                    key="status"
                    render={(status: string) => {
                        return (
                            <>
                                <Switch
                                    // className={`${status === "Hoạt động" ? " !bg-green-500 hover:!bg-green-400 " : " !bg-gray-500 hover:!bg-gray-400"} `}
                                    checkedChildren="Hoạt động"
                                    unCheckedChildren="Không hoạt động"
                                />
                            </>
                        )
                    }}
                />
                <Column
                    title="Hành động"
                    key="action"
                    render={(_: any, record: DataType) => (
                        <Space size="middle">
                            <Popconfirm
                                title="Bạn có chắc muốn xóa tài khoản này?"
                                onConfirm={() => console.log('Xóa', record.username)}
                                okText="Xóa"
                                cancelText="Hủy"
                            >
                                <DeleteOutlined style={{ color: 'red', cursor: 'pointer' }} />
                            </Popconfirm>
                        </Space>
                    )}
                />
            </Table>

            <Modal
                title="Tạo tài khoản thu ngân"
                open={isModalOpen}
                okText="Tạo"
                cancelText="Hủy"
                onOk={handleCreateCashier}
                onCancel={() => setIsModalOpen(false)}
            >
                <Row gutter={[16, 16]}>
                    <Col sm={24} md={12}>
                        <label>Nhập Họ và tên đệm: </label>
                        <Input placeholder="Họ và tên đệm" value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })} />
                    </Col>
                    <Col sm={24} md={12}>
                        <label>Nhập Tên: </label>
                        <Input placeholder="Tên" value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} />
                    </Col>
                    <Col sm={24} md={12}>
                        <label>Nhập Tên đăng nhập: </label>
                        <Input placeholder="Tên đăng nhập" value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
                    </Col>
                    <Col sm={24} md={12}>
                        <label>Nhập CCCD: </label>
                        <Input placeholder="CCCD" value={formData.cccd}
                            onChange={(e) => setFormData({ ...formData, cccd: e.target.value })} />
                    </Col>
                    <Col sm={24} md={12}>
                        <label>Nhập Mật khẩu: </label>
                        <Input.Password placeholder="Mật khẩu" value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                    </Col>
                </Row>
            </Modal>
        </>
    )
}

export default Cashier