from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_session

router = APIRouter(prefix="/categories", tags=["categories"])


@router.post("/", response_model=schemas.CategoryRead, status_code=status.HTTP_201_CREATED)
def create_category(payload: schemas.CategoryCreate, db: Session = Depends(get_session)):
    existing = db.query(models.Category).filter_by(name=payload.name).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Categoria já existe.")
    category = models.Category(**payload.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.get("/", response_model=list[schemas.CategoryRead])
def list_categories(db: Session = Depends(get_session)):
    categories = db.query(models.Category).order_by(models.Category.name).all()
    return categories

