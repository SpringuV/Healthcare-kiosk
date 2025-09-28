from pydantic import BaseModel, model_validator, EmailStr

class PatientInfo(BaseModel):
    patient_id: str
    full_name: str
    dob: str
    gender: bool
    phone_number: str
    address: str
    ethnic: str
    job: str

class ActivateRequest(BaseModel):
    email: str
    code: str

class PatientInfoUpdate(BaseModel):
    address: str
    ethnic: str
    job: str

class OrderInfo(BaseModel):
    service_name: str
    type: str

class FormLogin(BaseModel):
    username: str | None = None
    password: str
    email: EmailStr | None = None
    @model_validator(mode="after")
    def check_at_least_one_identifier(self):
        if not any(value for value in [self.username, self.email] if value is not None):
            raise ValueError("Cần cung cấp ít nhất username hoặc email")
        return self

class FormCreateAccount(BaseModel):
    realname: str
    username: str
    citizen_id: str
    email: EmailStr

class FormChangePassword(BaseModel):
    old_password: str
    new_password: str

class SearchData(BaseModel):
    skip: int
    searchString: str