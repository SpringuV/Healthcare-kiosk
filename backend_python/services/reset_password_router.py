from fastapi import APIRouter, HTTPException, Query
from datetime import datetime, timezone
from passlib.context import CryptContext
from secrets import choice
from adminAction import getAccount, updateActivationCode, updateAccountState, changePass
from mail.mail_service import send_activation_email
from pydantic import BaseModel, model_validator, EmailStr

router = APIRouter()

cryptContext = CryptContext(schemes=["bcrypt"], deprecated="auto")


# Quên mật khẩu - gửi email OTP
class ForgotPasswordRequest(BaseModel):
    email: EmailStr


# Xác thực OTP
class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str


def generate_otp(length=6):
    return "".join(choice("0123456789") for _ in range(length))


@router.post("/forgot-password")
async def forgot_password(email: str = Query(...)):
    account = getAccount(email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")

    otp = generate_otp()
    if not updateActivationCode(account["account_id"], otp):
        raise HTTPException(status_code=500, detail="Không thể tạo mã OTP")

    await send_activation_email(email, f"Mã OTP đặt lại mật khẩu: {otp}")
    return {"detail": "OTP đã được gửi qua email"}


@router.post("/reset-password")
async def reset_password(
    email: str = Query(...), otp: str = Query(...), new_password: str = Query(...)
):
    account = getAccount(email=email)
    if not account:
        raise HTTPException(status_code=404, detail="Không tìm thấy tài khoản")

    if account["active_code"] != otp:
        raise HTTPException(status_code=400, detail="OTP không hợp lệ")

    if account["active_exp"] and account["active_exp"].replace(
        tzinfo=timezone.utc
    ) < datetime.now(timezone.utc):
        raise HTTPException(status_code=400, detail="OTP đã hết hạn")

    # đổi mật khẩu
    new_salt = generate_otp(10)
    new_hash_pass = cryptContext.hash(new_salt + new_password)
    if not changePass(account["account_id"], new_salt, new_hash_pass):
        raise HTTPException(status_code=500, detail="Không thể đổi mật khẩu")

    updateAccountState(account["account_id"], 1)
    return {"detail": "Đổi mật khẩu thành công"}
