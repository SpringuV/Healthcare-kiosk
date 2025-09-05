import { Col, Form, Row, Select } from "antd"
import { useState, useEffect } from "react"

function Provinces({ onSelect }) {
    const [provinces, setProvinces] = useState([])
    const [districts, setDistricts] = useState([])
    const [wards, setWards] = useState([])

    const [selectedProvince, setSelectedProvince] = useState(null)
    const [selectedDistrict, setSelectedDistrict] = useState(null)
    const [selectedWard, setSelectedWard] = useState(null)

    // Lấy danh sách tỉnh
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/?depth=1")
            .then(res => res.json())
            .then(data => setProvinces(data))
    }, [])

    // Khi chọn tỉnh → load quận/huyện
    useEffect(() => {
        if (selectedProvince) {
            fetch(`https://provinces.open-api.vn/api/p/${selectedProvince}?depth=2`)
                .then(res => res.json())
                .then(data => setDistricts(data.districts || []))
        } else {
            setDistricts([])
            setWards([])
        }
    }, [selectedProvince])

    // Khi chọn huyện → load xã/phường
    useEffect(() => {
        if (selectedDistrict) {
            fetch(`https://provinces.open-api.vn/api/d/${selectedDistrict}?depth=2`)
                .then(res => res.json())
                .then(data => setWards(data.wards || []))
        } else {
            setWards([])
        }
    }, [selectedDistrict])

    // Khi chọn đủ 3 cấp → gọi callback trả về địa chỉ
    useEffect(() => {
        if (selectedProvince && selectedDistrict && selectedWard) {
            const province = provinces.find(p => p.code === +selectedProvince)?.name
            const district = districts.find(d => d.code === +selectedDistrict)?.name
            const ward = wards.find(w => w.code === +selectedWard)?.name
            if (province && district && ward) {
                const fullAddress = `${ward}, ${district}, ${province}`
                onSelect(fullAddress)
            }
        }
    }, [selectedProvince, selectedDistrict, selectedWard, provinces, districts, wards, onSelect])

    return (
        <>
            <Row gutter={[10]} >
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                    <Form.Item label="Tỉnh:" rules={[{required: true}]}>
                        <Select placeholder="Chọn Tỉnh" allowClear value={selectedProvince} onChange={(value) => {
                            setSelectedProvince(value)
                            setSelectedDistrict(null)
                            setSelectedWard(null)
                        }}
                            options={provinces.map(p => ({ label: p.name, value: p.code }))} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                    <Form.Item label="Chọn Quận/Huyện:">
                        <Select placeholder="Chọn Quận/Huyện" allowClear value={selectedDistrict} onChange={(value) => {
                            setSelectedDistrict(value)
                            setSelectedWard(null)
                        }}
                            options={districts.map(d => ({ label: d.name, value: d.code }))}
                            disabled={!selectedProvince} />
                    </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={8} lg={8} xl={8} xxl={8}>
                    <Form.Item label="Chọn Phường/Xã:">
                        <Select placeholder="Chọn Phường/Xã" allowClear value={selectedWard}
                            onChange={(value) => setSelectedWard(value)}
                            options={wards.map(w => ({ label: w.name, value: w.code }))}
                            disabled={!selectedDistrict} />
                    </Form.Item>
                </Col>
            </Row>
        </>
    )
}

export default Provinces