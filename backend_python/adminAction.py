from connectDB import connect, disconnect
from fastapi import HTTPException
from mysql.connector import IntegrityError
from datetime import datetime, timedelta


def updateActivationCode(account_id: int, new_code: str):
    conn, cursor = connect()
    try:
        new_exp = datetime.now() + timedelta(minutes=15)  # code mới hết hạn sau 15p
        query = """
            UPDATE account 
            SET active_code = %s, active_exp = %s, state = 2
            WHERE account_id = %s
        """
        cursor.execute(query, (new_code, new_exp, account_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error in updateActivationCode: {e}")
        return False
    finally:
        disconnect(conn, cursor)

def updateAccountState(account_id: int, state: int):
    conn, cursor = connect()
    try:
        query = "UPDATE account SET state = %s, active_code = NULL, active_exp = NULL WHERE account_id = %s"
        cursor.execute(query, (state, account_id))
        conn.commit()
        return True
    except Exception as e:
        print("Error updateAccountState:", e)
        return False
    finally:
        disconnect(conn, cursor)


def checkAccount(id, type="CASHIER"):
    conn, cursor = connect(dict=True)
    try:
        query = "SELECT username, state FROM account WHERE account_id = %s LIMIT 1"
        cursor.execute(query, (id,))
        user = cursor.fetchone()
        if user != None:
            if user["username"] == "admin" and type == "ADMIN":
                return True
            if user["username"] != "admin" and type == "CASHIER":
                if user["state"] == 0:
                    raise HTTPException(status_code=403, detail="Tài khoản đã bị khóa")
                return True
        return False
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


def createAdminAccount(salt: str, hash_pass: str, email: str | None = None):
    conn, cursor = connect()
    try:
        query = "INSERT INTO account (username, realname, citizen_id, salt, hash_pass, email) VALUES (%s, %s, %s, %s, %s, %s)"
        cursor.execute(query, ("admin", "admin", "admin", salt, hash_pass, email))
        conn.commit()
        new_id = cursor.lastrowid
        return new_id
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def createAccount(
    realname: str,
    citizen_id: str,
    username: str,
    salt: str,
    hash_pass: str,
    email: str,
    active_code: str = None,
):
    conn, cursor = connect()
    try:
        # Nếu tạo tài khoản admin
        if username.lower() == "admin":
            if not hasAdmin():
                createAdminAccount(salt, hash_pass, email)
                return True, "✅ Tài khoản admin đã được tạo"
            else:
                return False, "⚠️ Đã tồn tại tài khoản admin"

        # Nếu là user thường
        active_exp = None
        state = 1  # mặc định active
        if active_code:
            active_exp = datetime.now() + timedelta(minutes=15)  # code hết hạn 15 phút
            state = 2  # chờ kích hoạt email

        query = """
            INSERT INTO account 
            (username, realname, citizen_id, salt, hash_pass, email, state, active_code, active_exp)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        cursor.execute(
            query,
            (
                username,
                realname,
                citizen_id,
                salt,
                hash_pass,
                email,
                state,
                active_code,
                active_exp,
            ),
        )
        conn.commit()

        return True, (
            "Tạo tài khoản thành công. Vui lòng kiểm tra email để kích hoạt"
            if active_code
            else "Tạo tài khoản thành công"
        )

    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            return False, "Tên đăng nhập hoặc email đã tồn tại"
        return False, f"Lỗi dữ liệu: {e}"

    except Exception as e:
        print(f"Error in createAccount: {e}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống khi tạo tài khoản")

    finally:
        disconnect(conn, cursor)


def lockAccount(account_id: str, action: str):
    user = getAccount(id=account_id)
    if user == None:
        raise HTTPException(
            status_code=404, detail=f"""Người dùng Id:{account_id} không tồn tại"""
        )
    elif user["username"] == "admin" and action == "lock":
        raise HTTPException(
            status_code=405, detail=f"""Không thể khóa tài khoản Admin"""
        )
    if action == "lock":
        status = 0
        result = f"Khóa tài khoản {user['username']} thành công"
    elif action == "unlock":
        status = 1
        result = f"Mở khóa tài khoản {user['username']} thành công"
    else:
        raise HTTPException(
            status_code=400, detail='''Action chỉ nhận "lock" hoặc "unlock"'''
        )
    conn, cursor = connect()
    try:
        query = "UPDATE account SET state = %s WHERE account_id = %s"
        cursor.execute(query, (status, account_id))
        conn.commit()
        return result
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def deleteAccount(account_id):
    user = getAccount(id=account_id)
    if user == None:
        raise HTTPException(
            status_code=404, detail=f"""Người dùng Id:{account_id} không tồn tại"""
        )
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


def getAccount(username: str = None, id: str = None, email: str = None):
    conn, cursor = connect(dict=True)
    try:
        if username is not None:
            query = "SELECT * FROM account WHERE username = %s LIMIT 1"
            cursor.execute(query, (username,))
        elif email is not None:
            query = "SELECT * FROM account WHERE email = %s LIMIT 1"
            cursor.execute(query, (email,))
        elif id is not None:
            query = "SELECT * FROM account WHERE account_id = %s LIMIT 1"
            cursor.execute(query, (id,))
        else:
            return None
        account = cursor.fetchone()
        return account
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def updateTimeAccessExpire(account_id: str, time: datetime):
    conn, cursor = connect(dict=True)
    try:
        query = "UPDATE account SET access_exp = %s WHERE account_id = %s"
        cursor.execute(query, (time, account_id))
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
        query = """SELECT a.account_id, a.realname, a.citizen_id, a.username, a.state
        FROM account a
        WHERE a.username <> 'admin'
        LIMIT 10 OFFSET %s
        """
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
        query = """SELECT p.fullname, p.citizen_id, p.dob, p.insurance_id, s.service_name, o.create_at, o.queue_number, o.payment_method, o.payment_status, o.price, s.service_name, c.clinic_name, c.address_room, st.fullname AS doctor_name
        FROM orders o 
        JOIN patient p ON o.citizen_id = p.citizen_id
        JOIN clinic_service cs ON o.clinic_service_id = cs.clinic_service_id
        JOIN clinic c ON cs.clinic_id = c.clinic_id
        JOIN staff st ON cs.clinic_id = st.clinic_id AND st.staff_position = 'DOCTOR'
        JOIN service s ON cs.service_id = s.service_id
        """
        condition = (
            """WHERE p.fullname LIKE %s OR p.citizen_id = %s OR p.insurance_id = %s"""
        )
        offset = """LIMIT 10 OFFSET %s"""
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
        query = """SELECT 
        DATE(o.create_at) AS order_date,
        SUM(CASE WHEN o.payment_status = 'PAID' THEN o.price ELSE 0 END) AS order_money,
        COUNT(CASE WHEN o.payment_status = 'PAID' THEN 1 END) AS total_paid_orders,
        COUNT(CASE WHEN o.payment_status = 'UNPAID' THEN 1 END) AS total_unpaid_orders,
        COUNT(CASE WHEN o.payment_status = 'CANCELLED' THEN 1 END) AS total_cancelled_orders
        FROM orders o 
        GROUP BY DATE(o.create_at)
        ORDER BY order_date DESC;
        """
        cursor.execute(query)
        data = cursor.fetchall()
        return data
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)
