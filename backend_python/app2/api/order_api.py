from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from ..services.order import getServiceList, handerMakeOrder, getFullInfoOrder, handerMakePDF, handerMakeQR
from ..services.token import verify_token
from ..schemas.schemas import OrderInfo
from ..config import oAuthBearer

router = APIRouter(prefix="/order", tags=["order"])


# Lấy danh sách dịch vụ
# @app.get("/api/services")
@router.get("/services")
def getServices():
    return JSONResponse(status_code=200, content={"clinics": getServiceList()})

# Tạo phiếu khám
# @app.post("/orders/create/{citizen_id}")
# def makeOrder(citizen_id: str, orderInfo: OrderInfo, token: str = Depends(oAuthBearer)):
@router.post("/create/{citizen_id}")
def makeOrder(citizen_id: str, info: OrderInfo, token: str = Depends(oAuthBearer)):
    verify_token(token, citizen_id)
    new_order_id = handerMakeOrder(info, citizen_id)
    return JSONResponse(status_code=200, content=getFullInfoOrder(new_order_id))

# @app.get("/showQR/{order_id}")
# def show_qr(order_id: str):
@router.get("/showQR/{order_id}")
def show_qr(order_id: str):
    return JSONResponse(status_code=200, content={"order_id": order_id, "QRCode": handerMakeQR(order_id)})

# @app.get("/showPDF/{order_id}")
# def showPDF(order_id: str):
@router.get("/showPDF/{order_id}")
def showPDF(order_id: str):
    return StreamingResponse(
        content=handerMakePDF(order_id),
        media_type="application/pdf",
        headers={"Content-Disposition": 'inline; filename="phieu-kham-benh.pdf"'},
    )

# @app.get("/downloadPDF/{order_id}")
# def downloadPDF(order_id: str):
@router.get("/downloadPDF/{order_id}")
def downloadPDF(order_id: str):
    return StreamingResponse(
        content=handerMakePDF(order_id),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=phieu-kham-benh.pdf"},
    )