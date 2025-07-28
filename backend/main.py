from fastapi import FastAPI, Form
from pydantic import BaseModel
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from actionDB import isInsurrance, isHasPatientInfo, updatePatientInsurranceState, getInsurrance, savePatientInfo, getPatient, getServices, createOrder, getOrder, updatePatientInfo
from qrMaker import makeQRCode
from pdfMaker import makePDF

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # địa trỉ cho phép truy cập api, http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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

class OrderInfo(BaseModel):
    service_name:str

# Kiểm tra thông tin bệnh nhân (truyền vào CCCD), hàm này cũng sẽ lưu session citizen_id vào cookie để dùng cho các hàm sau
# VD link: /checkCitizenID?citizen_id=000000000001
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
            "is_activate": isActivate
        }
        

# Tạo bảng ghi thông tin bệnh nhân
@app.post("/patient/non-insurrance")
def makePatientInfo(patient:PatientInfo):
    # chút điều trỉnh ở đây
    if not savePatientInfo(patient.citizen_id, patient.full_name, patient.gender, patient.dob, patient.address, patient.phone_number, patient.ethnic, patient.job, False):
        return JSONResponse(
            status_code=400,
            content={}
        )
    else:
        return JSONResponse(
            status_code=201,
            content={}
        )
    
# Cập nhật thông tin bệnh nhân
@app.put("/patient/insurrance-info/{citizen_id}")
def updatePatient(citizenid:str, info:PatientInfoUpdate):
    if not updatePatientInfo(info.citizen_id, info.address, info.ethnic, info.job):
        return JSONResponse(
            status_code=400,
            content={}
        )
    else:
        return JSONResponse(
            status_code=201,
            content={}
        )

# Lấy danh sách dịch vụ (ko cần tham số)
@app.get("/api/services")
def getServicesList():
    services = []
    listService = getServices()
    for service in listService:
        services.append({
            "service_name": service[0],
            "service_description": service[1]
        })
    return {"services": services}
# {
#     "services": [
#         {
#             "service_name": "Đo huyết áp",
#             "service_description": "Kiểm tra huyết áp"
#         },
#         {
#             "service_name": "Khám cảm cúm nhi",
#             "service_description": "Kiểm tra cảm cúm cho trẻ dưới 4 tuổi"
#         },
#         {
#             "service_name": "Khám da mẩn đỏ",
#             "service_description": "Kiểm tra, cung cấp phương thức trị da mẩn đỏ"
#         },
#         {
#             "service_name": "Khám mắt",
#             "service_description": "Kiểm tra, đo độ mắt"
#         },
#         {
#             "service_name": "Khám mắt, mũi, miệng nhi",
#             "service_description": "Kiểm tra mắt, mũi, miệng cho trẻ dưới 4 tuổi"
#         },
#         {
#             "service_name": "Khám trị mụn",
#             "service_description": "Kiểm tra, cung cấp phương thức trị mụn"
#         }
#     ]
# }

# Tạo phiếu khám 
# VD link: /makeOrder?service_name=Khám cảm cúm nhi&citizen_id=000000000001
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
        # order = [o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname]
        order = getOrder(order_id)
        return {
            "citizen_id": order[0],
            "fullname": order[1],
            "gender": "Nam" if order[2] == 1 else "Nữ",
            "dob": order[3],
            "service_name": order[9],
            "clinic_name": order[10],
            "address_room": order[11],
            "doctor_name": order[12],
            "queue_number": order[4],
            "is_insurrance": "Có" if order[7] == 1 else "Không",
            "time_order": order[5],
            "price": order[6],
            "order_id": order_id,
            "QRCode": makeQRCode(f"http://192.168.1.4:8000/downloadPDF/{order_id}")
        }
# {
#     "citizen_id": "000000000001",
#     "fullname": "Nguyễn Ngô An",
#     "gender": "Nam",
#     "dob": "2002-11-22",
#     "service_name": "Khám cảm cúm nhi",
#     "clinic_name": "Phòng khám nhi",
#     "address_room": "phòng 001, tầng 1, tòa nhà A",
#     "doctor_name": "Trịnh Bảo Anh",
#     "queue_number": 3,
#     "is_insurrance": "Có",
#     "time_order": "2025-07-24T16:02:26",
#     "price": 5.35,
#     "order_id": 5,
#     "QRCode": "iVBORw0KGgoAAAANSUhEUgAAASIAAAEiAQAAAAB1xeIbAAABkElEQVR4nO1aQWrEMAyUnECPCfQB+xTnB31S6c/ip/QBC8mxkKAiKQrbpdBenMSJ5rAbZwcsJHs8MosEfyOFf5AAnGVwlsFZBmcZnLU3CxfUPJgRu9HedLvGdQlWJMbA56oWoJIXVEb0hbPGdY03RNTrXqj3j+tSrPiJuO2Mv+KyLOy2nvGSrHr5bljaRwBcn6iA6MMZWElMTSuaU/O6n9Xm7B3XBdY9rWNKt4mHVET0oWgWqJWMNAH1UFnKm0l/UPRHjT6cgjW+EL5zAdjki8dUHfLeKrvmpNsXUsJqUoUX0Qew4WGjDyfIPUIjH9zYNgOnndHc/azNr/ckUh+HRe9Fc4hEglzvc+d+hRTgoRRy0eO5z+lzFkjaWe9lB6xmx3Ofs6+NkvLxFTBKIbSvnXPMGJz17DFR/SR9YA3a4fI2cI+5IQvF5Pcwo9Rjgxmvy6qfxpTQLhTSG5nbPGr04VT3mBCHlkV//nHRc9Towxlyn3SBV9rNQmrvcgZ47nOy0P8btcBZBmcZnGVwlqFs1jd8Zbmp6iToMgAAAABJRU5ErkJggg=="
# }

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
