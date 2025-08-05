from fpdf import FPDF
import io
from datetime import datetime, date

def info_line(pdf, label, value):
    pdf.cell(60, 10, txt=label, align="L")
    pdf.cell(0, 10, txt=value, align="R", ln=True)

def to_str(value):
    if isinstance(value, (datetime, date)):
        return value.strftime("%Y-%m-%d %H:%M:%S") if isinstance(value, datetime) else value.strftime("%Y-%m-%d")
    return str(value)

def makePDF(info):
    # info = [o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname]
    pdf = FPDF()
    pdf.add_page()
    pdf.add_font("DejaVu", "", "font/dejavu-sans.ttf", uni=True)
    pdf.set_font("DejaVu", size=14)

    # Tiêu đề
    pdf.set_font_size(23)
    pdf.cell(0, 10, "PHIẾU KHÁM BỆNH", ln=True, align="C")
    pdf.ln(10)

    # Nội dung
    pdf.set_font_size(16)
    info_line(pdf, "Họ tên:", info[1])
    info_line(pdf, "Giới tính:", "Nam" if info[2] == 1 else "Nữ")
    info_line(pdf, "Ngày sinh:", to_str(info[3]))
    info_line(pdf, "CCCD:", info[0])
    info_line(pdf, "Bảo hiểm y tế:", "Có" if info[7] == 1 else "Không")
    info_line(pdf, "Dịch vụ:", info[9])
    info_line(pdf, "Phòng khám:", info[10])
    info_line(pdf, "Địa chỉ phòng:", info[11])
    info_line(pdf, "Bác sĩ:", info[12])
    info_line(pdf, "Thời gian đăng ký:", to_str(info[5]))
    info_line(pdf, "Giá dịch vụ:", str(info[6] * 26.181))

    pdf_bytes = pdf.output(dest='S').encode('latin1')
    pdf_buffer = io.BytesIO(pdf_bytes)
    pdf_buffer.seek(0)
    return pdf_buffer