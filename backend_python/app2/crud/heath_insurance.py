from ..database.database import connect, disconnect
from fastapi.exceptions import HTTPException

def get_insurance(citizen_id: str):
    conn, cursor = connect(dict=True)
    try:
        query = """SELECT * FROM heath_insurance WHERE citizen_id = %s LIMIT 1"""
        cursor.execute(query, (citizen_id,))
        insurance = cursor.fetchone()
        return insurance
    except Exception as e:
        print(f"Error [get_insurance]: {e}")
        raise HTTPException(status_code=500, detail="Lỗi không xác định")
    finally:
        disconnect(conn, cursor)

def require_insurance(citizen_id: str):
    insurance = get_insurance(citizen_id=citizen_id)
    if insurance is None:
        raise HTTPException(status_code=404, detail="Không có thông tin bảo hiểm")
    return insurance