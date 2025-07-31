package main

import (
	"database/sql" // go get -u github.com/go-sql-driver/mysql
	"log"
	"time"
)

func IsInsurrance(citizen_id string) (bool, Insurrance) {
	db := connectDB()
	defer db.Close()
	var ins Insurrance
	err := db.QueryRow(`SELECT * FROM heath_insurrance WHERE citizen_id = ?`, citizen_id).
		Scan(&ins.Citizen_id, &ins.Fullname, &ins.Gender, &ins.DOB, &ins.PhoneNumber, &ins.RegistrationPlace, &ins.ValidFrom, &ins.Expired)
	if err != nil {
		// ko tìm thấy bảo hiểm
		if err == sql.ErrNoRows {
			return false, ins
		}
	}
	now := time.Now()
	if ins.ValidFrom.Before(now) && ins.Expired.After(now) {
		return true, ins
	} else {
		return false, ins
	}
}

func IsHasPatientInfo(citizen_id string) bool {
	db := connectDB()
	defer db.Close()
	var id string
	err := db.QueryRow(`SELECT citizen_id FROM patient WHERE citizen_id = ? LIMIT 1`, citizen_id).Scan(&id)
	if err == sql.ErrNoRows {
		return false
	}
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return false
	}
	return true
}

func UpdatePatientInsurranceState(citizen_id string, state bool) bool {
	db := connectDB()
	defer db.Close()
	_, err := db.Query(`UPDATE patient SET is_insurrance = ? WHERE citizen_id = ?`, state, citizen_id)
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return false
	}
	return true
}

func SavePatientInfo1(ins Insurrance, state bool) bool {
	db := connectDB()
	defer db.Close()
	query := `INSERT INTO patient (citizen_id, fullname, gender, dob, phone_number, is_insurrance) VALUES (?,?,?,?,?,?)`
	_, err := db.Exec(query, ins.Citizen_id, ins.Fullname, ins.Gender, ins.DOB.Format("2006-01-02"), ins.PhoneNumber, state)
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return false
	}
	return true
}

func SavePatientInfo2(patient Patient, state bool) bool {
	db := connectDB()
	defer db.Close()
	query := `INSERT INTO patient (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, is_insurrance) VALUES (?,?,?,?,?,?,?,?,?)`
	_, err := db.Exec(query, patient.Citizen_id, patient.Fullname, patient.Gender, patient.DOB.Format("2006-01-02"), patient.Address, patient.PhoneNumber, patient.Ethnic, patient.Job, state)
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return false
	}
	return true
}

func UpdatePatientInfo(info PatientInfoUpdate, citizen_id string) bool {
	db := connectDB()
	defer db.Close()
	query := `UPDATE patient SET address = ?, ethnic = ?, job = ? WHERE citizen_id = ?`
	_, err := db.Exec(query, info.Address, info.Ethnic, info.Job, citizen_id)
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return false
	}
	return true
}

func Convert_JSpatient2patient(pj PatientJson) Patient {
	var p Patient
	p.Citizen_id = pj.PatientID
	p.Fullname = pj.FullName
	p.Gender = pj.Gender
	p.DOB, _ = time.Parse("2006-01-02", pj.DOB)
	p.Address = pj.Address
	p.PhoneNumber = pj.PhoneNumber
	p.Ethnic = pj.Ethnic
	p.Job = pj.Job
	return p
}

func getServiceList() []ServiceFormat {
	db := connectDB()
	defer db.Close()
	services := []ServiceFormat{}

	query := `SELECT
        s.service_name,
        s.service_description
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE cs.service_status = 1
        GROUP BY s.service_name, s.service_description
        ORDER BY s.service_name;`
	rows, err := db.Query(query)
	if err != nil {
		log.Println("Lỗi khi truy vấn:", err)
		return services
	}
	for rows.Next() {
		var s ServiceFormat
		rows.Scan(&s.ServiceName, &s.ServiceDescription)
		services = append(services, s)
	}
	return services
}

