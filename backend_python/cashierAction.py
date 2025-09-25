from connectDB import connect, disconnect
from fastapi import HTTPException

# set thanh toán tiền mặt cho bệnh nhận
def payCashOrder(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method, payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("CASH", "PAID", order_id))
        conn.commit()
    except Exception as e:
        print(f"Error cancelOrder: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)