import { Col, Row } from "antd"
import dayjs from "dayjs"
function InfoUser(props) {
    const {patient} = props
    return (
        <>
            <Row gutter={[20, 20]}>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Mã căn cước: </label>
                    <span className="font-semibold italic">{patient.citizen_id}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Tên người khám: </label>
                    <span className="font-semibold italic">{patient.fullname}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Ngày sinh: </label>
                    <span className="font-semibold italic">{dayjs(patient.dob).format("DD/MM/YYYY")}</span>
                </Col>

                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Dân tộc: </label>
                    <span className="font-semibold italic">{patient.ethnic}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Giới tính: </label>
                    <span className="font-semibold italic">{patient.gender}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Bảo hiểm y tế: </label>
                    <span className="font-semibold italic">{patient.is_insurance === true ? "Có" : "Không"}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Số điện thoại: </label>
                    <span className="font-semibold italic">{patient.phone_number}</span>
                </Col>
                <Col xs={12} sm={12} md={12} lg={8} xl={6} xxl={4}>
                    <label>Nghề nghiệp: </label>
                    <span className="font-semibold italic">{patient.job}</span>
                </Col>
                <Col xs={24} sm={24}>
                    <label>Địa chỉ: </label>
                    <span className="font-semibold italic">{patient.address}</span>
                </Col>
            </Row>
        </>
    )
}

export default InfoUser