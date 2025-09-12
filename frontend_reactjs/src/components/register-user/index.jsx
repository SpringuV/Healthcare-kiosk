import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { clear_patient_register, register_user } from "../../actions/patient"
import Provinces from "../provinces"
import { Form, Input, Select, Button, DatePicker, Row, Col, Modal } from "antd"
import dayjs from "dayjs"
import { select_patient_register_data } from "../../reducers"
import { useGlobalContext } from "../context/provider"
import { Helmet } from "react-helmet-async"
import { Spin } from "antd"
import { LoadingOutlined } from "@ant-design/icons"

const { Option } = Select
function Register({ onClose }) {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { setStateStep, flowType } = useGlobalContext()
    const dataState = useSelector(select_patient_register_data)
    const [form] = Form.useForm()
    const [localLoading, setLocalLoading] = useState(false)
    const [showScrollHint, setShowScrollHint] = useState(false)
    const containerRef = useRef(null)
    // State này để nhớ xem người dùng đã từng cuộn hay chưa
    // Khác với showScrollHint - cái này chỉ theo dõi hành động cuộn
    const [hasUserScrolled, setHasUserScrolled] = useState(false)

    useEffect(() => {
        const el = containerRef.current
        if (!el) return // Nếu không có element thì thoát

        // Biến này để tránh gọi quá nhiều lần checkScroll (throttling)
        // Vì scroll event có thể fire rất nhiều lần trong 1 giây
        let ticking = false
        const checkScroll = () => {
            // Chỉ xử lý nếu chưa đang xử lý (tránh lag)
            if (!ticking) {
                // requestAnimationFrame: đợi đến frame tiếp theo để chạy
                // Điều này giúp animation mượt mà, không bị giật
                requestAnimationFrame(() => {
                    // KIỂM TRA CÓ CẦN SCROLL KHÔNG
                    // Nếu nội dung cao hơn container thì mới cần scroll
                    if (el.scrollHeight > el.clientHeight) {
                        // TRƯỜNG HỢP 1: NGƯỜI DÙNG ĐÃ BẮT ĐẦU CUỘN
                        if (el.scrollTop > 0) {
                            // Đánh dấu là đã cuộn (chỉ set 1 lần)
                            setHasUserScrolled(true)
                            // Ẩn hint ngay lập tức
                            setShowScrollHint(false)
                        }
                        // TRƯỜNG HỢP 2: CHƯA CUỘN VÀ CHƯA TỪNG CUỘN
                        else if (!hasUserScrolled) {
                            // Hiện hint để báo có thể cuộn xuống
                            setShowScrollHint(true)
                        }
                        // Nếu hasUserScrolled = true nhưng scrollTop = 0
                        // có nghĩa là đã cuộn rồi quay lại đầu trang
                        // Lúc này vẫn không hiện hint nữa
                    }
                    // TRƯỜNG HỢP 3: KHÔNG CẦN SCROLL
                    else {
                        // Nội dung ngắn, không cần cuộn => ẩn hint
                        setShowScrollHint(false)
                    }
                    // Reset cờ để có thể xử lý lần tiếp theo
                    ticking = false
                })
                // Đánh dấu đang xử lý để tránh gọi lại
                ticking = true
            }
        }

        // Chạy lần đầu để kiểm tra trạng thái ban đầu
        checkScroll()

        // Lắng nghe sự kiện scroll
        // { passive: true }: báo browser rằng chúng ta không gọi preventDefault()
        // Điều này giúp browser tối ưu performance scroll
        el.addEventListener("scroll", checkScroll, { passive: true })

        // Cleanup: xóa event listener khi component unmount hoặc effect chạy lại
        return () => el.removeEventListener("scroll", checkScroll)
    }, [hasUserScrolled]) // Dependency: chạy lại khi hasUserScrolled thay đổi

    useEffect(() => {
        // Khi dataState thay đổi (ví dụ: form được fill lại)
        // Reset về trạng thái ban đầu
        setHasUserScrolled(false) // Chưa từng cuộn
        setShowScrollHint(false)  // Tạm ẩn hint, sẽ được tính lại ở useEffect trên
    }, [dataState])

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
            // const timer = setTimeout(() => {
            navigate(flowType === "insurance" ? "/insur/service" : "/non-insur/info")
            // }, 2000)
            // Cleanup nếu component unmount
            // Mount – khi component được tạo và render lần đầu (xuất hiện trên màn hình)
            // Update – khi props hoặc state của nó thay đổi → React re-render component đó
            // Unmount – khi component bị gỡ khỏi DOM (biến mất khỏi màn hình)
            // return () => clearTimeout(timer)
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
        try {
            await dispatch(register_user(payload))
            // Navigation sẽ được xử lý trong useEffect
        } catch (error) {
            console.error("Registration error:", error)
            // Error đã được lưu vào Redux state
        }
    }

    useEffect(() => {
        if (dataState.loading) {
            setLocalLoading(true)
        } else {
            setLocalLoading(false)
        }
    }, [dataState.loading])
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
            <Modal
                open={localLoading}
                footer={null}
                closable={false}
                centered
                maskClosable={false}
                styles={{ body: { textAlign: "center" } }}
            >
                <LoadingOutlined spin style={{ fontSize: 48, color: "#2563eb" }} className="mb-3" />
                <div className="text-lg font-semibold loading-dots">Đang xử lý đăng kí, vui lòng chờ</div>
            </Modal>
            <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center h-screen flex-col">
                <div className="bg-white rounded-lg w-[80vw] sm:w-[70vw] md:w-[60vw] lg:w-[50vw] max-h-[70vh] flex flex-col text-[17px]">
                    <div className="p-2 bg-colorOne rounded-t-lg">
                        <div className="flex justify-between items-center w-full">
                            <h3 className="flex-1 text-center text-white font-semibold">Nhập thông tin chi tiết</h3>
                            <i
                                className="fa-solid fa-xmark h-5 w-5 bg-slate-300 flex justify-center items-center rounded-full hover:bg-slate-400"
                                onClick={onClose}
                            ></i>
                        </div>
                    </div>
                    <div ref={containerRef} className="overflow-y-auto p-3 relative scroll-hidden">
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={handleSubmit}>
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
                                        <Spin spinning={localLoading} indicator={<LoadingOutlined />}>
                                            <Button disabled={localLoading} type="primary" htmlType="submit" className="px-4 py-1 rounded-xl !bg-gradient-to-r from-colorTwo to-colorFive hover:!from-green-500 hover:!to-emerald-600">
                                                Bước tiếp theo
                                            </Button>
                                        </Spin>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Form>
                        {/* Gợi ý kéo xuống */}
                        <div
                            className={`
                                        absolute bottom-0 left-0 w-full h-10 
                                        bg-gradient-to-t from-white to-transparent 
                                        flex justify-center items-end 
                                        pointer-events-none 
                                        transition-all duration-150 
                                        ${showScrollHint ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
                                    `}
                        >
                            {/* 
                                GIẢI THÍCH CSS:
                                - transition-all duration-150: tất cả thuộc tính thay đổi trong 150ms
                                - opacity-100/0: hiện/ẩn bằng độ trong suốt
                                - translate-y-0/2: di chuyển lên/xuống 8px (2 * 4px) để có hiệu ứng mượt
                                
                                KHI showScrollHint = true: opacity-100 translate-y-0 (hiện và ở vị trí bình thường)
                                KHI showScrollHint = false: opacity-0 translate-y-2 (ẩn và hơi dịch xuống)
                                TÓM TẮT LOGIC:
                                1. Ban đầu: hasUserScrolled = false, nếu cần scroll thì hiện hint
                                2. User bắt đầu cuộn: hasUserScrolled = true, ẩn hint ngay lập tức
                                3. Dù user cuộn lên đầu trang, hint vẫn không hiện nữa (vì đã từng cuộn)
                                4. Chỉ reset khi dataState thay đổi (form load data mới)

                                TẠI SAO NHANH HƠN:
                                - requestAnimationFrame: đồng bộ với refresh rate màn hình
                                - Throttling với ticking: tránh xử lý quá nhiều
                                - { passive: true }: browser biết không cần chờ preventDefault()
                                - CSS transition thay vì JavaScript animation
                                - Logic đơn giản: chỉ kiểm tra scrollTop > 0
                                */
                            }

                            <i className="fa-solid fa-angle-down text-gray-400 animate-bounce"></i>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Register