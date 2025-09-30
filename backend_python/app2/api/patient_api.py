from fastapi import APIRouter
from fastapi.responses import JSONResponse
from ..services.patient import savePatient, getPatient, getPatientWithToken, getPatientHistory
from ..services.heath_insurance import getInsuranceInfo
from ..schemas.schemas import PatientInfo

router = APIRouter(prefix="/patient", tags=["patient"])

# ("/health-insurances/{citizen_id}", status_code=200)
@router.get("/health_insurances/{citizen_id}")
def checkInsurance(citizen_id: str):
    return JSONResponse(status_code=200, content=getInsuranceInfo(citizen_id=citizen_id))

# @app.post("/patient/register")
@router.post("/register")
def patientRegister(info: PatientInfo):
    savePatient(
        info.patient_id, info.full_name, info.dob, info.gender, info.phone_number, info.address, info.ethnic, info.job, None
    )
    return JSONResponse(status_code=201, content={"detail": "Thêm bệnh nhân thành công"})

# @app.get("/patient/check/{citizen_id}")
@router.get("/check/{citizen_id}")
def checkPatient(citizen_id: str):
    return JSONResponse(status_code=200, content=getPatientWithToken(citizen_id=citizen_id))

# Lấy lịch sử khám bệnh của 1 bệnh nhân
# @app.get("/patient/history/{citizen_id}")
# def getPatientHistoryAPI(citizen_id: str):
@router.get("/history/{citizen_id}")
def getPatientHistoryAPI(citizen_id: str):
    patient_info = getPatient(citizen_id=citizen_id)
    history = getPatientHistory(citizen_id=citizen_id)
    return JSONResponse(
        status_code=200, content={"patient": patient_info, "history": history}
    )