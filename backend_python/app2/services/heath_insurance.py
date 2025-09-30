from datetime import datetime
from ..crud.heath_insurance import require_insurance
from ..crud.patient_crud import get_patient, update_insurance_id
from .token import create_token

def checkInsurance(citizen_id: str):
    insurance = require_insurance(citizen_id=citizen_id)
    now = datetime.now().date()
    if insurance["valid_from"] <= now <= insurance["expired"]:
        return insurance, "Bảo hiểm hợp lệ", True
    else:
        return insurance, "Hết thời hạn bảo hiểm", False

def getInsuranceInfo(citizen_id: str):
    # Kiểm tra bảo hiểm
    insurance, message, isActivate = checkInsurance(citizen_id)
    # Kiểm tra thông tin bệnh nhân
    patient = get_patient(citizen_id=citizen_id)
    # Nếu bệnh nhân đã có thông tin, cập nhật id bảo hiểm
    isHad = False
    if patient:
        isHad = True
        if isActivate:
            update_insurance_id(citizen_id=citizen_id, insurance_id=insurance["insurance_id"])
        else:
            update_insurance_id(citizen_id=citizen_id, insurance_id=None)
    return {
        "citizen_id": insurance["citizen_id"],
        "full_name": insurance["fullname"],
        "dob": insurance["dob"].isoformat(),
        "valid_from": insurance["valid_from"].isoformat(),
        "expired": insurance["expired"].isoformat(),
        "registration_place": insurance["registration_place"],
        "phone_number": insurance["phone_number"],
        "gender": "Nam" if insurance["gender"] == 1 else "Nữ",
        "is_activate": isActivate,
        "is_saved": isHad,
        "message": message,
        "token": create_token(insurance["citizen_id"])
    }