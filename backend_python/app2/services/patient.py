from ..crud.patient_crud import save_patient, require_patient, get_patient_history
from ..services.token import create_token

def savePatient(citizen_id: str, fullname: str, dob: str, gender: bool, phone_number: str, address: str, ethnic: str, job: str, insurance_id: str | None = None):
    save_patient(citizen_id, fullname, dob, gender, phone_number, address, ethnic, job, insurance_id)

def getPatient(citizen_id: str):
    patient = require_patient(citizen_id)
    return {
        "patient_id": patient["citizen_id"],
        "fullname": patient["fullname"],
        "gender": "Nam" if patient["gender"] else "Nữ",
        "dob": str(patient["dob"]),
        "address": patient["address"],
        "phone_number": patient["phone_number"],
        "ethnic": patient["ethnic"],
        "job": patient["job"],
        "is_insurance": bool(patient["insurance_id"])
    }

def getPatientWithToken(citizen_id: str):
    patient = require_patient(citizen_id)
    return {
        "patient_id": patient["citizen_id"],
        "full_name": patient["fullname"],
        "gender": "Nam" if patient["gender"] else "Nữ",
        "dob": str(patient["dob"]),
        "address": patient["address"],
        "phone_number": patient["phone_number"],
        "ethnic": patient["ethnic"],
        "job": patient["job"],
        "token": create_token(patient["citizen_id"])
    }

def getPatientHistory(citizen_id: str):
    history = get_patient_history(citizen_id)
    return [{
        "order_id": h["order_id"],
        "time_order": str(h["time_order"]),
        "queue_number": h["queue_number"],
        "service_name": h["service_name"],
        "clinic_name": h["clinic_name"],
        "address_room": h["address_room"],
        "doctor_name": h["doctor_name"],
        "payment_status": h["payment_status"],
        "payment_method": h["payment_method"],
        "price": float(h["price"])
    } for h in history]