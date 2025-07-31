from connectDB import connect, disconnect

def main():
    conn, cursor = connect()
    try:
        queries = ['''
INSERT INTO heath_insurrance VALUES 
('000000000001', 'Nguyễn Ngô An', 1, '2002-11-22', '0333788190', 'BV Bạch Mai', '2023-07-01', '2028-07-01'),
('000000000002', 'Nguyễn Vân Anh', 0, '1998-10-03', '0843948344', 'BV Bạch Mai', '2019-07-01', '2024-07-01'),
('000000000003', 'Đào Thị Mai', 0, '1980-03-03', '0123984729', 'BV 700 Giường', '2022-06-01', '2027-06-01'),
('000000000004', 'Nguyễn Văn Nhất', 1, '1980-03-03', '0123456789', 'BV Việt Đức', '2021-01-01', '2026-01-01'),
('000000000007', 'Trần Văn Đức', 1, '1982-07-03', '0183950242', 'BV Bạch Mai', '2022-05-01', '2027-05-01'),
('000000000008', 'Ngô Thị Thúy', 0, '1975-03-23', '0483914234', 'BV Bạch Mai', '2020-06-01', '2025-06-01'),
('000000000009', 'Lê Văn Hoàng', 1, '1990-12-30', '0324321980', 'BV Việt Pháp', '2021-03-01', '2026-03-01'),
('000000000010', 'Bùi Thị Hạnh', 0, '1985-09-15', '0348201123', 'BV 103', '2023-02-01', '2028-02-01'),
('000000000011', 'Nguyễn Văn Dũng', 1, '2000-06-01', '0384721345', 'BV E', '2020-05-01', '2025-05-01'),
('000000000012', 'Trần Thị Minh', 0, '1995-08-20', '0394729182', 'BV Bạch Mai', '2022-10-01', '2027-10-01'),
('000000000013', 'Đặng Văn Nam', 1, '1992-11-11', '0948203943', 'BV Nhiệt đới TW', '2021-06-01', '2026-06-01'),
('000000000014', 'Phạm Thị Huệ', 0, '1979-04-04', '0938493847', 'BV Bạch Mai', '2018-09-01', '2023-09-01'); '''
, '''INSERT INTO patient (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, is_insurrance) VALUES 
('000000000001', 'Nguyễn Ngô An', 1, '2002-11-22', 'Tây Hồ, Hà Nội', '0333788190', 'Kinh', 'Sinh viên', 1),
('000000000002', 'Nguyễn Vân Anh', 0, '1998-10-03', 'Đống Đa, Hà Nội', '0843948344', 'Kinh', 'Nhân viên văn phòng', 1),
('000000000003', 'Đào Thị Mai', 0, '1980-03-03', 'Nam Định', '0123984729', 'Kinh', 'Giáo viên', 1),
('000000000004', 'Nguyễn Văn Nhất', 1, '1980-03-03', 'Hoa Lư, Ninh Bình', '0123456789', 'Kinh', 'Kỹ sư', 1),
('000000000005', 'Nguyễn Văn Hai', 1, '2002-03-06', 'Tây Tựu, Hà Nội', '0482048593', 'Kinh', 'Sinh viên', 0),
('000000000006', 'Đào Thị Nhất', 0, '1990-07-08', 'Hà Nam', '0739104824', 'Kinh', 'Nông dân', 0),
('000000000007', 'Trần Văn Đức', 1, '1982-07-03', 'Quỳnh Lưu, Nghệ An', '0183950242', 'Kinh', 'Bác sĩ', 1),
('000000000008', 'Ngô Thị Thúy', 0, '1975-03-23', 'Thanh Trì, Hà Nội', '0483914234', 'Kinh', 'Nội trợ', 1),
('000000000009', 'Lê Văn Hoàng', 1, '1990-12-30', 'Hải Phòng', '0324321980', 'Kinh', 'Tài xế', 1),
('000000000010', 'Bùi Thị Hạnh', 0, '1985-09-15', 'Hoài Đức, Hà Nội', '0348201123', 'Kinh', 'Kế toán', 1),
('000000000011', 'Nguyễn Văn Dũng', 1, '2000-06-01', 'Vĩnh Phúc', '0384721345', 'Kinh', 'Lập trình viên', 1),
('000000000012', 'Trần Thị Minh', 0, '1995-08-20', 'Sơn Tây, Hà Nội', '0394729182', 'Kinh', 'Bác sĩ', 1),
('000000000013', 'Đặng Văn Nam', 1, '1992-11-11', 'Gia Lâm, Hà Nội', '0948203943', 'Kinh', 'Công nhân', 1),
('000000000014', 'Phạm Thị Huệ', 0, '1979-04-04', 'Thanh Xuân, Hà Nội', '0938493847', 'Kinh', 'Tiểu thương', 1); '''
, '''INSERT INTO clinic (clinic_name, clinic_status, address_room) VALUES 
('Phòng khám Nội tổng quát', 1, 'Phòng 101, Tầng 1, Nhà A'),
('Phòng khám Nhi', 1, 'Phòng 102, Tầng 1, Nhà A'),
('Phòng khám Ngoại', 1, 'Phòng 201, Tầng 2, Nhà A'),
('Phòng khám Sản phụ khoa', 1, 'Phòng 202, Tầng 2, Nhà A'),
('Phòng khám Da liễu', 1, 'Phòng 301, Tầng 3, Nhà A'),
('Phòng khám Răng hàm mặt', 1, 'Phòng 302, Tầng 3, Nhà A'),
('Phòng khám Mắt', 1, 'Phòng 303, Tầng 3, Nhà A'),
('Phòng khám Tai Mũi Họng', 1, 'Phòng 304, Tầng 3, Nhà A'),
('Phòng khám Nội tiết', 1, 'Phòng 305, Tầng 3, Nhà A'),
('Phòng khám Tim mạch', 1, 'Phòng 306, Tầng 3, Nhà A'),
('Phòng khám Thần kinh', 0, 'Phòng 401, Tầng 4, Nhà A'),
('Phòng khám Hô hấp', 1, 'Phòng 402, Tầng 4, Nhà A'); '''
, '''INSERT INTO staff (fullname, staff_position, clinic_id) VALUES 
('Nguyễn Văn A', 'DOCTOR', 1),
('Trần Thị B', 'DOCTOR', 2),
('Lê Văn C', 'DOCTOR', 3),
('Phạm Thị D', 'DOCTOR', 4),
('Đỗ Văn E', 'DOCTOR', 5),
('Hoàng Thị F', 'DOCTOR', 6),
('Phan Văn G', 'DOCTOR', 7),
('Vũ Thị H', 'DOCTOR', 8),
('Ngô Văn I', 'DOCTOR', 9),
('Bùi Thị K', 'DOCTOR', 10),
('Trịnh Văn L', 'DOCTOR', 11),
('Dương Thị M', 'DOCTOR', 12),
('Đào Văn N', 'NURSE', 1),
('Nguyễn Thị O', 'NURSE', 2),
('Lê Văn P', 'NURSE', 3),
('Trần Thị Q', 'NURSE', 4),
('Phạm Văn R', 'NURSE', 5),
('Vũ Thị S', 'NURSE', 6);'''
, '''INSERT INTO service (service_name, service_description, price, price_insurrance) VALUES 
('Khám tổng quát', 'Khám nội tổng quát', 100.00, 50.00),
('Khám nhi khoa', 'Khám cho trẻ nhỏ', 80.00, 40.00),
('Khám ngoại khoa', 'Kiểm tra chấn thương, gãy xương', 90.00, 45.00),
('Khám sản', 'Khám thai, phụ khoa', 85.00, 42.50),
('Khám da liễu', 'Điều trị các vấn đề về da', 95.00, 47.50),
('Nhổ răng', 'Nhổ răng sâu, răng khôn', 70.00, 35.00),
('Trám răng', 'Trám răng sâu', 65.00, 32.50),
('Đo thị lực', 'Kiểm tra mắt, cận viễn', 50.00, 25.00),
('Khám tai mũi họng', 'Viêm họng, viêm tai, cảm cúm', 60.00, 30.00),
('Siêu âm ổ bụng', 'Siêu âm nội tạng bụng', 120.00, 60.00),
('Khám tim mạch', 'Đo ECG, siêu âm tim', 130.00, 65.00),
('Khám thần kinh', 'Khám đau đầu, mất ngủ, động kinh', 110.00, 55.00),
('Khám hô hấp', 'Ho, khó thở, hen suyễn', 85.00, 42.50),
('Xét nghiệm máu', 'Tổng phân tích máu', 100.00, 50.00),
('Xét nghiệm nước tiểu', 'Kiểm tra chức năng thận', 90.00, 45.00); '''
, '''INSERT INTO clinic_service (clinic_id, service_id, service_status) VALUES 
(1, 1, 1),
(1, 10, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(6, 7, 1),
(7, 8, 1),
(8, 9, 1),
(9, 10, 1),
(10, 11, 1),
(11, 12, 1),
(12, 13, 1),
(1, 14, 1),
(1, 15, 1);''']
        for query in queries:
            cursor.execute(query)
            conn.commit()
    except Exception as e:
        print(e)
    finally:
        disconnect(conn, cursor)

if __name__ == "__main__":
    main()