func getClinicServiceID(service_name string) string {
	db := connectDB()
	defer db.Close()
	var id string

	query := `SELECT cs.clinic_service_id
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        LEFT JOIN orders o ON cs.clinic_service_id = o.clinic_service_id AND o.order_status = 0
        WHERE s.service_name = ? AND cs.service_status = 1
        GROUP BY cs.clinic_service_id
        ORDER BY COUNT(o.order_id) ASC LIMIT 1;`
	row := db.QueryRow(query, service_name)
	err := row.Scan(&id)
	if err != nil {
		log.Println("Lỗi scan dữ liệu:", err)
		return ""
	}
	return id
}

func getNextQueueNumber(clinic_service_id string) int {
	db := connectDB()
	defer db.Close()
	var max_queue int
	query := `SELECT o.queue_number 
        FROM orders o
        WHERE o.clinic_service_id = ?
        ORDER BY o.create_at DESC
        LIMIT 1`
	row := db.QueryRow(query, clinic_service_id)
	err := row.Scan(&max_queue)
	if err != nil {
		if err == sql.ErrNoRows {
			return 1
		}
		log.Println("Lỗi khi truy vấn:", err)
		return 1
	}
	if max_queue == 999 {
		return 1
	} else {
		return max_queue + 1
	}
}

func getPrice(citizen_id string, clinic_service_id string, service_name string) float32 {
	db := connectDB()
	defer db.Close()
	var price float32
	var price_insur float32

	query := `SELECT s.price, s.price_insurrance 
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE s.service_name = ? AND cs.clinic_service_id = ? LIMIT 1`
	row := db.QueryRow(query, service_name, clinic_service_id)
	err := row.Scan(&price, &price_insur)
	if err != nil {
		log.Println("Lỗi scan dữ liệu:", err)
		return 0.0
	}

	var is_insur bool
	query = `SELECT is_insurrance FROM patient WHERE citizen_id = ? LIMIT 1`
	row = db.QueryRow(query, citizen_id)
	err = row.Scan(&is_insur)
	if err != nil {
		log.Println("Lỗi scan dữ liệu:", err)
		return 0.0
	}

	if is_insur {
		return price_insur
	} else {
		return price
	}
}

func createOrder(citizen_id string, service_name string) int64 {
	db := connectDB()
	defer db.Close()
	clinic_service_id := getClinicServiceID(service_name)

	query := `INSERT INTO orders 
        (queue_number, citizen_id, clinic_service_id, payment_method, payment_status, price)
        VALUES
        (?, ?, ?, ?, ?, ?)`
	res, err := db.Exec(query, getNextQueueNumber(clinic_service_id), citizen_id, clinic_service_id, "CASH", "UNPAID", getPrice(citizen_id, clinic_service_id, service_name))
	if err != nil {
		log.Println("Thêm dữ liệu thất bại:", err)
		return 0
	}
	new_id, err := res.LastInsertId()
	if err != nil {
		log.Println("Lấy ID mới thất bại:", err)
		return 0
	}
	return new_id
}

func getOrder(order_id int64) (OrderFormat, error) {
	db := connectDB()
	defer db.Close()
	var order OrderFormat

	query := `SELECT o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id
        FROM orders o
        JOIN patient p ON o.citizen_id = p.citizen_id
        WHERE o.order_id = ? LIMIT 1`
	row := db.QueryRow(query, order_id)
	err := row.Scan(&order.Citizen_id, &order.Fullname, &order.Gender, &order.DOB, &order.QueueNumber, &order.CreateAt, &order.Price, &order.Is_insurrance, &order.Clinic_service_id)
	if err != nil {
		log.Println("Lỗi scan thất bại:", err)
		return order, err
	}
	query = `SELECT s.service_name, c.clinic_name, c.address_room, st.fullname
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id
        WHERE st.staff_position = "DOCTOR" AND cs.clinic_service_id = ? LIMIT 1`
	row = db.QueryRow(query, order.Clinic_service_id)
	err = row.Scan(&order.Service_name, &order.Clinic_name, &order.Address_room, &order.Doctor_name)
	if err != nil {
		log.Println("Lỗi scan thất bại:", err)
		return order, err
	}
	return order, nil
}
