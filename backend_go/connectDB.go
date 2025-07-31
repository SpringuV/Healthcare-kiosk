package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/go-sql-driver/mysql"
)

const (
	host     = "localhost"
	user     = "machine"
	password = "P@$$vv0rd"
	database = "kiosk"
	post     = 3306
)

func getDSN() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?parseTime=true", user, password, host, post, database)
}

func getDSNWithoutDB() string {
	return fmt.Sprintf("%s:%s@tcp(%s:%d)/", user, password, host, post)
}

func connectDB() *sql.DB {
	db, _ := sql.Open("mysql", getDSN())
	return db
}

func ChekingDBConnection() {
	db, err := sql.Open("mysql", getDSNWithoutDB())
	if err != nil {
		log.Println("Không thể mở kết nối:", err)
		os.Exit(1)
	}
	defer db.Close()

	_, err = db.Exec("CREATE DATABASE IF NOT EXISTS kiosk")
	if err != nil {
		log.Fatalf("Không thể tạo database: %v", err)
		os.Exit(1)
	}

	db2, err := sql.Open("mysql", getDSN())
	if err != nil {
		log.Fatalf("Không thể kết nối đến database kiosk: %v", err)
		os.Exit(1)
	}
	defer db2.Close()

	if err = db2.Ping(); err != nil {
		log.Fatalf("Ping đến DB kiosk thất bại: %v", err)
		os.Exit(1)
	}

	tryCreateTables(db2)
}

func tryCreateTables(db *sql.DB) {
	queries := []string{
		`CREATE TABLE IF NOT EXISTS heath_insurrance (
			citizen_id VARCHAR(12) PRIMARY KEY,
			fullname VARCHAR(30) NOT NULL,
			gender BOOLEAN NOT NULL,
			dob DATE NOT NULL,
			phone_number CHAR(10) NOT NULL,
			registration_place TEXT NOT NULL,
			valid_from DATE NOT NULL,
			expired DATE NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS patient (
			citizen_id VARCHAR(12) PRIMARY KEY,
			fullname VARCHAR(30) NOT NULL,
			gender BOOLEAN NOT NULL,
			dob DATE NOT NULL,
			address VARCHAR(80) NOT NULL,
			phone_number CHAR(10) NOT NULL,
			ethnic VARCHAR(10),
			job VARCHAR(30),
			create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			is_insurrance BOOLEAN
		);`,
		`CREATE TABLE IF NOT EXISTS clinic (
			clinic_id INT AUTO_INCREMENT PRIMARY KEY,
			clinic_name VARCHAR(30) NOT NULL,
			clinic_status BOOLEAN DEFAULT 0,
			address_room VARCHAR(30) NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS staff (
			staff_id INT AUTO_INCREMENT PRIMARY KEY,
			fullname VARCHAR(30) NOT NULL,
			staff_position ENUM('DOCTOR', 'NURSE'),
			clinic_id INT NULL,
			FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id) ON DELETE SET NULL
		);`,
		`CREATE TABLE IF NOT EXISTS service (
			service_id INT AUTO_INCREMENT PRIMARY KEY,
			service_name VARCHAR(50) NOT NULL,
			service_description TEXT NOT NULL,
			price DECIMAL(8, 2) NOT NULL,
			price_insurrance DECIMAL(8, 2) NOT NULL
		);`,
		`CREATE TABLE IF NOT EXISTS clinic_service (
			clinic_service_id INT AUTO_INCREMENT PRIMARY KEY,
			clinic_id INT,
			service_id INT,
			service_status BOOLEAN DEFAULT 1,
			FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id) ON DELETE CASCADE,
			FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
		);`,
		`CREATE TABLE IF NOT EXISTS orders (
			order_id INT AUTO_INCREMENT PRIMARY KEY,
			queue_number INT NOT NULL,
			citizen_id VARCHAR(12),
			clinic_service_id INT,
			create_at DATETIME DEFAULT CURRENT_TIMESTAMP,
			order_status BOOLEAN DEFAULT 0,
			payment_method ENUM('CASH','CARD','INSURRANCE','BANKING'),
			payment_status ENUM('PAID','UNPAID','PENDING','CANCELLED'),
			price DECIMAL(8, 2) NOT NULL,
			FOREIGN KEY (citizen_id) REFERENCES patient(citizen_id) ON DELETE CASCADE,
			FOREIGN KEY (clinic_service_id) REFERENCES clinic_service(clinic_service_id) ON DELETE CASCADE
		);`,
	}
	for i, query := range queries {
		_, err := db.Exec(query)
		if err != nil {
			log.Fatalf("Lỗi tạo bảng #%d: %v", i+1, err)
		}
	}
}
