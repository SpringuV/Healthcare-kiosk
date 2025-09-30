from fastapi import FastAPI
from app1.services.account import createAdminIfNone
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from app1.api import user_api, admin_api, cashier_api

@asynccontextmanager
async def lifespan(app: FastAPI):
    createAdminIfNone()
    yield
    print("INFO: Shutdown")

app = FastAPI(title="Backend System", lifespan=lifespan) 

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],  # Cho tất cả method
    allow_headers=["*"],  # Cho tất cả header
)

app.include_router(user_api.router, prefix="/api")
app.include_router(admin_api.router, prefix="/api")
app.include_router(cashier_api.router, prefix="/api")