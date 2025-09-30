from fastapi import HTTPException
from fastapi.responses import JSONResponse
from datetime import datetime, timezone
from ..utils.randomString import create_random_str

from ..crud.account_crud import get_account, require_account, update_password, lock_account, create_account, get_cashiers, delete_account
from ..crud.session_crud import get_session, delete_session
from ..services.token import createAccessAndRefreshToken
from ..config import cryptContext, DEFAULT_PASSWORD, SECURE, SAMESITE, ADMIN_REFRESH_TOKEN_EXPIRE_MINUTES, CASHIER_REFRESH_TOKEN_EXPIRE_MINUTES
from ..utils.randomString import create_random_str

def requireAccount(account_id: str = None, username: str = None):
    return require_account(account_id, username)

def lockOrUnlockAccount(account_id: str, action: str):
    if action == "lock":
        state = False
        respone = "Khóa tài khoản thành công"
    elif action == "unlock":
        state = True
        respone = "Mở khóa tài khoản thành công"
    else:
        raise HTTPException(status_code=401, detail="Tham số không chính xác")
    lock_account(account_id, state)
    return respone

def createAdminIfNone():
    account = get_account(username="admin")
    if account is None:
        while True:
            account_id = create_random_str(k=10)
            if get_account(account_id=account_id) is None:
                break
        salt = create_random_str(k=10)
        hash_pass = cryptContext.hash(salt+DEFAULT_PASSWORD)
        create_account(account_id, "admin", "admin", "admin", salt, hash_pass)
        print("INFO: Đã tạo tài khoản Admin")
    else:
        print("INFO: Đã tồn tại tài khoản Admin")

def createAccount(realname: str, username: str, citizen_id: str):
    while True:
        account_id = create_random_str(k=10)
        if get_account(account_id=account_id) is None:
            break
    salt = create_random_str(k=10)
    hash_pass = cryptContext.hash(salt+DEFAULT_PASSWORD)
    create_account(account_id, realname, username, citizen_id, salt, hash_pass)

def deleteAccount(account_id: str):
    account = require_account(account_id=account_id)
    if account["username"] == 'admin':
        raise HTTPException(status_code=400, detail="Không được xóa tài khoản này")
    delete_account(account_id=account_id)

def changePassword(account_id: str, old_password: str, new_password: str):
    account = require_account(account_id=account_id)
    if not cryptContext.verify(account.salt + old_password, account.hash_pass):
        raise HTTPException(status_code=400, detail="Mật khẩu cũ ko chính xác")
    new_salt = create_random_str(k=10)
    new_hash_pass = cryptContext.hash(new_salt + new_password)
    update_password(account_id, new_salt, new_hash_pass)

def getListCashiers(skip: int):
    cashiers = get_cashiers(skip=skip)
    data = [{"account_id": c['account_id'], 
            "realname": c['realname'], 
            "citizen_id": c['citizen_id'],
            "username": c['username'], 
            "state": bool(c['state'])} for c in cashiers]
    return data

def loginAccount(username: str, password: str):
    account = require_account(username=username)
    # Kiểm tra tài khoản
    if account["state"] == 0:
        raise HTTPException(status_code=497, detail="Tài khoản đã bị khóa")
    # Kiểm tra phiên làm việc
    session = get_session(account_id=account["account_id"])
    if session is not None:
        if session["access_exp"].replace(tzinfo=timezone.utc) > datetime.now(timezone.utc):
            raise HTTPException(status_code=403, detail="Tài khoản đang được truy cập")
    # Kiểm tra mật khẩu
    if not cryptContext.verify(account["salt"] + password, account["hash_pass"]):
        raise HTTPException(status_code=400, detail="Sai mật khẩu")
    # Kiểm tra thành công, bắt đầu tạo phiên làm việc mới
    delete_session(account_id=account["account_id"])
    typeAccess, time_refresh = ("ADMIN", ADMIN_REFRESH_TOKEN_EXPIRE_MINUTES) if account["username"] == "admin" else ("CASHIER", CASHIER_REFRESH_TOKEN_EXPIRE_MINUTES)
    # tạo access_token, refresh_token
    access_token, refresh_token = createAccessAndRefreshToken(account_id=account["account_id"], typeAccess=typeAccess)
    # lưu refresh_token vào cookie của respone
    response = JSONResponse(content={"access_token": access_token, "token_type": "bearer"})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=SECURE,
        samesite=SAMESITE,
        max_age=time_refresh*60
    )
    return response