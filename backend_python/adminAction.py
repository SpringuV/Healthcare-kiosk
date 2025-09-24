from connectDB import connect, disconnect
from mysql.connector import Error
from mysql.connector import IntegrityError

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

def getAccount(username):
    conn, cursor = connect(dict=True)
    try:
        query = "SELECT * FROM account WHERE username = %s LIMIT 1"
        cursor.execute(query, (username,))
        account = cursor.fetchone()
        return account
    except Exception as e:
        print(f"Error: {e}")
        return None
    finally:
        disconnect(conn, cursor)