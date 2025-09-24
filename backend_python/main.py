from fastapi import (
    FastAPI,
    Request,
    Header,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    Depends,
)
from contextlib import asynccontextmanager
from pydantic import BaseModel
from decimal import Decimal
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from passlib.context import CryptContext
from jose import jwt, JWTError, ExpiredSignatureError
from datetime import timezone, timedelta, datetime
from random import choices
from patientAction import (
    cancelOrder,
    getPatientHistory,
    isInsurrance,
    isHasPatientInfo,
    updatePatientInsurranceState,
    savePatientInfo,
    getServices,
    getPatient,
    createOrder,
    getOrder,
    updatePatientInfo,
    getTransferState,
    getOrderInfo,
    updateTransferState,
    setPaymentMethod,
)
from adminAction import (
    createAccount,
    getAccount
)

from qrMaker import makeQRCode
from pdfMaker import makePDF, round_like_js

import asyncio

IP = "127.0.0.1"
PORT = "8000"

SECRET_KEY = "v8P2shAY3fDKWuz5qZt0mXNaHy1Lrj"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 5

SEPAY_API_KEY = "d99cff6fc8a2f1fbc39e1c8f4f9eb28d692c40900bbb3486b426a13da37b79a0"
SEPAY_API_KEY_2 = "ZFAOUF2TM0TDDCAICNFAVOKCUFPZ34ILKDSY5DBW6BMMYVY94R5UO3OPXWG8L1L2"

cryptContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
oAuthBearer = OAuth2PasswordBearer(tokenUrl="token")

default_password = "123@Abc"
space = "124567890qwertyuiopasdfghjklzxcvbnm"

def create_random_str(k: int):
    s = choices(space, k=k)
    s = ''.join(s)
    return s

def create_token_type_1(citizen_id):
    to_encode = {}
    hash_id = cryptContext.hash(citizen_id)
    to_encode.update({"sub": hash_id})
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encode = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode

def verify_token_type_1(token, citizen_id):
    try:
        code = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        id = code.get("sub")
        if cryptContext.verify(citizen_id, id):
            return True, ""
        return False, "Token ko chính xác"
    except ExpiredSignatureError:
        return False, "Token hết hạn"
    except JWTError:
        return False, "Token ko có quyền hạn"
    


@asynccontextmanager
async def lifespan(app: FastAPI):
    salt = create_random_str(k=10)
    hash_pass = cryptContext.hash(salt+default_password)
    result, detail = createAccount("", "", "admin", salt, hash_pass)
    if result:
        print("Đã tạo thành công tài khoản admin")
    else:
        print(detail)
    yield
    print("Shutdown")

app = FastAPI(lifespan=lifespan) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Cho tất cả method
    allow_headers=["*"],  # Cho tất cả header
)


class PatientInfo(BaseModel):
    patient_id: str
    full_name: str
    dob: str
    gender: bool
    phone_number: str
    address: str
    ethnic: str
    job: str
    is_insur: bool


class PatientInfoUpdate(BaseModel):
    address: str
    ethnic: str
    job: str


class OrderInfo(BaseModel):
    service_name: str
    type: str

class FormLoginData(BaseModel):
    username: str
    password: str

class FormCreateAccountData(BaseModel):
    realname: str
    username: str
    citizen_id: str

# Kiểm tra thông tin bệnh nhân (truyền vào CCCD)
@app.get("/health-insurances/{citizen_id}", status_code=200)  # Sửa đường dẫn
def check_insurance(citizen_id: str):
    try:
        is_activate, message, insurance = isInsurrance(citizen_id)  # Sửa tên function
        is_had, _ = isHasPatientInfo(citizen_id)  # Sửa tên function

        if insurance is None:
            return JSONResponse(
                status_code=404,
                content={"message": "Không tìm thấy thông tin bảo hiểm"},
            )

        # Nếu bệnh nhân đã có thông tin, cập nhật trạng thái bảo hiểm
        if is_had:
            updatePatientInsurranceState(citizen_id, is_activate)

        return {
            "citizen_id": insurance[0],
            "full_name": insurance[1],
            "dob": insurance[3].isoformat() if insurance[3] else None,  # Format date
            "valid_from": insurance[6].isoformat() if insurance[6] else None,
            "expired": insurance[7].isoformat() if insurance[7] else None,
            "registration_place": insurance[5],
            "phone_number": insurance[4],
            "gender": "Nam" if insurance[2] == 1 else "Nữ",
            "is_activate": is_activate,
            "is_saved": is_had,
            "message": message,
            "token": create_token_type_1(insurance[0])
        }
    except Exception as e:
        print(f"Error in check_insurance: {e}")
        return JSONResponse(status_code=500, content={"message": "Lỗi hệ thống"})


