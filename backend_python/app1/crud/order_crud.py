from fastapi import HTTPException
from ..database.database import connect, disconnect

def get_orders(search: str = "", skip: int = 0, limit: int = 10):
    conn, cursor = connect(dict=True)
    try:
        query = '''SELECT p.fullname, p.citizen_id, p.dob, p.insurance_id, s.service_name, o.create_at, o.queue_number, o.payment_method, o.payment_status, o.price, s.service_name, c.clinic_name, c.address_room, st.fullname AS doctor_name
        FROM orders o 
        JOIN patient p ON o.citizen_id = p.citizen_id
        JOIN clinic_service cs ON o.clinic_service_id = cs.clinic_service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id AND st.staff_position = 'DOCTOR'
        JOIN service s ON cs.service_id = s.service_id
        '''
        condition = '''WHERE p.fullname LIKE %s OR p.citizen_id = %s OR p.insurance_id = %s'''
        offset = '''LIMIT %s OFFSET %s'''
        if search != "":
            query = query + condition + offset
            params = (search, search, search, limit, skip)
        else:
            query = query + offset
            params = (limit, skip)
        cursor.execute(query, params)
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error [get_orders]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_dashboard_infos():
    conn, cursor = connect(dict=True)
    try:
        query = '''SELECT 
        DATE(o.create_at) AS order_date,
        SUM(CASE WHEN o.payment_status = 'PAID' THEN o.price ELSE 0 END) AS order_money,
        COUNT(CASE WHEN o.payment_status = 'PAID' THEN 1 END) AS total_paid_orders,
        COUNT(CASE WHEN o.payment_status = 'UNPAID' THEN 1 END) AS total_unpaid_orders,
        COUNT(CASE WHEN o.payment_status = 'CANCELLED' THEN 1 END) AS total_cancelled_orders
        FROM orders o 
        GROUP BY DATE(o.create_at)
        ORDER BY order_date DESC;
        '''
        cursor.execute(query)
        data = cursor.fetchall()
        return data
    except Exception as e:
        print(f"Error [get_dashboard_infos]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def set_pay_cash_order(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method, payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("CASH", "PAID", order_id))
        conn.commit()
    except Exception as e:
        print(f"Error [set_pay_cash_order]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)