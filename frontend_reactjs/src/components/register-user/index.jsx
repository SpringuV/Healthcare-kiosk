import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clear_patient_register, register_user } from "../../actions/patient"
import Provinces from "../provinces"
import { Form, Input, Select, Button, DatePicker, Row, Col } from "antd"
import dayjs from "dayjs"
import { select_patient_register_data } from "../../reducers"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
const { Option } = Select
function Register({ onClose }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { setStateStep, flowType } = useGlobalContext()
    const dataState = useSelector(select_patient_register_data)
    const [form] = Form.useForm()

    useEffect(() => {
        setStateStep(1)
        // Clear error khi component mount
        if (dataState.error) {
            dispatch(clear_patient_register())
        }

        // Fill form với data có sẵn
        if (dataState.data || Object.keys(dataState).some(key =>
            !['loading', 'error', 'data', 'isRegistered', 'message'].includes(key) && dataState[key]
        )) {
            const formData = {
                full_name: dataState.full_name || dataState.data?.full_name,
                patient_id: dataState.patient_id || dataState.data?.patient_id,
                job: dataState.job || dataState.data?.job,
                gender: dataState.gender !== undefined ?
                    (dataState.gender ? "Nam" : "Nữ") :
                    (dataState.data?.gender ? "Nam" : "Nữ"),
                ethnic: dataState.ethnic || dataState.data?.ethnic,
                phone_number: dataState.phone_number || dataState.data?.phone_number,
                address: dataState.address || dataState.data?.address,
            }

            // Xử lý date
            let dobValue = null
            const dobFromState = dataState.dob || dataState.data?.dob
            if (dobFromState) {
                try {
                    // Nếu từ state là DD-MM-YYYY
                    if (dobFromState.includes('-') && dobFromState.split('-')[0].length === 2) {
                        dobValue = dayjs(dobFromState, "DD-MM-YYYY")
                    }
                    // Nếu từ API trả về YYYY-MM-DD
                    else if (dobFromState.includes('-') && dobFromState.split('-')[0].length === 4) {
                        dobValue = dayjs(dobFromState, "YYYY-MM-DD")
                    }
                } catch (error) {
                    console.error("Date parsing error:", error)
                }
            }

            form.setFieldsValue({
                ...formData,
                dob: dobValue,
            })
        }
    }, [setStateStep, dataState, form, dispatch, flowType])

    // Theo dõi registration success
    useEffect(() => {
        if (dataState.is_registered && !dataState.loading && !dataState.error) {
            // console.log("Registration successful, navigating...")
            navigate(flowType === "insurance" ? "/insur/service" : "/non-insur/info")
        }
    }, [dataState.is_registered, dataState.loading, dataState.error, navigate, flowType])

    const handleAddressSelect = (fullAddress) => {
        form.setFieldsValue({ address: fullAddress })
    }

    const handleSubmit = async (values) => {
        const payload = {
            ...values,
            gender: values.gender === "Nam",
            dob: values.dob ? values.dob.format("YYYY-MM-DD") : null,
            is_insur: flowType === "insurance",
        }

        console.log("Payload gửi đi:", JSON.stringify(payload, null, 2))

        try {
            await dispatch(register_user(payload))
            // Navigation sẽ được xử lý trong useEffect
        } catch (error) {
            console.error("Registration error:", error)
            // Error đã được lưu vào Redux state
        }
    }
    const ethnicArr = [
        "Kinh", "Tày", "Thái", "Mường", "Khmer", "Hoa", "Nùng", "H'Mông", "Dao", "Gia Rai",
        "Ê Đê", "Ba Na", "Chăm", "Sán Dìu", "Cơ Ho", "Xơ Đăng", "Sán Chay", "Ra Glai", "Mnông",
        "Thổ", "Stiêng", "Khơ Mú", "Bru-Vân Kiều", "Cơ Tu", "Giáy", "Tà Ôi", "Mạ", "Hrê", "Chơ Ro",
        "Xinh Mun", "Hà Nhì", "Chu Ru", "Lào", "La Chí", "La Hủ", "Phù Lá", "La Ha", "Pà Thẻn",
        "Lự", "Lô Lô", "Chứt", "Mảng", "Cờ Lao", "Bố Y", "Ngái", "Si La", "Pu Péo", "Brâu",
        "Ơ Đu", "Rơ Măm", "Cống", "Cờ Tu", "Thành phần khác"
    ]
    const allowed_keys = ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"]
    const handleKeyDown = (e) => {
        if (!/[0-9]/.test(e.key) && !allowed_keys.includes(e.key)) {
            e.preventDefault()
        }
    }

    return (
        <>
            <Helmet>
                <title>Đăng ký thông tin người khám</title>
            </Helmet>
            <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center h-screen flex-col">
                <div className="bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-h-[80vh] flex flex-col text-[17px]">
                    <div className="p-2 bg-colorOne rounded-t-lg">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="flex-1 text-center text-white font-semibold">Nhập thông tin chi tiết</h3>
                            <i
                                className="fa-solid fa-xmark h-5 w-5 bg-slate-300 flex justify-center items-center rounded-full hover:bg-slate-400"
                                onClick={onClose}
                            ></i>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-3">
                        <Form form={form} layout="vertical" onFinish={handleSubmit}>
                            <Row gutter={[20, 10]}>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Họ và Tên:" name="full_name" rules={[{ required: true, message: "Vui lòng nhập họ và tên" }]}>
                                        <Input placeholder="Nhập họ và tên của bạn" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item labelCol={8} wrapperCol={16} label="Ngày/Tháng/Năm sinh:" name="dob" rules={[{ required: true, message: "Vui lòng chọn ngày sinh" }]}>
                                        <DatePicker placeholder="Chọn ngày sinh" className="w-full" format="DD/MM/YYYY" />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Căn cước công dân" name="patient_id"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập CCCD" },
                                            { len: 12, message: "CCCD phải đủ 12 số" },
                                        ]}>
                                        <Input onKeyDown={handleKeyDown} placeholder="Nhập căn cước công dân" maxLength={12} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Nghề nghiệp" name="job" rules={[{ required: true, message: "Vui lòng chọn nghề nghiệp" }]}>
                                        <Select placeholder="Chọn Nghề Nghiệp" allowClear >
                                            <Option value="Sinh viên">Sinh viên</Option>
                                            <Option value="Công nhân">Công nhân</Option>
                                            <Option value="Nhân viên văn phòng">Nhân viên văn phòng</Option>
                                            <Option value="Giáo viên">Giáo viên</Option>
                                            <Option value="Kĩ sư">Kĩ sư</Option>
                                            <Option value="Bác sĩ">Bác sĩ</Option>
                                            <Option value="Nông dân">Nông dân</Option>
                                            <Option value="Kinh doanh">Kinh doanh</Option>
                                            <Option value="Khác">Khác</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Giới tính:" name="gender" rules={[{ required: true, message: "Vui lòng chọn giới tính" }]}>
                                        <Select placeholder="Chọn giới tính">
                                            <Option value="Nam">Nam</Option>
                                            <Option value="Nữ">Nữ</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Dân tộc:" name="ethnic" rules={[{ required: true, message: "Vui lòng chọn dân tộc" }]}>
                                        <Select placeholder="Chọn dân tộc">
                                            <Option value="none">-- Chọn dân tộc --</Option>
                                            {ethnicArr.map((ethnic, index) => (
                                                <Option key={index} value={ethnic}>
                                                    {ethnic}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={12} xl={12} xxl={12}>
                                    <Form.Item label="Số điện thoại:" name="phone_number"
                                        rules={[
                                            { required: true, message: "Vui lòng nhập số điện thoại" },
                                            { len: 10, message: "Số điện thoại phải đủ 10 số" },
                                        ]}>
                                        <Input onKeyDown={handleKeyDown} placeholder="Nhập số điện thoại" maxLength={10} />
                                    </Form.Item>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    {/* Trường address ẩn để lưu giá trị */}
                                    <Form.Item name="address" hidden>
                                        <Input />
                                    </Form.Item>
                                    <Provinces onSelect={handleAddressSelect} />
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={24}>
                                    <Form.Item className="flex justify-center">
                                        <Button type="primary" htmlType="submit" className="px-4 py-1 rounded-xl !bg-gradient-to-r from-colorTwo to-colorFive hover:!from-green-500 hover:!to-emerald-600">
                                            Bước tiếp theo
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register