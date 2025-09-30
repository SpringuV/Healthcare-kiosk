from datetime import datetime, timedelta, timezone
from fastapi import HTTPException, Depends
from jose import jwt, JWTError, ExpiredSignatureError

from ..crud.account_crud import require_account
from ..crud.session_crud import update_session_exp, require_session, get_session, save_session
from ..utils.randomString import create_random_str
from ..config import (oAuthBearer, SECRET_KEY, ALGORITHM,
                      ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES, 
                      ADMIN_REFRESH_TOKEN_EXPIRE_MINUTES, 
                      CASHIER_ACCESS_TOKEN_EXPIRE_MINUTES, 
                      CASHIER_REFRESH_TOKEN_EXPIRE_MINUTES
                      )

def createToken(account_id: str, time: int, typeAccess: str, session_id: str = None):
    expire = datetime.now(timezone.utc) + timedelta(minutes=time)
    payload = {"sub": str(account_id), "aud": f"{typeAccess}_SERVICES", "exp": expire}
    if session_id:
        payload["sid"] = session_id
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token, expire

def createAccessAndRefreshToken(account_id: str, typeAccess: str):
    while True:
        session_id = create_random_str(36)
        if get_session(session_id=session_id) is None:
            break
    if typeAccess == "ADMIN":
        access_time = ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES
        refresh_time = ADMIN_REFRESH_TOKEN_EXPIRE_MINUTES
    if typeAccess == "CASHIER":
        access_time = CASHIER_ACCESS_TOKEN_EXPIRE_MINUTES
        refresh_time = CASHIER_REFRESH_TOKEN_EXPIRE_MINUTES
    access_token, expire = createToken(account_id, access_time, typeAccess)
    refresh_token, _ = createToken(account_id, refresh_time, typeAccess, session_id)
    save_session(session_id, account_id, refresh_token, expire)
    return access_token, refresh_token

def refreshAccessToken(refresh_token: str, account_id: str):
    # lấy thông tin 
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        account_id_rt = payload.get("sub")
        session_id_rt = payload.get("sid")
    except ExpiredSignatureError:
        raise HTTPException(status_code=498, detail="Refresh token hết hạn")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    session = require_session(account_id=account_id)
    # kiểm tra thông tin refresh_token có đúng với tài khoản hiện tại và thông tin phiên làm việc được lưu 
    if session["account_id"] == account_id == account_id_rt and session["session_id"] == session_id_rt and session["refresh_token"] == refresh_token:
        account = require_account(account_id=session["account_id"])
        if account["username"] == "admin":
            time_access = ADMIN_ACCESS_TOKEN_EXPIRE_MINUTES
            typeAccess = "ADMIN"
        else:
            time_access = CASHIER_ACCESS_TOKEN_EXPIRE_MINUTES
            typeAccess = "CASHIER"
        access_token, expire = createToken(account_id, time_access, typeAccess)
        update_session_exp(session["session_id"], expire)
        return access_token
    else:
        raise HTTPException(status_code=404, detail="Refresh_token không hợp lệ")

def verifyToken(token: str = Depends(oAuthBearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], options={"verify_aud": False})
        aud = payload.get("aud")
        # kiểm tra service
        if aud not in ("ADMIN_SERVICES", "CASHIER_SERVICES"):
            raise JWTError("Invalid audience")
        # kiểm tra tính hợp lệ của tài khoản
        account_id = payload.get("sub")
        account = require_account(account_id=account_id)
        # kiểm tra còn phiên hoạt động ko
        session = require_session(account_id=account_id)
        if account['state'] == 0:
            raise HTTPException(status_code=497, detail="Tài khoản bị khóa")
        return account_id
    except ExpiredSignatureError:
        raise HTTPException(status_code=499, detail="Hết phiên làm việc")
    except JWTError as e:
        print("JWT decode error:", str(e))
        raise HTTPException(status_code=401, detail="Token không hợp lệ")
    
def verifyTokenAdmin(token: str = Depends(oAuthBearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="ADMIN_SERVICES")
        # kiểm tra tính hợp lệ của tài khoản
        account_id = payload.get("sub")
        account = require_account(account_id=account_id)
        # kiểm tra còn phiên hoạt động ko
        session = require_session(account_id=account_id)
        if account['state'] == 0:
            raise HTTPException(status_code=497, detail="Tài khoản bị khóa")
        return account_id
    except ExpiredSignatureError:
        raise HTTPException(status_code=499, detail="Hết phiên làm việc")
    except JWTError as e:
        print("JWT decode error:", str(e))
        raise HTTPException(status_code=401, detail="Token không hợp lệ")

def verifyTokenCashier(token: str = Depends(oAuthBearer)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM], audience="ADMIN_SERVICES")
        # kiểm tra tính hợp lệ của tài khoản
        account_id = payload.get("sub")
        account = require_account(account_id=account_id)
        # kiểm tra còn phiên hoạt động ko
        session = require_session(account_id=account_id)
        if account['state'] == 0:
            raise HTTPException(status_code=497, detail="Tài khoản bị khóa")
        return account_id
    except ExpiredSignatureError:
        raise HTTPException(status_code=499, detail="Hết phiên làm việc")
    except JWTError as e:
        print("JWT decode error:", str(e))
        raise HTTPException(status_code=401, detail="Token không hợp lệ")