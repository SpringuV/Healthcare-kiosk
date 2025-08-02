package main

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"github.com/gin-gonic/gin" // go get -u github.com/gin-gonic/gin
)

const (
	IP         = "192.168.1.2"
	ServerLink = "http://" + IP
	Local      = "0.0.0.0"
	Port       = "8080"
)

type Insurrance struct {
	Citizen_id        string
	Fullname          string
	Gender            bool
	DOB               time.Time
	PhoneNumber       string
	RegistrationPlace string
	ValidFrom         time.Time
	Expired           time.Time
}

type Patient struct {
	Citizen_id   string
	Fullname     string
	Gender       bool
	DOB          time.Time
	Address      string
	PhoneNumber  string
	Ethnic       string
	Job          string
	IsInsurrance bool
}

type PatientJson struct {
	PatientID   string `json:"patient_id"`
	FullName    string `json:"full_name"`
	DOB         string `json:"dob"`
	Gender      bool   `json:"gender"`
	PhoneNumber string `json:"phone_number"`
	Address     string `json:"address"`
	Ethnic      string `json:"ethnic"`
	Job         string `json:"job"`
}

type PatientInfoUpdate struct {
	Address string `json:"address"`
	Ethnic  string `json:"ethnic"`
	Job     string `json:"job"`
}

type ServiceFormat struct {
	ServiceName        string `json:"service_name"`
	ServiceDescription string `json:"service_description"`
}

type OrderInfo struct {
	Service_name string `json:"service_name"`
}

type OrderFormat struct {
	Citizen_id        string
	Fullname          string
	Gender            bool
	DOB               time.Time
	QueueNumber       int
	CreateAt          time.Time
	Price             float32
	Is_insurrance     bool
	Clinic_service_id string
	Service_name      string
	Clinic_name       string
	Address_room      string
	Doctor_name       string
}

