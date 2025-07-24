from fastapi import FastAPI, Response, Request, Form
from fastapi.responses import StreamingResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from itsdangerous import URLSafeSerializer
from actionDB import isInsurrance, isHasPatientInfo, updatePatientInsurranceState, getInsurrance, savePatientInfo, getPatient, getServices, createOrder, getOrder
from qrMaker import makeQRCode
from pdfMaker import makePDF
import io

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # địa trỉ cho phép truy cập api, http://localhost:5173"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Kiểm tra thông tin bệnh nhân (truyền vào CCCD), hàm này cũng sẽ lưu session citizen_id vào cookie để dùng cho các hàm sau
# VD link: /checkCitizenID?citizen_id=000000000001
@app.get("/checkCitizenID")
def checkCitizenID(response: Response, citizen_id):
    isActivate, state, insurrance = isInsurrance(citizen_id)
    print(isActivate)
    isHad, _ = isHasPatientInfo(citizen_id)
    insurranceInfo = dict()
    patientInfo = dict()
    if insurrance is not None:
        insurranceInfo = {
            "state": state,
            "registration_place": insurrance[6],
            "valid_from": insurrance[7],
            "expired": insurrance[8],
        }
    if isHad:
        updatePatientInsurranceState(citizen_id, isActivate)
        patient = getPatient(citizen_id)
        patientInfo = {
            "citizen_id": patient[0],
            "fullname": patient[1],
            "gender": "Nam" if patient[2] == 1 else "Nữ",
            "dob": patient[3],
            "address": patient[4],
            "phone_number": patient[5],
            "ethnic": patient[6],
            "job": patient[7],
            "is_insurrance": "Có" if patient[9] == 1 else "Không"
        }
        updatePatientInsurranceState(citizen_id, isActivate)
    else:
        if isActivate:
            info = getInsurrance(citizen_id)
            if info is not None:
                # tạo thông tin bệnh nhân mới qua thông tin từ bảo hiểm y tế
                savePatientInfo(*info[:6], None, None, True)
                isHad = True
                patientInfo = {
                    "citizen_id": info[0],
                    "fullname": info[1],
                    "gender": "Nam" if info[2] == 1 else "Nữ",
                    "dob": info[3],
                    "address": info[4],
                    "phone_number": info[5],
                    "ethnic": "",
                    "job": "",
                    "is_insurrance": "Có"
                }
    return {"isPatientInfo":isHad, "patient":patientInfo, "insurrance":insurranceInfo}
# {
#     "isPatientInfo": true,
#     "patient": {
#         "citizen_id": "000000000001",
#         "fullname": "Nguyễn Ngô An",
#         "gender": "Nam",
#         "dob": "2002-11-22",
#         "address": "Tây Tựu, Nam Từ Liêm, Hà Nội",
#         "phone_number": "0333788190",
#         "ethnic": null,
#         "job": null,
#         "is_insurrance": "Có"
#     },
#     "insurrance": {
#         "state": "Bảo hiểm hợp lệ",
#         "registration_place": "BV Bạch Mai",
#         "valid_from": "2023-07-01",
#         "expired": "2028-07-01"
#     }
# }

# Tạo bảng ghi thông tin bệnh nhân (truyền vào 1 form)
@app.post("/makePatientInfo")
def makePatientInfo(citizen_id:str=Form(...), fullname:str=Form(...), gender:bool=Form(...), dob:str=Form(...), address:str=Form(...), phone_number:str=Form(...), ethnic:str=Form(...), job:str=Form(...)):
    # chút điều trỉnh ở đây
    if not savePatientInfo(citizen_id, fullname, gender, dob, address, phone_number, ethnic, job, False):
        return {"result": False}
    else:
        return {"result": True}

# Lấy danh sách dịch vụ (ko cần tham số)
@app.get("/services")
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
@app.post("/makeOrder")
def makeOrder(service_name:str, citizen_id:str):
    order_id = createOrder(citizen_id, service_name)
    if order_id is None:
        return {"error": "Tạo phiếu khám thất bại"}
    else:
        # Thông tin order
        # order = [o.citizen_id, p.fullname, p.gender, p.dob, o.queue_number, o.create_at, o.price, p.is_insurrance, o.clinic_service_id, s.service_name, c.clinic_name, c.address_room, st.fullname]
        order = getOrder(order_id)
        # tạo QR 
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
            "QRCode": makeQRCode(f"http://localhost:8000/showPDF?order_id={order_id}")
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
@app.get("/showPDF")
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
@app.get("/downloadPDF")
def downloadPDF(order_id:str):
    order = getOrder(order_id)
    if order is not None:
        pdf_buffer = makePDF(order)
        return StreamingResponse(
            content=pdf_buffer,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=phieu-kham-benh.pdf"}
        )
