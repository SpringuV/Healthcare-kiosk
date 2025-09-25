from datetime import datetime
from connectDB import connect, disconnect
from mysql.connector import Error


def isInsurance(citizen_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT * FROM heath_insurance WHERE citizen_id = %s LIMIT 1"""
        cursor.execute(query, (citizen_id,))
        result = cursor.fetchone()
        if result:
            now = datetime.now().date()
            if result[7] <= now <= result[8]:
                return True, "Bảo hiểm hợp lệ", result
            else:
                return False, "Hết thời hạn bảo hiểm", result
        else:
            return False, "Không có bảo hiểm", None
    except Exception as e:
        print(f"Error: {e}")
        return False, str(e), None
    finally:
        disconnect(conn, cursor)


def getInsurance(citizen_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT * FROM heath_insurance WHERE citizen_id = %s LIMIT 1"""
        cursor.execute(query, (citizen_id,))
        insurance = cursor.fetchone()
        if insurance:
            return insurance
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)


def isHasPatientInfo(citizen_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT * FROM patient WHERE citizen_id = %s"""
        cursor.execute(query, (citizen_id,))
        result = cursor.fetchone()
        if result:
            return True, "Có thông tin bệnh nhân"
        else:
            return False, "Không có thông tin bệnh nhân"
    except Exception as e:
        print(f"Error: {e}")
        return False, str(e)
    finally:
        disconnect(conn, cursor)


def updatePatientInsuranceState(citizen_id: str, insurance_id: str | None = None):
    conn, cursor = connect()
    try:
        query = """UPDATE patient SET insurance_id = %s WHERE citizen_id = %s"""
        cursor.execute(query, (insurance_id, citizen_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)


def savePatientInfo(
    citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, insurance_id
):
    conn, cursor = connect()
    try:
        gender_int = 1 if gender else 0  # Convert boolean to int

        query = """INSERT INTO patient 
                   (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, insurance_id) 
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
        cursor.execute(
            query,
            (
                citizen_id,
                fullname,
                gender_int,  # Sử dụng gender_int thay vì gender
                dob,
                address,
                phone_number,
                ethnic,
                job,
                insurance_id,
            ),
        )
        conn.commit()

        if cursor.rowcount > 0:  # Sử dụng > 0 thay vì != 0
            print("Insert successful")
            return True, "Success"
        else:
            print("Insert failed - no rows affected")
            return False, "Không thể lưu thông tin"

    except Error as e:
        print(f"Database Error: {e}")
        if e.errno == 1062:
            return False, f"Công dân với ID '{citizen_id}' đã tồn tại"
        else:
            return False, f"Lỗi cơ sở dữ liệu: {str(e)}"
    except Exception as e:
        print(f"Unexpected Error: {e}")
        return False, f"Lỗi hệ thống: {str(e)}"
    finally:
        disconnect(conn, cursor)


def updatePatientInfo(citizen_id, address, ethnic, job, insurance_id):
    conn, cursor = connect()
    try:
        query = """UPDATE patient SET address = %s, ethnic = %s, job = %s, insurance_id = %s WHERE citizen_id = %s"""
        cursor.execute(query, (address, ethnic, job, insurance_id, citizen_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)


def getPatient(citizen_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT * FROM patient WHERE citizen_id = %s"""
        cursor.execute(query, (citizen_id,))
        info = cursor.fetchone()
        if info:
            return info
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)


def getServices():
    conn, cursor = connect()
    try:
        query = """SELECT
        c.clinic_name,
        s.service_name,
        s.service_description,
        s.price
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        WHERE cs.service_status = 1
        ORDER BY c.clinic_name, s.service_name;"""
        cursor.execute(query)
        services = cursor.fetchall()
        return services
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        disconnect(conn, cursor)


def getNextQueueNumber(clinic_service_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT o.queue_number 
        FROM orders o
        WHERE o.clinic_service_id = %s
        ORDER BY o.create_at DESC
        LIMIT 1"""
        cursor.execute(query, (clinic_service_id,))
        max_queue = cursor.fetchone()
        current = max_queue[0] if max_queue else None
        if current is None or current == 999:
            return 1
        else:
            return current + 1
    except Exception as e:
        print(f"Error: {e}")
        return 1
    finally:
        disconnect(conn, cursor)


# Lấy lịch sử khám bệnh theo citizen_id
def getPatientHistory(citizen_id: str):
    conn, cursor = connect()
    try:
        query = """
        SELECT 
            p.citizen_id,
            p.fullname,
            p.gender,
            p.dob,
            p.address,
            p.phone_number,
            p.ethnic,
            p.job,
            p.insurance_id,
            o.order_id,
            o.create_at AS time_order,
            o.queue_number,
            s.service_name,
            c.clinic_name,
            c.address_room,
            st.fullname AS doctor_name,
            o.payment_status,
            o.payment_method,
            o.price
        FROM orders o
        JOIN patient p ON o.citizen_id = p.citizen_id
        JOIN clinic_service cs ON o.clinic_service_id = cs.clinic_service_id
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        LEFT JOIN staff st ON cs.clinic_id = st.clinic_id AND st.staff_position = "DOCTOR"
        WHERE o.citizen_id = %s
        ORDER BY o.create_at DESC
        """
        cursor.execute(query, (citizen_id,))
        history = cursor.fetchall()
        columns = [col[0] for col in cursor.description]
        return [dict(zip(columns, row)) for row in history]
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        disconnect(conn, cursor)


def getClinicServiceID(service_name: str):
    conn, cursor = connect()
    try:
        query = """SELECT cs.clinic_service_id
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        LEFT JOIN orders o ON cs.clinic_service_id = o.clinic_service_id AND o.order_status = 0
        WHERE s.service_name = %s AND cs.service_status = 1
        GROUP BY cs.clinic_service_id
        ORDER BY COUNT(o.order_id) ASC LIMIT 1;
        """
        cursor.execute(query, (service_name,))
        clinic_service_id = cursor.fetchone()[0]
        return clinic_service_id
    except Exception as e:
        print(f"Error: {e}")
    finally:
        disconnect(conn, cursor)


def getPrice(
    citizen_id: str, clinic_service_id: str, service_name: str, type_order: str
):
    conn, cursor = connect()
    try:
        query = """SELECT s.price, s.price_insurance 
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE s.service_name = %s AND cs.clinic_service_id = %s LIMIT 1"""
        cursor.execute(query, (service_name, clinic_service_id))
        price_values = cursor.fetchone()
        if not price_values:
            return 0
        price, price_insur = price_values
        query = """SELECT insurance_id FROM patient WHERE citizen_id = %s"""
        cursor.execute(query, (citizen_id,))
        state = cursor.fetchone()[0]
        if state != None and type_order == "insurance":
            return price_insur
        else:
            return price
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        disconnect(conn, cursor)


def cancelOrder(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("CANCELLED", order_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error cancelOrder: {e}")
        return False
    finally:
        disconnect(conn, cursor)


def createOrder(citizen_id: str, service_name: str, type_order: str):
    conn, cursor = connect()
    try:
        clinic_service_id = getClinicServiceID(service_name)
        query = """INSERT INTO orders 
        (queue_number, citizen_id, clinic_service_id, payment_method, payment_status, price)
        VALUES
        (%s, %s, %s, %s, %s, %s)
        """
        if type_order == "insurance":
            activate, _, _ = isInsurance(citizen_id)
            if not activate:
                return None
            cursor.execute(
                query,
                (
                    getNextQueueNumber(clinic_service_id),
                    citizen_id,
                    clinic_service_id,
                    "INSURANCE",
                    "PAID",
                    getPrice(citizen_id, clinic_service_id, service_name, type_order),
                ),
            )
        elif type_order == "non-insurance":
            cursor.execute(
                query,
                (
                    getNextQueueNumber(clinic_service_id),
                    citizen_id,
                    clinic_service_id,
                    "CASH",
                    "UNPAID",
                    getPrice(citizen_id, clinic_service_id, service_name, type_order),
                ),
            )
        conn.commit()
        new_id = cursor.lastrowid
        return new_id
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)


def getOrder(order_id: str):
    conn, cursor = connect()
    try:
        query1 = """SELECT o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.insurance_id, o.clinic_service_id
        FROM orders o
        JOIN patient p ON o.citizen_id = p.citizen_id
        WHERE o.order_id = %s LIMIT 1
        """
        cursor.execute(query1, (order_id,))
        info1 = cursor.fetchone()
        if info1 is None:
            print(f"Error info1")
            return None
        info1 = list(info1)
        info1[7] = bool(info1[7])
        clinic_service_id = info1[-1]
        query2 = """SELECT s.service_name, c.clinic_name, c.address_room, st.fullname, s.price_insurance
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id
        WHERE st.staff_position = "DOCTOR" AND cs.clinic_service_id = %s LIMIT 1
        """
        cursor.execute(query2, (clinic_service_id,))
        info2 = cursor.fetchone()

        if info2 is None:
            print(f"Error info2")
            return None
        use_insurance = True if float(info1[-3]) == float(info2[-1]) else False
        # o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurance o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname, use_insurance
        return info1 + list(info2[0:-1]) + [use_insurance]
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)


def getOrderInfo(order_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT * FROM orders WHERE order_id = %s LIMIT 1"""
        cursor.execute(query, (order_id,))
        order = cursor.fetchone()
        if not order:
            return None
        return order
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)


def setPaymentMethod(order_id: str, method: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method = %s WHERE order_id = %s"""
        cursor.execute(query, (method, order_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)


def getTransferState(order_id: str):
    conn, cursor = connect()
    try:
        query = """SELECT payment_status FROM orders WHERE order_id = %s LIMIT 1"""
        cursor.execute(query, (order_id,))
        state = cursor.fetchone()
        if not state:
            return False, "Không tìm thấy order"
        if state[0] == "UNPAID":
            return False, "Chưa thanh toán"
        return True, ""
    except Exception as e:
        print(f"Error: {e}")
        return False, "Lỗi backend"
    finally:
        disconnect(conn, cursor)


def updateTransferState(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method = %s, payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("BANKING", "PAID", order_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)
