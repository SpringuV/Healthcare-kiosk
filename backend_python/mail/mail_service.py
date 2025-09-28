from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os

load_dotenv()

conf = ConnectionConfig(
    MAIL_USERNAME=os.getenv("MAIL_USERNAME"),
    MAIL_PASSWORD=os.getenv("MAIL_PASSWORD"),
    MAIL_FROM=os.getenv("MAIL_FROM"),
    MAIL_PORT=int(os.getenv("MAIL_PORT", 587)),
    MAIL_SERVER=os.getenv("MAIL_SERVER"),
    MAIL_STARTTLS=os.getenv("MAIL_STARTTLS", "True").lower() == "true",
    MAIL_SSL_TLS=os.getenv("MAIL_SSL_TLS", "False").lower() == "true",
    USE_CREDENTIALS=True
)

ENDPOINT_DOMAIN = os.getenv("ENDPOINT_DOMAIN", "http://localhost:8000")
async def send_activation_email(email: str, active_code: str):
    message = MessageSchema(
        subject="Mã kích hoạt tài khoản HealthCareKiosk",
        recipients=[email],
        body=(
            f"Xin chào,\n\n"
            f"Mã kích hoạt tài khoản của bạn là: {active_code}\n\n"
            f"⚠️ Mã sẽ hết hạn sau 15 phút.\n\n"
            f"Trân trọng,\nHealthCareKiosk Team"
        ),
        subtype="plain"
    )
    
    fm = FastMail(conf)
    await fm.send_message(message)