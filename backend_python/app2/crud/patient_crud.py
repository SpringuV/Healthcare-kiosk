from ..database.database import connect, disconnect
from fastapi.exceptions import HTTPException
from mysql.connector import Error

def get_patient(citizen_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT * FROM patient WHERE citizen_id = %s LIMIT 1"""
        cursor.execute(query, (citizen_id,))
        patient = cursor.fetchone()
        return patient
    except Exception as e:
        print(f"Error [get_patient]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def require_patient(citizen_id: str):
    insurance = get_patient(citizen_id=citizen_id)
    if insurance is None:
        raise HTTPException(status_code=404, detail="Không có thông tin bảo hiểm")
    return insurance

def save_patient(citizen_id: str, fullname: str, dob: str, gender: bool, phone_number: str, address: str, ethnic: str, job: str, insurance_id: str):
    conn, cursor = connect()
    try:
        query = """INSERT INTO patient 
                   (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, insurance_id) 
                   VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)"""
        cursor.execute(
            query, (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, insurance_id)
        )
        conn.commit()

        if cursor.rowcount > 0:
            return
        else:
            raise HTTPException(status_code=400, detail="Không lưu được thông tin")
    except Error as e:
        print(f"Database Error: {e}")
        if e.errno == 1062:
            return HTTPException(status_code=400, detail=f"Công dân với ID '{citizen_id}' đã tồn tại")
    except Exception as e:
        print(f"Error [save_patient]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def update_insurance_id(citizen_id: str, insurance_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE patient SET insurance_id = %s WHERE citizen_id = %s"""
        cursor.execute(query, (insurance_id, citizen_id))
        conn.commit()
    except Exception as e:
        print(f"Error [update_insurance_id]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

# Lấy lịch sử khám bệnh theo citizen_id
def get_patient_history(citizen_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """
        SELECT 
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
        JOIN clinic_service cs ON o.clinic_service_id = cs.clinic_service_id
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        LEFT JOIN staff st ON cs.clinic_id = st.clinic_id AND st.staff_position = "DOCTOR"
        WHERE o.citizen_id = %s
        ORDER BY o.create_at DESC
        """
        cursor.execute(query, (citizen_id,))
        history = cursor.fetchall()
        return history
    except Exception as e:
        print(f"Error [get_patient_history]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)