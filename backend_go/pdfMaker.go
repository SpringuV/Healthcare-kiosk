package main

import (
	"bytes"
	"strconv"

	"github.com/phpdave11/gofpdf" // go get github.com/phpdave11/gofpdf
)

func infoLine(pdf *gofpdf.Fpdf, label string, value string) {
	pdf.CellFormat(60, 10, label, "", 0, "L", false, 0, "")
	pdf.CellFormat(0, 10, value, "", 1, "R", false, 0, "")
}

func MakePDF(order OrderFormat) *bytes.Buffer {
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()

	pdf.AddUTF8Font("DejaVu", "", "font/dejavu-sans.ttf")
	pdf.SetFont("DejaVu", "", 14)

	pdf.SetFontSize(23)
	pdf.CellFormat(0, 10, "PHIẾU KHÁM BỆNH", "", 1, "C", false, 0, "")
	pdf.Ln(10)

	pdf.SetFontSize(16)
	infoLine(pdf, "Họ tên:", order.Fullname)
	infoLine(pdf, "Giới tính:", map[bool]string{true: "Nam", false: "Nữ"}[order.Gender])
	infoLine(pdf, "Ngày sinh:", order.DOB.Format("2006-01-02"))
	infoLine(pdf, "CCCD:", order.Citizen_id)
	infoLine(pdf, "Bảo hiểm y tế:", map[bool]string{true: "Có", false: "Không"}[order.Is_insurrance])
	infoLine(pdf, "Dịch vụ:", order.Service_name)
	infoLine(pdf, "Phòng khám:", order.Clinic_name)
	infoLine(pdf, "Địa chỉ phòng:", order.Address_room)
	infoLine(pdf, "Bác sĩ:", order.Doctor_name)
	infoLine(pdf, "Thời gian đăng ký:", order.CreateAt.Format("2006-01-02 15:04:05"))
	infoLine(pdf, "Giá dịch vụ:", strconv.FormatFloat(float64(order.Price), 'f', -1, 32))

	var buf bytes.Buffer
	err := pdf.Output(&buf)
	if err != nil {
		panic(err)
	}
	return &buf
}
