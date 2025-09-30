from fastapi import HTTPException
from ..database.database import connect, disconnect
from datetime import datetime

def save_session(session_id: str, account_id: str, refresh_token: str, access_exp: datetime):
    conn, cursor = connect()
    try:
        query = "INSERT INTO sessions (session_id, account_id, refresh_token, access_exp) VALUES (%s, %s, %s, %s)"
        cursor.execute(query, (session_id, account_id, refresh_token, access_exp))
        conn.commit()
    except Exception as e:
        print(f"Error [save_session]: {e}")
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
        print(f"Error [get_session]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def require_session(session_id: str = None, account_id: str = None):
    session = get_session(session_id, account_id)
    if session is None:
        raise HTTPException(status_code=404, detail="Phiên làm việc không hợp lệ")
    return session

def delete_session(account_id: str):
    conn, cursor = connect()
    try:
        query = "DELETE FROM sessions WHERE account_id = %s"
        cursor.execute(query, (account_id,))
        conn.commit()
    except Exception as e:
        print(f"Error [delete_session]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def update_session_exp(session_id: str, access_exp: datetime):
    conn, cursor = connect(dict=True)
    try:
        query = "UPDATE sessions SET access_exp = %s WHERE session_id = %s"
        cursor.execute(query, (access_exp, session_id))
        conn.commit()
    except Exception as e:
        print(f"Error [update_session_exp]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)