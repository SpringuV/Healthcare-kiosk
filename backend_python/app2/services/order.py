from fastapi.exceptions import HTTPException
from ..crud.order_crud import get_order_services, create_order, get_latest_queue_number, get_clinic_service_id, get_price, get_order_full_info
from ..services.heath_insurance import checkInsurance
from ..schemas.schemas import OrderInfo
from ..utils.qrMaker import makeQRCode
from ..utils.pdfMaker import makePDF
from ..config import LINK

def getServiceList():
    clinics = []
    listService = get_order_services()
    clinic_name = sorted(set([clinic["clinic_name"] for clinic in listService]))
    for name in clinic_name:
        services = []
        for service in listService:
            if service["clinic_name"] == name:
                services.append({
                    "service_name": service["service_name"],
                    "service_description": service["service_description"],
                    "price": float(service["price"])})
        clinics.append(
            {
                "clinic_name": name,
                "clinic_services": services
            }
        )
    return clinics

def getNewQueueNumber(clinic_service_id):
    latest = get_latest_queue_number(clinic_service_id)
    if latest is None:
        return 1
    else:
        latest_queue = latest["queue_number"]
        if latest_queue == 999:
            return 1
        else:
            return latest_queue + 1

def handerMakeOrder(info: OrderInfo, citizen_id: str):
    clinic_service_id = get_clinic_service_id(info.service_name)
    new_queue = getNewQueueNumber(clinic_service_id)
    price, price_insur = get_price(citizen_id, clinic_service_id, info.service_name, info.type)
    if info.type == "insurance":
        _, _, activate = checkInsurance(citizen_id)
        if not activate:
            raise HTTPException(status_code=400, detail="Không thể dùng bảo hiểm")
        order_id = create_order(citizen_id, clinic_service_id, str(new_queue), "INSURANCE", "PAID", price_insur)
    elif info.type == "non-insurance":
        order_id = create_order(citizen_id, clinic_service_id, str(new_queue), "CASH", "UNPAID", price)
    return order_id

def getFullInfoOrder(order_id: str):
    order = get_order_full_info(order_id)
    return {
        "citizen_id": order["citizen_id"],
        "fullname": order["fullname"],
        "gender": "Nam" if order["gender"] == 1 else "Nữ",
        "dob": order["dob"].isoformat(),
        "queue_number": order["queue_number"],
        "time_order": order["create_at"].isoformat(),
        "is_insurance": bool(order["insurance_id"]),
        "use_insurance": order["use_insurance"],
        "service_name": order["service_name"],
        "clinic_name": order["clinic_name"],
        "address_room": order["address_room"],
        "doctor_name": order["doctor_name"],
        "price": float(order["price"]),
        "order_id": order_id
    }

def handerMakeQR(order_id: str):
    link = LINK+f"/order/downloadPDF/{order_id}"
    qr_code_base64 = makeQRCode(link)
    return qr_code_base64

def handerMakePDF(order_id: str):
    order = get_order_full_info(order_id)
    pdf_buffer = makePDF(order)
    return pdf_buffer