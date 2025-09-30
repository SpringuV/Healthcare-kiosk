from ..database.database import connect, disconnect
from fastapi.exceptions import HTTPException

def set_payment_method(order_id: str, method: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method = %s WHERE order_id = %s"""
        cursor.execute(query, (method, order_id))
        conn.commit()
    except Exception as e:
        print(f"Error [set_payment_method]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def get_transfer_state(order_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT payment_status FROM orders WHERE order_id = %s LIMIT 1"""
        cursor.execute(query, (order_id,))
        state = cursor.fetchone()
        if state is None:
            raise HTTPException(status_code=404, detail="Không tìm thấy phiếu khám")
        return state["payment_status"]
    except Exception as e:
        print(f"Error [get_transfer_state]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)


def update_transfer_state_to_banking(order_id: str):
    conn, cursor = connect()
    try:
        query = """UPDATE orders SET payment_method = %s, payment_status = %s WHERE order_id = %s"""
        cursor.execute(query, ("BANKING", "PAID", order_id))
        conn.commit()
    except Exception as e:
        print(f"Error [update_transfer_state_to_banking]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)