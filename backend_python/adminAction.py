from connectDB import connect, disconnect
from fastapi import HTTPException
from mysql.connector import IntegrityError
from datetime import datetime

def save_session(session_id: str, account_id: str, refresh_token: str, access_exp: datetime):
    conn, cursor = connect()
    try:
        query = "INSERT INTO sessions (session_id, account_id, refresh_token, access_exp) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (session_id, account_id, refresh_token, access_exp))
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def delete_session(account_id: str):
    conn, cursor = connect()
    try:
        query = "DELETE FROM sessions WHERE account_id = %s"
        cursor.execute(query, (account_id,))
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_session(session_id: str = None, account_id: str = None):
    conn, cursor = connect(dict=True)
    try:
        if session_id is not None:
            query = "SELECT * FROM sessions WHERE session_id = %s LIMIT 1"
            cursor.execute(query, (session_id,))
        elif account_id is not None:
            query = "SELECT * FROM sessions WHERE account_id = %s LIMIT 1"
            cursor.execute(query, (account_id,))
        else:
            return None
        session = cursor.fetchone()
        if session != None:
            return session
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def hasAdmin():
    conn, cursor = connect()
    try:
        query = "SELECT account_id FROM account WHERE username = %s"
        cursor.execute(query, ("admin",))
        id = cursor.fetchone()
        if id != None:
            return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def createAdminAccount(account_id: str, salt: str, hash_pass: str):
    conn, cursor = connect()
    try:
        query = "INSERT INTO account (account_id, realname, citizen_id, username, salt, hash_pass) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (account_id, "admin", "admin", "admin", salt, hash_pass))
        conn.commit()
        new_id = cursor.lastrowid
        return new_id
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)

def createAccount(account_id: str, realname: str, citizen_id: str, username: str, salt: str, hash_pass: str):
    conn, cursor = connect()
    if username == "admin":
        if not hasAdmin():
            createAdminAccount(account_id, salt, hash_pass)
            return True, None
        else:
            return False, "INFO: Đã có tài khoản admin"
    else:
        try:
            query = "INSERT INTO account (account_id, realname, citizen_id, username, salt, hash_pass) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            cursor.execute(query, (account_id, realname, citizen_id, username, salt, hash_pass))
            conn.commit()
            new_id = cursor.lastrowid
            return new_id is not None, None
        except IntegrityError as e:
            if "Duplicate entry" in str(e):
                return False, "Có thông tin bị trùng"
            else:
                return False, f"Lỗi dữ liệu: {e}"
        except Exception as e:
            print(f"Error: {e}")
            raise HTTPException(status_code=500, detail="Lỗi không xác định")
        finally:
            disconnect(conn, cursor)

def lockAccount(account_id: str, status: bool):
    conn, cursor = connect()
    try:
        query = "UPDATE account SET state = %s WHERE account_id = %s"
        cursor.execute(query, (status, account_id))
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def deleteAccount(account_id):
    conn, cursor = connect()
    try:
        query = "DELETE FROM account WHERE account_id = %s"
        cursor.execute(query, (account_id,))
        conn.commit()
        return f"Xóa thành công tài khoản Id:{account_id}"
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def getAccount(username: str = None, id: str = None):
    conn, cursor = connect(dict=True)
    try:
        if username is not None:
            query = "SELECT * FROM account WHERE username = %s LIMIT 1"
            cursor.execute(query, (username,))
        elif id is not None:
            query = "SELECT * FROM account WHERE account_id = %s LIMIT 1"
            cursor.execute(query, (id,))
        else:
            return None
        account = cursor.fetchone()
        if account != None:
            return account
        else:
            return None
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)

def updateTimeAccessExpire(session_id: str, time: datetime):
    conn, cursor = connect(dict=True)
    try:
        query = "UPDATE sessions SET access_exp = %s WHERE session_id = %s"
        cursor.execute(query, (time, session_id))
        conn.commit()
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def changePass(id, salt, hash_pass):
    conn, cursor = connect(dict=True)
    try:
        query = "UPDATE account SET salt = %s, hash_pass = %s WHERE account_id = %s"
        cursor.execute(query, (salt, hash_pass, id))
        conn.commit()
        return cursor.rowcount != 0
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def getCashiers(skip):
    conn, cursor = connect(dict=True)
    try:
        query = '''SELECT a.account_id, a.realname, a.citizen_id, a.username, a.state
        FROM account a
        WHERE a.username <> 'admin'
        LIMIT 10 OFFSET %s
        '''
        cursor.execute(query, (skip,))
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def getOrders(search, skip):
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
        offset = '''LIMIT 10 OFFSET %s'''
        if search != "":
            query = query + condition + offset
            params = (search, search, search, skip)
        else:
            query = query + offset
            params = (skip,)
        cursor.execute(query, params)
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def getDashboardInfos():
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
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)