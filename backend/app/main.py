from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.database import create_db_and_tables
from app.routers import categories, dashboard, ingestion, products, sales

app = FastAPI(title=settings.project_name, version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(categories)
app.include_router(products)
app.include_router(sales)
app.include_router(dashboard)
app.include_router(ingestion)


@app.get("/")
def root():
    return {"message": "SmartMart Analytics API Operational"}


@app.on_event("startup")
def on_startup():
    create_db_and_tables()

