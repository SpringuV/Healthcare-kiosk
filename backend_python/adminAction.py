from connectDB import connect, disconnect
from mysql.connector import Error
from mysql.connector import IntegrityError

def checkAccount(id, type="CASHIER"):
    conn, cursor = connect(dict=True)
    try:
        query = "SELECT username FROM account WHERE account_id = %s LIMIT 1"
        cursor.execute(query, (id,))
        username = cursor.fetchone()
        if username != None:
            if username == "admin" and type == "ADMIN":
                return True
            if username != "admin" and type == "CASHIER":
                return True
        return False
    except Exception as e:
        print(f"Error: {e}")
        return False
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
        return False
    finally:
        disconnect(conn, cursor)

def createAdminAccount(salt: str, hash_pass: str):
    conn, cursor = connect()
    try:
        query = "INSERT INTO account (username, realname, citizen_id, salt, hash_pass) VALUES (%s, %s, %s, %s, %s)"
        cursor.execute(query, ("admin", "admin", "admin", salt, hash_pass))
        conn.commit()
        new_id = cursor.lastrowid
        return new_id
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)

def createAccount(realname: str, citizen_id: str, username: str, salt: str, hash_pass: str):
    conn, cursor = connect()
    if username == "admin":
        if not hasAdmin():
            createAdminAccount(salt, hash_pass)
            return True, None
        else:
            return False, "Đã có tài khoản admin"
    else:
        try:
            query = "INSERT INTO account (username, realname, citizen_id, salt, hash_pass) VALUES (%s, %s, %s, %s, %s)"
            cursor.execute(query, (realname, citizen_id, username, salt, hash_pass))
            conn.commit()
            new_id = cursor.getlastrowid()
            return new_id is not None, None
        except IntegrityError as e:
            if "Duplicate entry" in str(e):
                return False, "Tên đăng nhập đã tồn tại"
            else:
                return False, f"Lỗi dữ liệu: {e}"
        except Exception as e:
            print(f"Error: {e}")
            return False, "Lỗi xử lý"
        finally:
            disconnect(conn, cursor)

def getAccount(info):
    conn, cursor = connect(dict=True)
    try:
        query = "SELECT * FROM account WHERE username = %s OR account_id = %s LIMIT 1"
        cursor.execute(query, (info, info))
        account = cursor.fetchone()
        return account
    except Exception as e:
        print(f"Error: {e}")
        return None
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
        return False
    finally:
        disconnect(conn, cursor)

def getOrders(skip):
    conn, cursor = connect(dict=True)
    try:
        query = '''SELECT p.fullname, p.citizen_id, p.dob, hi.insurance_id, s.service_name, o.create_at, o.payment_method, o.payment_status, o.price
        FROM orders o 
        JOIN patient p ON o.citizen_id = p.citizen_id
        LEFT JOIN heath_insurance hi ON hi.citizen_id = p.citizen_id
        JOIN clinic_service cs ON o.clinic_service_id = cs.clinic_service_id
        JOIN service s ON cs.service_id = s.service_id
        LIMIT 10 OFFSET %s
        '''
        cursor.execute(query, (skip,))
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)