# Tạo bảng ghi thông tin bệnh nhân
@app.post("/patient/register")
def makePatientInfo(patient: PatientInfo):
    result, reason = savePatientInfo(
        patient.patient_id,
        patient.full_name,
        patient.gender,
        patient.dob,
        patient.address,
        patient.phone_number,
        patient.ethnic,
        patient.job,
        patient.is_insur,
    )
    if not result:
        return JSONResponse(status_code=400, content={"reason": reason})
    else:
        return JSONResponse(status_code=201, content={"token": create_token_type_1(patient.patient_id)})


# Cập nhật thông tin bệnh nhân
@app.put("/patient/insurrance-info/{citizen_id}")
def updatePatient(citizen_id: str, info: PatientInfoUpdate):
    if not updatePatientInfo(citizen_id, info.address, info.ethnic, info.job):
        return JSONResponse(status_code=400, content={})
    else:
        return JSONResponse(status_code=201, content={})


# Kiểm tra thông tin bệnh nhân
@app.get("/patient/check/{citizen_id}")
def checkPatient(citizen_id: str):
    patient = getPatient(citizen_id)
    if patient is None:
        return JSONResponse(
            status_code=404, content={"message": "Không tìm thấy thông tin bệnh nhân"}
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
            "job": patient[7],
            "token": create_token_type_1(patient[0])
        },
    )


# Lấy danh sách dịch vụ
@app.get("/api/services")
def getServicesList():
    clinics = []
    listService = getServices()
    clinic_name = sorted(set([clinic[0] for clinic in listService]))
    for name in clinic_name:
        services = []
        for service in listService:
            if service[0] == name:
                services.append({
                    "service_name": service[1],
                    "service_description": service[2],
                    "price": float(service[3])})
        clinics.append(
            {
                "clinic_name": name,
                "clinic_services": services
            }
        )
    return JSONResponse(status_code=200, content={"clinics": clinics})


# Tạo phiếu khám
@app.post("/orders/create/{citizen_id}")
def makeOrder(citizen_id: str, orderInfo: OrderInfo, token: str = Depends(oAuthBearer)):
    patient = getPatient(citizen_id)
    if patient is None:
        return JSONResponse(status_code=400, content={"detail": "Patient ko tồn tại"})
    
    access, detail = verify_token_type_1(token, citizen_id)
    if not access:
        return JSONResponse(status_code=401, content={"detail": detail})
    
    order_id = createOrder(citizen_id, orderInfo.service_name, orderInfo.type)
    if order_id is None:
        return JSONResponse(status_code=400, content={"detail": "Lỗi tạo order"})
    else:
        # Thông tin order
        # order = [ o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname, use_insurrance]
        order = getOrder(order_id)
        return JSONResponse(status_code=200, content={
            "citizen_id": order[0],
            "fullname": order[1],
            "gender": "Nam" if order[2] == 1 else "Nữ",
            "dob": order[3].isoformat() if order[3] else None,
            "queue_number": order[4],
            "time_order": order[5].isoformat() if order[5] else None,
            "is_insurrance": order[7],
            "use_insurrance": order[13],
            "service_name": order[9],
            "clinic_name": order[10],
            "address_room": order[11],
            "doctor_name": order[12],
            "price": float(order[6]),
            "order_id": order_id,
            "QRCode": makeQRCode(
                f"https://healthcare-kiosk.onrender.com/downloadPDF/{order_id}"
            ),
        })


@app.get("/showQR/{order_id}")
def show_qr(order_id: str):
    # Link tải PDF hoặc link tuỳ ý bạn muốn encode
    link = f"https://healthcare-kiosk.onrender.com/downloadPDF/{order_id}"

    qr_code_base64 = makeQRCode(link)

    return JSONResponse(
        content={"order_id": order_id, "QRCode": qr_code_base64}, status_code=200
    )


