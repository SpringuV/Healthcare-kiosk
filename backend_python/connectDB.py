import mysql.connector
from mysql.connector import errorcode

def main():
    conn, cursor = connect()
    print(conn)
    print(cursor)
    disconnect(conn, cursor)

def connect():
    config = {
        "host" : "localhost",
        "user" : "root",
        "password" : "hocmysql1234",
        "database" : "kiosk_health"
    }
    try:
        conn = mysql.connector.Connect(**config)
        cursor = conn.cursor()
        return conn, cursor
    except mysql.connector.Error as err:
        if err.errno == errorcode.ER_ACCESS_DENIED_ERROR:
            print(f"User {config['user']} chưa tồn tại hoặc mật khẩu sai.")
        if err.errno == errorcode.ER_BAD_DB_ERROR:
            conn = mysql.connector.Connect(
                host=config["host"],
                user=config["user"],
                password=config["password"]
            )
            cursor = conn.cursor()
            query = "CREATE DATABASE kiosk_health;"
            cursor.execute(query)
            conn.database = config["database"]
            queries = [
                '''CREATE TABLE heath_insurrance (
                    citizen_id VARCHAR(12) PRIMARY KEY,
                    fullname VARCHAR(30) NOT NULL,
                    gender BOOLEAN NOT NULL,
                    dob DATE NOT NULL,
                    phone_number CHAR(10) NOT NULL,
                    registration_place TEXT NOT NULL,
                    valid_from DATE NOT NULL,
                    expired DATE NOT NULL
                );''',
                '''CREATE TABLE patient (
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
                );''',
                '''CREATE TABLE clinic (
                    clinic_id INT AUTO_INCREMENT PRIMARY KEY,
                    clinic_name VARCHAR(30) NOT NULL,
                    clinic_status BOOLEAN DEFAULT 0,
                    address_room VARCHAR(30) NOT NULL
                );''',
                '''CREATE TABLE staff (
                    staff_id INT AUTO_INCREMENT PRIMARY KEY,
                    fullname VARCHAR(30) NOT NULL,
                    staff_position ENUM('DOCTOR', 'NURSE'),
                    clinic_id INT NULL,
                    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id) ON DELETE SET NULL
                );''',
                '''CREATE TABLE service (
                    service_id INT AUTO_INCREMENT PRIMARY KEY,
                    service_name VARCHAR(50) NOT NULL,
                    service_description TEXT NOT NULL,
                    price DECIMAL(8, 2) NOT NULL,
                    price_insurrance DECIMAL(8, 2) NOT NULL
                );''',
                '''CREATE TABLE clinic_service (
                    clinic_service_id INT AUTO_INCREMENT PRIMARY KEY,
                    clinic_id INT,
                    service_id INT,
                    service_status BOOLEAN DEFAULT 1,
                    FOREIGN KEY (clinic_id) REFERENCES clinic(clinic_id) ON DELETE CASCADE,
                    FOREIGN KEY (service_id) REFERENCES service(service_id) ON DELETE CASCADE
                );''',
                '''CREATE TABLE orders (
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
                );''']
            for query in queries:
                cursor.execute(query)
            return conn, cursor


def disconnect(conn, cursor):
    cursor.close()
    conn.close()

if __name__ == "__main__":
    main()