from ..config import ALGORITHM, SECRET_KEY, PATIENT_TOKEN_EXPIRE_MINUTES, cryptContext
from ..crud.patient_crud import require_patient
from datetime import datetime, timezone, timedelta
from fastapi.exceptions import HTTPException
from jose import jwt, ExpiredSignatureError, JWTError

def create_token(citizen_id: str):
    to_encode = {}
    hash_id = cryptContext.hash(citizen_id)
    to_encode.update({"sub": hash_id})
    expire = datetime.now(timezone.utc) + timedelta(minutes=PATIENT_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode

def verify_token(token, citizen_id):
    # Kiểm tra citizen_id có tồn tại ko
    _ = require_patient(citizen_id)
    try:
        code = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = code.get("sub")
        if cryptContext.verify(citizen_id, id):
            return
        raise HTTPException(status_code=401, detail="Token không chính xác")
    except ExpiredSignatureError:
        raise HTTPException(status_code=499, detail="Hết phiên làm việc")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token lỗi")