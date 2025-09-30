from fastapi import APIRouter, Depends, Request, HTTPException, status
from fastapi.responses import JSONResponse
from app1.schemas.schemas import FormLogin, FormChangePassword
from app1.services.token import (
    verifyToken, refreshAccessToken
)
from app1.services.account import (
    loginAccount, changePassword
)
from app1.crud.session_crud import (
    delete_session
)
from app1.services.order import (
    getListOrders
)
router = APIRouter(prefix="/user", tags=["user"])

# đăng nhập
@router.post("/login")
def login(loginInfo: FormLogin):
    respone = loginAccount(loginInfo.username, loginInfo.password)
    return respone

# đăng xuất
@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
def logout(id: str = Depends(verifyToken)):
    # xóa phiên làm việc khiến cả 2 token ko còn có thể xác thực
    delete_session(account_id=id)
    return

# làm mới access_token
@router.post("/refresh_token")
def refresh(request: Request, id: str = Depends(verifyToken)):
    # lấy lại refresh_token từ cookies đã set
    refresh_token = request.cookies.get("refresh_token")
    if not refresh_token:
        raise HTTPException(status_code=401, detail="Không có refresh token")
    # tạo access_token mới
    access_token = refreshAccessToken(refresh_token=refresh_token, account_id=id)
    return JSONResponse(status_code=201, content={"access_token": access_token, "token_type": "bearer"})

# đổi mật khẩu
@router.put("/change_password")
def changePass(data: FormChangePassword, id: str = Depends(verifyToken)):
    changePassword(account_id=id, old_password=data.old_password, new_password=data.new_password)
    return JSONResponse(status_code=200, content={"detail": "Mật khẩu đã được đổi thành công"})

# lấy danh sách phiếu khám
@router.get("/get_order_list/{search}/{skip}")
def get_order_list(search: str, skip: int, id: str = Depends(verifyToken)):
    data = getListOrders(search=search, skip=skip)
    return JSONResponse(status_code=200, content={"orders": data})