from fastapi import WebSocket, WebSocketDisconnect, Request
from fastapi.exceptions import HTTPException
import asyncio
from ..crud.payment_crud import set_payment_method, get_transfer_state, update_transfer_state_to_banking
from ..config import SEPAY_API_KEY
from ..crud.order_crud import require_order
from ..utils.round import round_like_js

async def handerPaymentCheking(websocket: WebSocket):
    # Chấp nhận kết nối
    await websocket.accept()
    # Nhận data gửi đến
    data = await websocket.receive_json()
    order_id = data["order_id"]
    set_payment_method(order_id, "BANKING")
    while True:
        try:
            # Kiểm tra database
            state = get_transfer_state(order_id)
            if state == "PAID":
                result = True
                detail = "Đã thanh toán"
            else:
                result = False
                detail = "Chưa thanh toán"
            # Gửi lại nội dung cho frontend
            await websocket.send_json({"result": result, "detail": detail})
            if state == "PAID":
                break
            await asyncio.sleep(5)
        except WebSocketDisconnect:
            break

async def handerWebhook(request: Request, authorization: str):
    # Kiểm tra key
    auth = f"Apikey {SEPAY_API_KEY}"
    if authorization != auth:
        raise HTTPException(status_code=401, detail="Unauthorized")
    # Lấy thông tin trong gói tin
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    code = payload.get("code", "")
    money = payload.get("transferAmount", 0)
    # lấy order_id
    order_id = code.replace("ORDER", "")
    # kiểm tra order tồn tại ko
    order = require_order(order_id=order_id)
    if round_like_js(order["price"] * 26181) == int(money):
        update_transfer_state_to_banking(order_id=order_id)
        raise HTTPException(status_code=200, detail="Success")
    else:
        raise HTTPException(status_code=400, detail="Incorrect money transfer")