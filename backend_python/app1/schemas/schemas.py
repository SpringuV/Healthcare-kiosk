from pydantic import BaseModel

class FormLogin(BaseModel):
    username: str
    password: str

class FormCreateAccount(BaseModel):
    realname: str
    username: str
    citizen_id: str

class FormChangePassword(BaseModel):
    old_password: str
    new_password: str

class SearchData(BaseModel):
    skip: int
    searchString: str
