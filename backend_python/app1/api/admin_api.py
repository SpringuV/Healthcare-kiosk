from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app1.schemas.schemas import FormCreateAccount
from app1.services.token import (
    verifyTokenAdmin
)
from app1.services.order import (
    getDashboardInfos
)
from app1.services.account import (
    createAccount, getListCashiers, lockOrUnlockAccount, deleteAccount
)

router = APIRouter(prefix="/user/admin", tags=["user"])

# lấy nội dung dashboard
@router.get("/get_dashboard_info")
def getDashboardInfo(id: str = Depends(verifyTokenAdmin)):
    data = getDashboardInfos()
    return JSONResponse(status_code=200, content={"datas": data})

# tạo tài khoản thu ngân
@router.post("/create_cashier")
def createCashierAccount(data: FormCreateAccount, id: str = Depends(verifyTokenAdmin)):
    createAccount(data.realname, data.username, data.citizen_id)
    return JSONResponse(status_code=201, content={"detail": "Tạo tài khoản thành công"})

# lấy danh sách thu ngân
@router.get("/get_cashier_list/{skip}")
def getCashierList(skip: int, id: str = Depends(verifyTokenAdmin)):
    data = getListCashiers(skip)
    return JSONResponse(status_code=200, content={'cashiers': data})

# khóa tài khoản thu ngân
@router.put("/lock_account/{account_id}/{action}")
def setAccountState(account_id: str, action: str, id: str = Depends(verifyTokenAdmin)):
    respone = lockOrUnlockAccount(account_id, action)
    return JSONResponse(status_code=200, content={'detail': respone})

# xóa tài khoản thu ngân
@router.delete("/delete_account/{account_id}")
def deleteCashier(account_id: str, id: str = Depends(verifyTokenAdmin)):
    deleteAccount(account_id)
    return JSONResponse(status_code=200, content={'detail': "Xóa tài khoản thành công"})