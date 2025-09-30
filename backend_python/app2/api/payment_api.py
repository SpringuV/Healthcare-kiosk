from fastapi import APIRouter, WebSocket
from fastapi import Request, Header
from ..services.payment import handerPaymentCheking, handerWebhook

router = APIRouter(prefix="/payment", tags=["payment"])

# websocket kiểm tra
@router.websocket("/ws/check_transfer")
async def checkBankTransfer(websocket: WebSocket):
    await handerPaymentCheking(websocket=websocket)

# Xử lý webhook thông báo chuyển tiền từ SePay
# https://healthcare-kiosk.onrender.com/api/payment/webhook/pay_order
@router.post("/webhook/pay_order")
async def payOrder(request: Request, authorization: str = Header(None)):
    await handerWebhook(request, authorization)