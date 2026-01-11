from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_session
from app.services.dashboard import build_dashboard_metrics

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("/metrics")
def metrics(db: Session = Depends(get_session)):
    return build_dashboard_metrics(db)

