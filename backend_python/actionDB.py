from datetime import datetime
from connectDB import connect, disconnect

def isInsurrance(citizen_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT * FROM heath_insurrance WHERE citizen_id = %s'''
        cursor.execute(query, (citizen_id,))
        result = cursor.fetchone()
        if result:
            now = datetime.now().date()
            if result[6] <= now <= result[7]:
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

def getInsurrance(citizen_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT * FROM heath_insurrance WHERE citizen_id = %s'''
        cursor.execute(query, (citizen_id,))
        insurrance = cursor.fetchone()
        if insurrance:
            return insurrance
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)

def isHasPatientInfo(citizen_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT * FROM patient WHERE citizen_id = %s'''
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

def updatePatientInsurranceState(citizen_id:str, state:bool):
    conn, cursor = connect()
    try:
        state_int = 1 if state else 0
        query = '''SELECT is_insurrance FROM patient WHERE citizen_id = %s'''
        cursor.execute(query, (citizen_id,))
        data_state = cursor.fetchone()[0]
        if data_state == state_int:
            return True
        query = '''UPDATE patient SET is_insurrance = %s WHERE citizen_id = %s'''
        cursor.execute(query, (state_int, citizen_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)

def savePatientInfo(citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, is_insurrance):
    conn, cursor = connect()
    try:
        insur_int = 1 if is_insurrance else 0
        query = '''INSERT INTO patient (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, is_insurrance) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)'''
        cursor.execute(query, (citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, insur_int))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Database error: {e}")
        return False
    finally:
        disconnect(conn, cursor)

def updatePatientInfo(citizen_id, address, ethnic, job, is_insurrance):
    conn, cursor = connect()
    try:
        query = '''UPDATE patient SET address = %s, ethnic = %s, job = %s, is_insurrance = 1 WHERE citizen_id = %s'''
        cursor.execute(query, (address, ethnic, job, citizen_id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        return False
    finally:
        disconnect(conn, cursor)

def getPatient(citizen_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT * FROM patient WHERE citizen_id = %s'''
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
        query = '''SELECT
        s.service_name,
        s.service_description
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE cs.service_status = 1
        GROUP BY s.service_name, s.service_description
        ORDER BY s.service_name;'''
        cursor.execute(query)
        services = cursor.fetchall()
        return services
    except Exception as e:
        print(f"Error: {e}")
        return []
    finally:
        disconnect(conn, cursor)

def getNextQueueNumber(clinic_service_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT o.queue_number 
        FROM orders o
        WHERE o.clinic_service_id = %s
        ORDER BY o.create_at DESC
        LIMIT 1'''
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

def getClinicServiceID(service_name:str):
    conn, cursor = connect()
    try:
        query = '''SELECT cs.clinic_service_id
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        LEFT JOIN orders o ON cs.clinic_service_id = o.clinic_service_id AND o.order_status = 0
        WHERE s.service_name = %s AND cs.service_status = 1
        GROUP BY cs.clinic_service_id
        ORDER BY COUNT(o.order_id) ASC LIMIT 1;
        '''
        cursor.execute(query, (service_name,))
        clinic_service_id = cursor.fetchone()[0]
        return clinic_service_id
    except Exception as e:
        print(f"Error: {e}")
    finally:
        disconnect(conn, cursor)

def getPrice(citizen_id:str, clinic_service_id:str, service_name:str):
    conn, cursor = connect()
    try:
        query = '''SELECT s.price, s.price_insurrance 
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE s.service_name = %s AND cs.clinic_service_id = %s LIMIT 1'''
        cursor.execute(query, (service_name, clinic_service_id))
        price_values = cursor.fetchone()
        if not price_values:
            return 0
        price, price_insur = price_values
        query = '''SELECT is_insurrance FROM patient WHERE citizen_id = %s'''
        cursor.execute(query, (citizen_id,))
        state = cursor.fetchone()[0]
        if state == 1:
            return price_insur
        else:
            return price
    except Exception as e:
        print(f"Error: {e}")
        return 0
    finally:
        disconnect(conn, cursor)

def createOrder(citizen_id:str, service_name:str):
    conn, cursor = connect()
    try:
        clinic_service_id = getClinicServiceID(service_name)
        query = '''INSERT INTO orders 
        (queue_number, citizen_id, clinic_service_id, payment_method, payment_status, price)
        VALUES
        (%s, %s, %s, %s, %s, %s)
        '''
        cursor.execute(query, (getNextQueueNumber(clinic_service_id), citizen_id, clinic_service_id, 'CASH', 'UNPAID', getPrice(citizen_id, clinic_service_id, service_name)))
        conn.commit()
        new_id = cursor.lastrowid
        return new_id
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)

def getOrder(order_id:str):
    conn, cursor = connect()
    try:
        query = '''SELECT o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id
        FROM orders o
        JOIN patient p ON o.citizen_id = p.citizen_id
        WHERE o.order_id = %s
        '''
        cursor.execute(query, (order_id,))
        info1 = cursor.fetchone()
        if not info1:
            return None
        clinic_service_id = info1[-1]
        query = '''SELECT s.service_name, c.clinic_name, c.address_room, st.fullname
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id
        WHERE st.staff_position = "DOCTOR" AND cs.clinic_service_id = %s
        '''
        cursor.execute(query, (clinic_service_id,))
        info2 = cursor.fetchone()
        if not info2:
            return None
        # o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname
        return list(info1) + list(info2)
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)