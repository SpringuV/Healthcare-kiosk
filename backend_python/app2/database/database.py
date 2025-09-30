import mysql.connector
from fastapi.exceptions import HTTPException
from ..config import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

def connect(dict=False):
    config = {
        'user': DB_USER,
        'password': DB_PASSWORD,
        'host': DB_HOST,
        'port': DB_PORT,
        'database': DB_NAME
    }
    try:
        conn = mysql.connector.connect(**config)
        if dict:
            cursor = conn.cursor(dictionary=True)
        else:
            cursor = conn.cursor()
        return conn, cursor
    except mysql.connector.Error as err:
        print("Error connecting to database:", err)
        raise HTTPException(status_code=500, detail="Lỗi kết nối database")

def disconnect(conn, cursor):
    if cursor:
        cursor.close()
    if conn:
        conn.close()