import os
import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv

# Load biến môi trường từ file .env (nếu bạn chạy local)
load_dotenv()

def connect():
    config = {
        'user': os.getenv("DB_USER"),
        'password': os.getenv("DB_PASSWORD"),
        'host': os.getenv("DB_HOST"),
        'port': int(os.getenv("DB_PORT", "3306")),  # default 3306
        'database': os.getenv("DB_NAME")
    }

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        print("Connected to Railway MySQL successfully!")
        return conn, cursor
    except mysql.connector.Error as err:
        print("Error connecting to database:", err)
        return None, None

def disconnect(conn, cursor):
    if cursor:
        cursor.close()
    if conn:
        conn.close()

def main():
    conn, cursor = connect()
    if conn and cursor:
        print("Connection object:", conn)
        print("Cursor object:", cursor)
        disconnect(conn, cursor)

if __name__ == "__main__":
    main()