# Hiện thị file pdf phiếu khám bệnh (ko phải tải về)
@app.get("/showPDF/{order_id}")
def showPDF(order_id: str):
    order = getOrder(order_id)
    if order is not None:
        pdf_buffer = makePDF(order)
        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": 'inline; filename="phieu-kham-benh.pdf"'},
        )


# Tự download file pdf phiếu khám bệnh cho client
@app.get("/downloadPDF/{order_id}")
def downloadPDF(order_id: str):
    order = getOrder(order_id)
    if order is not None:
        pdf_buffer = makePDF(order)
        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=phieu-kham-benh.pdf"
            },
        )


# websocket kiểm tra
@app.websocket("/ws/checkTransfer")
async def checkBankTransfer(websocket: WebSocket):
    await websocket.accept()
    data = await websocket.receive_json()
    order_id = data["order_id"]
    setPaymentMethod(order_id, "BANKING")
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
async def payOrder(request: Request, authorization: str = Header(None)):
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


# Lấy lịch sử khám bệnh của 1 bệnh nhân
@app.get("/patient/history/{citizen_id}")
def getPatientHistoryAPI(citizen_id: str):
    history = getPatientHistory(citizen_id)
    if not history:
        return JSONResponse(
            status_code=404, content={"message": "Không tìm thấy lịch sử khám bệnh"}
        )

    # Lấy thông tin bệnh nhân từ bản ghi đầu tiên
    first = history[0]
    patient_info = {
        "citizen_id": first["citizen_id"],
        "fullname": first["fullname"],
        "gender": "Nam" if first["gender"] == 1 else "Nữ",
        "dob": first["dob"].isoformat() if first["dob"] else None,
        "address": first["address"],
        "phone_number": first["phone_number"],
        "ethnic": first["ethnic"],
        "job": first["job"],
        "is_insurance": bool(first["is_insurrance"]),
    }

    # Chỉ lấy phần lịch sử khám
    results = []
    for row in history:
        results.append(
            {
                "order_id": row["order_id"],
                "time_order": (
                    row["time_order"].isoformat()
                    if hasattr(row["time_order"], "isoformat")
                    else str(row["time_order"])
                ),
                "queue_number": row["queue_number"],
                "service_name": row["service_name"],
                "clinic_name": row["clinic_name"],
                "address_room": row["address_room"],
                "doctor_name": row["doctor_name"],
                "payment_status": row["payment_status"],
                "payment_method": row["payment_method"],
                "price": (
                    float(row["price"])
                    if isinstance(row["price"], Decimal)
                    else row["price"]
                ),
            }
        )

    return JSONResponse(
        status_code=200, content={"patient": patient_info, "history": results}
    )


@app.put("/orders/cancel/{order_id}")
def cancelOrderAPI(order_id: str):
    order = getOrderInfo(order_id)
    if order is None:
        return JSONResponse(
            status_code=404, content={"message": "Không tìm thấy đơn hàng"}
        )

    if order[7] == "PAID":  # cột payment_status
        return JSONResponse(
            status_code=400,
            content={"message": "Đơn hàng đã thanh toán, không thể hủy"},
        )
    if order[7] == "CANCELLED":
        return JSONResponse(
            status_code=400, content={"message": "Đơn hàng đã bị hủy trước đó"}
        )

    if cancelOrder(order_id):
        return JSONResponse(
            status_code=200,
            content={"message": f"Đơn {order_id} đã được hủy thành công"},
        )
    else:
        return JSONResponse(status_code=500, content={"message": "Lỗi khi hủy đơn"})

############################################################################################################################################################################
# admin quản lý
# đăng nhập
@app.get("/api/login")
def login(loginInfo: FormLoginData):
    account = getAccount(loginInfo.username)
    if account is None:
        raise HTTPException(status_code=404, detail="Tài khoản không tồn tại")
    if cryptContext.verify(account["salt"]+loginInfo.password, account["hash_pass"]):
        return JSONResponse(status_code=200, content={
            "token": "token"
        })
    else:
        raise HTTPException(status_code=401, detail="Sai mật khẩu")

# tạo tài khoản
@app.post("/api/account/create")
def createAccountUser():
    pass

@app.get("/test")
def test():
    print(getAccount("admin"))

# run: uvicorn main:app --host 0.0.0.0 --port 8000 --reload
