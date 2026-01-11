from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.orm import Session

from app.database import get_session
from app.services.csv_ingestion import process_csv_upload

router = APIRouter(prefix="/ingest", tags=["ingest"])


@router.post("/csv/{entity}")
async def ingest_csv(entity: str, file: UploadFile = File(...), db: Session = Depends(get_session)):
    raw_bytes = await file.read()
    return process_csv_upload(raw_bytes, entity, db)

