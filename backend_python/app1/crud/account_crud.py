from fastapi import HTTPException
from mysql.connector import IntegrityError
from ..database.database import connect, disconnect

def get_account(account_id: str = None, username: str = None):
    conn, cursor = connect(dict=True)
    try:
        if username:
            query = "SELECT * FROM account WHERE username = %s LIMIT 1"
            cursor.execute(query, (username,))
        elif account_id:
            query = "SELECT * FROM account WHERE account_id = %s LIMIT 1"
            cursor.execute(query, (account_id,))
        else:
            return None
        account = cursor.fetchone()
        return account
    except Exception as e:
        print(f"Error [get_account]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def require_account(account_id: str = None, username: str = None):
    account = get_account(account_id, username)
    if account is None:
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")
    return account

def create_account(account_id: str, realname: str, username: str, citizen_id: str, salt: str, hash_pass: str):
    conn, cursor = connect()
    try:
        query = "INSERT INTO account (account_id, realname, username, citizen_id, salt, hash_pass) VALUES (%s, %s, %s, %s, %s, %s, %s)"
        cursor.execute(query, (account_id, realname, username, citizen_id, salt, hash_pass))
        conn.commit()
    except IntegrityError as e:
        if "Duplicate entry" in str(e):
            raise HTTPException(status_code=400, detail="Thông tin bị trùng")
        else:
            raise HTTPException(status_code=400, detail="Lỗi dữ liệu")
    except Exception as e:
        print(f"Error [create_account]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def lock_account(account_id: str, status: bool):
    conn, cursor = connect()
    try:
        query = "UPDATE account SET state = %s WHERE account_id = %s"
        cursor.execute(query, (status, account_id))
        conn.commit()
    except Exception as e:
        print(f"Error [lock_account]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def delete_account(account_id: str):
    conn, cursor = connect()
    try:
        query = "DELETE FROM account WHERE account_id = %s"
        cursor.execute(query, (account_id,))
        conn.commit()
    except Exception as e:
        print(f"Error [delete_account]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def update_password(account_id: str, salt: str, hash_pass: str):
    conn, cursor = connect()
    try:
        query = "UPDATE account SET salt = %s, hash_pass = %s WHERE account_id = %s"
        cursor.execute(query, (salt, hash_pass, account_id))
        conn.commit()
    except Exception as e:
        print(f"Error [update_password]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def get_cashiers(skip: int = 0, limit: int = 10):
    conn, cursor = connect(dict=True)
    try:
        query = '''SELECT a.account_id, a.realname, a.citizen_id, a.username, a.state
        FROM account a
        WHERE a.username <> 'admin'
        LIMIT %s OFFSET %s
        '''
        cursor.execute(query, (limit, skip))
        orders = cursor.fetchall()
        return orders
    except Exception as e:
        print(f"Error [get_cashiers]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)