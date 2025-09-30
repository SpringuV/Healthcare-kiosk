from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer
from dotenv import load_dotenv
import os

load_dotenv()
# sepay api key
SEPAY_API_KEY = "d99cff6fc8a2f1fbc39e1c8f4f9eb28d692c40900bbb3486b426a13da37b79a0"
SEPAY_API_KEY_2 = "ZFAOUF2TM0TDDCAICNFAVOKCUFPZ34ILKDSY5DBW6BMMYVY94R5UO3OPXWG8L1L2"
# biến dùng để kết nối database
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = int(os.getenv("DB_PORT", "3306"))
DB_NAME = os.getenv("DB_NAME")
# link server chạy 
LINK = "https://healthcare-kiosk.onrender.com"
# biến dùng trong mã hóa token
SECRET_KEY = "v8P2shAY3fDKWuz5qZt0mXNaHy1Lrj"
ALGORITHM = "HS256"
# thời hạn token dùng để đăng ký khám
PATIENT_TOKEN_EXPIRE_MINUTES = 5
# đối tượng mã hóa (bcrypt)
cryptContext = CryptContext(schemes=["bcrypt"], deprecated="auto")
# đối tượng để lấy token Bearer
oAuthBearer = OAuth2PasswordBearer(tokenUrl="/token")