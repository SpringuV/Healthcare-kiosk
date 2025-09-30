from ..database.database import connect, disconnect
from fastapi.exceptions import HTTPException

def get_order_services():
    conn, cursor = connect(dict=True)
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
        print(f"Error [get_order_services]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_latest_queue_number(clinic_service_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT o.queue_number 
        FROM orders o
        WHERE o.clinic_service_id = %s
        ORDER BY o.create_at DESC
        LIMIT 1"""
        cursor.execute(query, (clinic_service_id,))
        latest_queue = cursor.fetchone()
        return latest_queue
    except Exception as e:
        print(f"Error [get_latest_queue_number]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_clinic_service_id(service_name: str):
    conn, cursor = connect(dict=True)
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
        clinic_service_id = cursor.fetchone()
        if clinic_service_id is None:
            raise HTTPException(status_code=404, detail="Chưa có dịch vụ nào")
        return clinic_service_id["clinic_service_id"]
    except Exception as e:
        print(f"Error [get_clinic_service_id]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_price(
    citizen_id: str, clinic_service_id: str, service_name: str, type_order: str
):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT s.price, s.price_insurance 
        FROM service s
        JOIN clinic_service cs ON s.service_id = cs.service_id
        WHERE s.service_name = %s AND cs.clinic_service_id = %s LIMIT 1"""
        cursor.execute(query, (service_name, clinic_service_id))
        price_values = cursor.fetchone()
        if price_values is None:
            raise HTTPException(status_code=400, detail="Thông tin không hợp lệ")
        return price_values["price"], price_values["price_insurance"]
    
        query = """SELECT insurance_id FROM patient WHERE citizen_id = %s"""
        cursor.execute(query, (citizen_id,))
        state = cursor.fetchone()[0]
        if state != None and type_order == "insurance":
            return price_insur
        else:
            return price
        
    except Exception as e:
        print(f"Error [get_price]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def cancel_order(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("CANCELLED", order_id))
        conn.commit()
    except Exception as e:
        print(f"Error [cancel_order]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_order(order_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT * FROM orders WHERE order_id = %s LIMIT 1"""
        cursor.execute(query, (order_id,))
        order = cursor.fetchone()
        return order
    except Exception as e:
        print(f"Error [get_order]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def require_order(order_id: str):
    order = get_order(order_id=order_id)
    if order is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám")
    return order

def get_order_full_info(order_id: str):
    conn, cursor = connect(dict=True)
    try:
        query1 = """SELECT o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.insurance_id, o.clinic_service_id
        FROM orders o
        JOIN patient p ON o.citizen_id = p.citizen_id
        WHERE o.order_id = %s LIMIT 1
        """
        cursor.execute(query1, (order_id,))
        info1 = cursor.fetchone()

        if info1 is None:
            print(f"Error [get_order_full_info] info1")
            raise HTTPException(status_code=404, detail="Thất bại lấy thông tin phiếu mới")
        clinic_service_id = info1["clinic_service_id"]
        query2 = """SELECT s.service_name, c.clinic_name, c.address_room, st.fullname AS doctor_name, s.price_insurance
        FROM clinic_service cs
        JOIN service s ON cs.service_id = s.service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id
        WHERE st.staff_position = "DOCTOR" AND cs.clinic_service_id = %s LIMIT 1
        """
        cursor.execute(query2, (clinic_service_id,))
        info2 = cursor.fetchone()

        if info2 is None:
            print(f"Error [get_order_full_info] info2")
            raise HTTPException(status_code=404, detail="Thất bại lấy thông tin phiếu mới")
        use_insurance = True if float(info1["price"]) == float(info2["price_insurance"]) else False
        # o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurance o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname, use_insurance
        return info1 | info2 | {"use_insurance": use_insurance}
    except Exception as e:
        print(f"Error [get_order_full_info]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def create_order(citizen_id: str, clinic_service_id: str, queue_number: str, payment_method: str, payment_status: str, price: str):
    conn, cursor = connect()
    try:
        query = """INSERT INTO orders 
        (queue_number, citizen_id, clinic_service_id, payment_method, payment_status, price)
        VALUES
        (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(query, (queue_number, citizen_id, clinic_service_id, payment_method, payment_status, price))
        conn.commit()
        order_id = cursor.lastrowid
        if order_id:
            return order_id
        else:
            raise HTTPException(status_code=401, detail="Tạo phiếu thất bại")
    except Exception as e:
        print(f"Error [create_order]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)