from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app1.services.token import (
    verifyTokenCashier
)
from app1.services.order import (
    payCashOrder
)

router = APIRouter(prefix="/user/cashie", tags=["cashier"])

# set thanh toán tiền mặt
@router.get("/payCash/{order_id}")
def payCash(order_id: str, id: str = Depends(verifyTokenCashier)):
    payCashOrder(order_id)
    return JSONResponse(status_code=200, content={"detail": "Thanh toán thành công"})