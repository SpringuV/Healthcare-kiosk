from pydantic import BaseModel

class PatientInfo(BaseModel):
    patient_id: str
    full_name: str
    dob: str
    gender: bool
    phone_number: str
    address: str
    ethnic: str
    job: str


class PatientInfoUpdate(BaseModel):
    address: str
    ethnic: str
    job: str


class OrderInfo(BaseModel):
    service_name: str
    type: str