func main() {
	router := gin.Default()
	// Kiểm tra thông tin bệnh nhân
	router.GET("/health-insurrances/:citizen_id", func(ctx *gin.Context) {
		citizen_id := ctx.Param("citizen_id")
		isActivate, ins := IsInsurrance(citizen_id)
		isHad := IsHasPatientInfo(citizen_id)
		if !isActivate {
			fmt.Println(ins)
			ctx.JSON(404, gin.H{})
			return
		} else {
			if isHad {
				UpdatePatientInsurranceState(citizen_id, isActivate)
			} else {
				SavePatientInfo1(ins, isActivate)
			}
			gender := "Nữ"
			if ins.Gender {
				gender = "Nam"
			}
			ctx.JSON(200, gin.H{
				"citizen_id":         ins.Citizen_id,
				"full_name":          ins.Fullname,
				"dob":                ins.DOB.Format("2006-01-02"),
				"valid_from":         ins.ValidFrom.Format("2006-01-02"),
				"expired":            ins.Expired.Format("2006-01-02"),
				"registration_place": ins.RegistrationPlace,
				"phone_number":       ins.PhoneNumber,
				"gender":             gender,
				"is_activate":        isActivate,
			})
		}
	})

	PatientRouter := router.Group("/patient")
	{
		// Kiểm tra thông tin bệnh nhân
		PatientRouter.GET("/check/:citizen_id", func(ctx *gin.Context) {
			citizen_id := ctx.Param("citizen_id")
			patient, err := CheckPatientInfo(citizen_id)
			if err != nil {
				ctx.JSON(400, gin.H{})
				return
			} else {
				ctx.JSON(200, gin.H{
					"patient_id":   patient.Citizen_id,
					"full_name":    patient.Fullname,
					"gender":       map[bool]string{true: "Nam", false: "Nữ"}[patient.Gender],
					"dob":          patient.DOB.Format("2006-01-02"),
					"address":      patient.Address,
					"phone_number": patient.PhoneNumber,
					"ethnic":       patient.Ethnic,
					"job":          patient.Job,
				})
				return
			}
		})
		// Tạo bảng ghi thông tin bệnh nhân
		PatientRouter.POST("/non-insurrance", func(ctx *gin.Context) {
			var patientJSON PatientJson
			err := ctx.ShouldBindJSON(&patientJSON)
			fmt.Println(patientJSON)
			if err != nil {
				ctx.JSON(400, gin.H{})
				return
			} else {
				patient := Convert_JSpatient2patient(patientJSON)
				if SavePatientInfo2(patient, false) {
					ctx.JSON(201, gin.H{})
					return
				} else {
					ctx.JSON(400, gin.H{})
					return
				}
			}
		})
		// Cập nhật thông tin bệnh nhân
		PatientRouter.PUT("/insurrance-info/:citizen_id", func(ctx *gin.Context) {
			citizen_id := ctx.Param("citizen_id")
			var info PatientInfoUpdate
			err := ctx.ShouldBindJSON(&info)
			if err != nil {
				ctx.JSON(400, gin.H{})
				return
			} else {
				if UpdatePatientInfo(info, citizen_id) {
					ctx.JSON(201, gin.H{})
					return
				} else {
					ctx.JSON(400, gin.H{})
					return
				}
			}
		})
	}
	// lấy danh sách dịch vụ
	router.GET("/api/services", func(ctx *gin.Context) {
		services := getServiceList()
		ctx.JSON(200, gin.H{"services": services})
	})
	// tạo phiếu khám
	router.POST("/order/create/:citizen_id", func(ctx *gin.Context) {
		citizen_id := ctx.Param("citizen_id")
		var info OrderInfo
		err := ctx.ShouldBindJSON(&info)
		if err != nil {
			ctx.JSON(400, gin.H{})
			return
		}
		order_id := createOrder(citizen_id, info.Service_name)
		if order_id == 0 {
			ctx.JSON(400, gin.H{})
			return
		}
		order, err := getOrder(order_id)
		if err != nil {
			ctx.JSON(400, gin.H{})
			return
		}
		gender := "Nữ"
		if order.Gender {
			gender = "Nam"
		}
		is_insur := "Không"
		if order.Is_insurrance {
			is_insur = "Có"
		}
		qrcode, err := MakeQRCode(ServerLink + ":" + Port + "/downloadPDF/" + strconv.FormatInt(order_id, 10))
		if err != nil {
			log.Println("Tạo QR thất bại ", err)
			ctx.JSON(400, gin.H{})
			return
		}
		ctx.JSON(200, gin.H{
			"citizen_id":    order.Citizen_id,
			"fullname":      order.Fullname,
			"gender":        gender,
			"dob":           order.DOB.Format("2006-01-02"),
			"service_name":  order.Service_name,
			"clinic_name":   order.Clinic_name,
			"address_room":  order.Address_room,
			"doctor_name":   order.Doctor_name,
			"queue_number":  order.QueueNumber,
			"is_insurrance": is_insur,
			"time_order":    order.CreateAt.Format("2006-01-02 15:04:05"),
			"price":         order.Price,
			"order_id":      order_id,
			"QRCode":        qrcode,
		})
	})

	router.GET("/showPDF/:order_id", func(ctx *gin.Context) {
		order_id, err := strconv.ParseInt(ctx.Param("order_id"), 10, 64)
		if err != nil {
			log.Println("Lỗi dữ liệu: ", err)
			return
		}
		order, err := getOrder(order_id)
		if err != nil {
			return
		}
		pdfBuffer := MakePDF(order)
		ctx.Header("Content-Disposition", `inline; filename="phieu-kham-benh.pdf"`)
		ctx.Data(200, "application/pdf", pdfBuffer.Bytes())
	})

	router.GET("/downloadPDF/:order_id", func(ctx *gin.Context) {
		order_id, err := strconv.ParseInt(ctx.Param("order_id"), 10, 64)
		if err != nil {
			log.Println("Lỗi dữ liệu: ", err)
			return
		}
		order, err := getOrder(order_id)
		if err != nil {
			return
		}
		pdfBuffer := MakePDF(order)
		ctx.DataFromReader(
			200,
			int64(pdfBuffer.Len()),
			"application/pdf",
			pdfBuffer,
			map[string]string{
				"Content-Disposition": `attachment; filename="phieu-kham-benh.pdf"`,
			},
		)
	})

	ChekingDBConnection()
	router.Run(Local + ":" + Port)
}
