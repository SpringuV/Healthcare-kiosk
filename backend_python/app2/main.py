from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app2.api import patient_api, order_api, payment_api

app = FastAPI(title="Kiosk Backend System") 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Cho tất cả method
    allow_headers=["*"],  # Cho tất cả header
)

app.include_router(patient_api.router)
app.include_router(order_api.router)
app.include_router(payment_api.router)