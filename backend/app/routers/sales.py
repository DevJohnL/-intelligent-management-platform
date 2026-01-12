from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_session
from app.services.dashboard import (
    build_monthly_sales_quantity_by_product,
    build_sales_quantity_by_product,
)

router = APIRouter(prefix="/sales", tags=["sales"])


def _get_sale_or_404(sale_id: int, db: Session) -> models.Sale:
    sale = db.get(models.Sale, sale_id)
    if not sale:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Venda não encontrada.")
    return sale


@router.post("/", response_model=schemas.SaleRead, status_code=status.HTTP_201_CREATED)
def create_sale(payload: schemas.SaleCreate, db: Session = Depends(get_session)):
    if not db.get(models.Product, payload.product_id):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Produto inválido.")
    sale = models.Sale(**payload.model_dump())
    db.add(sale)
    db.commit()
    db.refresh(sale)
    return sale


@router.get("/", response_model=list[schemas.SaleRead])
def list_sales(db: Session = Depends(get_session)):
    return db.query(models.Sale).order_by(models.Sale.date.desc()).all()


@router.get("/quantity", response_model=list[schemas.SaleQuantityByProduct])
def list_sales_quantity(
    product_id: Optional[int] = Query(None, description="Filtra a quantidade vendida por produto específico."),
    db: Session = Depends(get_session),
):
    return build_sales_quantity_by_product(db, product_id)


@router.get("/quantity-trend", response_model=list[schemas.SaleMonthlyQuantityByProduct])
def list_sales_quantity_trend(db: Session = Depends(get_session)):
    return build_monthly_sales_quantity_by_product(db)


@router.get("/{sale_id}", response_model=schemas.SaleRead)
def get_sale(sale_id: int, db: Session = Depends(get_session)):
    return _get_sale_or_404(sale_id, db)

