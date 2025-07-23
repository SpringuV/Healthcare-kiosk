export const fake_register_success = [
    { // có bảo hiểm y tế
        "message": "Đăng ký khám bệnh thành công",
        "patient": {
            "full_name": "Nguyễn Văn A",
            "dob": "1990-05-12",
            "gender": "Nam",
            "phone_number": "0912345678",
            "cccd": "012345678901",
            "is_insurance": true
        },
        "clinic": {
            "room_id": "CLN-001",
            "room_name": "Phòng 203 - Nội Tổng Hợp",
            "address_room": "Tầng 2 - Khu A",
            "doctor": "Bác sĩ Trần Thị B",
            "note": "Vui lòng đến sớm để đo huyết áp"
        },
        "service": {
            "service_id": "SRV-101",
            "service_name": "Khám nội tổng quát",
            "price": 0,
            "is_insurance_applied": true
        },
        "order": {
            "order_id": "ORDER-0001",
            "queue_number": 15,
            "created_at": "2025-07-22T09:35:00",
            "appointment_date": "2025-07-22",
            "appointment_time": "10:30",
            "come_before_minutes": 15,
            "payment_method": "BHYT",
            "payment_status": "PAID"
        }
    },
    { // không có bảo hiểm y tế
        "message": "Đăng ký khám bệnh thành công",
        "patient": {
            "full_name": "Trần Thị C",
            "dob": "1985-10-20",
            "gender": "Nữ",
            "phone_number": "0987654321",
            "cccd": "987654321000",
            "is_insurance": false
        },
        "clinic": {
            "room_id": "CLN-002",
            "room_name": "Phòng 101 - Tai Mũi Họng",
            "address_room": "Tầng 1 - Khu B",
            "doctor": "Bác sĩ Lê Văn D",
            "note": ""
        },
        "service": {
            "service_id": "SRV-102",
            "service_name": "Khám tai mũi họng",
            "price": 150000,
            "is_insurance_applied": false
        },
        "order": {
            "order_id": "ORDER-0002",
            "queue_number": 5,
            "created_at": "2025-07-22T08:00:00",
            "appointment_date": "2025-07-22",
            "appointment_time": "08:45",
            "come_before_minutes": 10,
            "payment_method": "Tiền mặt",
            "payment_status": "PAID"
        }
    },
    { // có bảo hiểm y tế và khám nhi khoa
        "message": "Đăng ký khám bệnh thành công",
        "patient": {
            "full_name": "Lê Minh Tuấn",
            "dob": "2015-09-10",
            "gender": "Nam",
            "phone_number": "0322233344",
            "cccd": "123456789999",
            "is_insurance": true
        },
        "clinic": {
            "room_id": "CLN-003",
            "room_name": "Phòng 303 - Nhi Khoa",
            "address_room": "Tầng 3 - Khu C",
            "doctor": "Bác sĩ Nguyễn Thị Hương",
            "note": "Trẻ cần được người giám hộ đi cùng"
        },
        "service": {
            "service_id": "SRV-103",
            "service_name": "Khám nhi tổng quát",
            "price": 0,
            "is_insurance_applied": true
        },
        "order": {
            "order_id": "ORDER-0003",
            "queue_number": 22,
            "created_at": "2025-07-22T09:50:00",
            "appointment_date": "2025-07-22",
            "appointment_time": "11:00",
            "come_before_minutes": 10,
            "payment_method": "BHYT",
            "payment_status": "PAID"
        }
    },
    { // không có bảo hiểm y tế, khám da liễu
        "message": "Đăng ký khám bệnh thành công",
        "patient": {
            "full_name": "Phạm Thị Mai",
            "dob": "1997-07-07",
            "gender": "Nữ",
            "phone_number": "0901234567",
            "cccd": "777888999000",
            "is_insurance": false
        },
        "clinic": {
            "room_id": "CLN-004",
            "room_name": "Phòng 105 - Da Liễu",
            "address_room": "Tầng 1 - Khu D",
            "doctor": "Bác sĩ Đặng Văn Hải",
            "note": ""
        },
        "service": {
            "service_id": "SRV-104",
            "service_name": "Tư vấn da liễu",
            "price": 200000,
            "is_insurance_applied": false
        },
        "order": {
            "order_id": "ORDER-0004",
            "queue_number": 3,
            "created_at": "2025-07-22T07:45:00",
            "appointment_date": "2025-07-22",
            "appointment_time": "09:15",
            "come_before_minutes": 10,
            "payment_method": "Chuyển khoản",
            "payment_status": "PAID"
        }
    },
    { // có bảo hiểm y tế khám tiêu hóa
        "message": "Đăng ký khám bệnh thành công",
        "patient": {
            "full_name": "Đặng Văn Hùng",
            "dob": "1975-03-25",
            "gender": "Nam",
            "phone_number": "0905550000",
            "cccd": "111222333444",
            "is_insurance": true
        },
        "clinic": {
            "room_id": "CLN-005",
            "room_name": "Phòng 202 - Tiêu Hóa",
            "address_room": "Tầng 2 - Khu E",
            "doctor": "Bác sĩ Mai Thị Lan",
            "note": "Nên nhịn ăn trước khi khám"
        },
        "service": {
            "service_id": "SRV-105",
            "service_name": "Khám tiêu hóa tổng quát",
            "price": 0,
            "is_insurance_applied": true
        },
        "order": {
            "order_id": "ORDER-0005",
            "queue_number": 12,
            "created_at": "2025-07-22T10:05:00",
            "appointment_date": "2025-07-22",
            "appointment_time": "13:00",
            "come_before_minutes": 20,
            "payment_method": "BHYT",
            "payment_status": "PAID"
        }
    }
]