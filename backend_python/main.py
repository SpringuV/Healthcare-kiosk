from fastapi import FastAPI, Request, Header, HTTPException, WebSocket, WebSocketDisconnect
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from actionDB import isInsurrance, isHasPatientInfo, updatePatientInsurranceState, savePatientInfo, getServices, getPatient, createOrder, getOrder, updatePatientInfo, getTransferState, getOrderInfo, updateTransferState

from qrMaker import makeQRCode
from pdfMaker import makePDF, round_like_js

import asyncio

app = FastAPI()

IP = "127.0.0.1"
PORT = "8000"

SEPAY_API_KEY = "d99cff6fc8a2f1fbc39e1c8f4f9eb28d692c40900bbb3486b426a13da37b79a0"

origins = [
    "https://healthcare-kiosk.vercel.app",
    "http://localhost:5173",  # để test local
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],  # Cho tất cả method
    allow_headers=["*"],  # Cho tất cả header
)

class PatientInfo(BaseModel):
    patient_id:str
    full_name:str
    dob:str
    gender:bool
    phone_number:str
    address:str
    ethnic:str
    job:str

class PatientInfoUpdate(BaseModel):
    address:str
    ethnic:str
    job:str
    is_insurrance:bool

class OrderInfo(BaseModel):
    service_name:str

# Kiểm tra thông tin bệnh nhân (truyền vào CCCD)
@app.get("/health-insurrances/{citizen_id}", status_code=200)
def checkInsurrance(citizen_id:str):
    isActivate, state, insurrance = isInsurrance(citizen_id)
    isHad, _ = isHasPatientInfo(citizen_id)
    if insurrance is None:
        return JSONResponse(
            status_code=404,
            content={}
        )
    else:
        if isHad:
            updatePatientInsurranceState(citizen_id, isActivate)
        else:
            savePatientInfo(*insurrance[:4], None, insurrance[5], None, None, isActivate)
        return {
            "citizen_id": insurrance[0],
            "full_name": insurrance[1],
            "dob": insurrance[3],
            "valid_from": insurrance[6],
            "expired": insurrance[7],
            "registration_place": insurrance[5],
            "phone_number": insurrance[4],
            "gender": "Nam" if insurrance[2] == 1 else "Nữ",
            "is_activate": isActivate,
            "is_saved": isHad
        }
        

# Tạo bảng ghi thông tin bệnh nhân
@app.post("/patient/non-insurrance")
def makePatientInfo(patient:PatientInfo):
    result, reason = savePatientInfo(patient.patient_id, patient.full_name, patient.gender, patient.dob, patient.address, patient.phone_number, patient.ethnic, patient.job, False)
    if not result:
        return JSONResponse(
            status_code=400,
            content={"reason": reason}
        )
    else:
        return JSONResponse(
            status_code=201,
            content={}
        )
    
# Cập nhật thông tin bệnh nhân
@app.put("/patient/insurrance-info/{citizen_id}")
def updatePatient(citizen_id:str, info:PatientInfoUpdate):
    if not updatePatientInfo(citizen_id, info.address, info.ethnic, info.job, info.is_insurrance):
        return JSONResponse(
            status_code=400,
            content={}
        )
    else:
        return JSONResponse(
            status_code=201,
            content={}
        )
    
# Kiểm tra thông tin bệnh nhân
@app.get("/patient/check/{citizen_id}")
def checkPatient(citizen_id: str):
    patient = getPatient(citizen_id)
    if patient is None:
        return JSONResponse(
            status_code=404,
            content={"message": "Không tìm thấy thông tin bệnh nhân"}
        )
    
    return JSONResponse(
        status_code=200,
        content={
            "patient_id": patient[0],
            "full_name": patient[1],
            "gender": "Nam" if patient[2] else "Nữ",
            "dob": str(patient[3]),
            "address": patient[4],
            "phone_number": patient[5],
            "ethnic": patient[6],
            "job": patient[7]
        }
    )

# Lấy danh sách dịch vụ (ko cần tham số)
@app.get("/api/services")
def getServicesList():
    services = []
    listService = getServices()
    for service in listService:
        services.append({
            "service_name": service[0],
            "service_description": service[1],
            "price": float(service[2]),
        })
    return JSONResponse(
        status_code=200,
        content={"services": services}
    )

# Tạo phiếu khám
@app.post("/orders/create/{citizen_id}", status_code=200)
def makeOrder(citizen_id:str, orderInfo:OrderInfo):
    order_id = createOrder(citizen_id, orderInfo.service_name)
    if order_id is None:
        return JSONResponse(
            status_code=400,
            content={}
        )
    else:
        # Thông tin order
        # order = [o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, p.is_insurrance, o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname, price, price_insur]
        order = getOrder(order_id)
        return {
            "citizen_id": order[0],
            "fullname": order[1],
            "gender": "Nam" if order[2] == 1 else "Nữ",
            "dob": order[3],
            "queue_number": order[4],
            "time_order": order[5],
            "is_insurrance": True if order[6] == 1 else False,
            "service_name": order[8],
            "clinic_name": order[9],
            "address_room": order[10],
            "doctor_name": order[11],
            "price": order[12],
            "price_insur": order[13],
            "order_id": order_id,
            # "QRCode": makeQRCode(f"http://{IP}:{PORT}/downloadPDF/{order_id}")
            "QRCode": makeQRCode(f"https://healthcare-kiosk.onrender.com/downloadPDF/{order_id}")
        }

# Hiện thị file pdf phiếu khám bệnh (ko phải tải về)
@app.get("/showPDF/{order_id}")
def showPDF(order_id:str):
    order = getOrder(order_id)
    if order is not None:
        pdf_buffer = makePDF(order)
        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": 'inline; filename="phieu-kham-benh.pdf"'}
        )

# Tự download file pdf phiếu khám bệnh cho client
@app.get("/downloadPDF/{order_id}")
def downloadPDF(order_id:str):
    order = getOrder(order_id)
    if order is not None:
        pdf_buffer = makePDF(order)
        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=phieu-kham-benh.pdf"}
        )

# websocket kiểm tra 
@app.websocket("/ws/checkTransfer")
async def checkBankTransfer(websocket:WebSocket):
    await websocket.accept()
    data = await websocket.receive_json()
    order_id = data["order_id"]
    while True:
        try:
            state, detail = getTransferState(order_id)
            await websocket.send_json({"result": state, "detail": detail})
            if state and detail == "":
                break
            await asyncio.sleep(5)
        except WebSocketDisconnect:
            break


# Xử lý webhook thông báo chuyển tiền từ SePay
# https://healthcare-kiosk.onrender.com/api/payOrder
@app.post("/api/payOrder")
async def payOrder(request:Request, authorization: str = Header(None)):
    auth = f"Apikey {SEPAY_API_KEY}"
    if authorization != auth:
        raise HTTPException(status_code=401, detail="Unauthorized")
    
    try:
        payload = await request.json()
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid JSON")
    
    code = payload.get("code", "")
    money = payload.get("transferAmount", 0)
    order_id = code.replace("ORDER", "")

    order = getOrderInfo(order_id)
    if order is None:
        raise HTTPException(status_code=400, detail="Unknow order")
    if round_like_js(order[8] * 26181) == int(money):
        updateTransferState(order_id)
        raise HTTPException(status_code=200, detail="Success")
    else:
        raise HTTPException(status_code=400, detail="Incorrect money transfer")

# run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload