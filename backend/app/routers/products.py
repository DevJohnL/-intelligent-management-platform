from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app import models, schemas
from app.database import get_session

router = APIRouter(prefix="/products", tags=["products"])


def _get_product_or_404(product_id: int, db: Session) -> models.Product:
    product = db.get(models.Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Produto não encontrado.")
    return product


@router.post("/", response_model=schemas.ProductRead, status_code=status.HTTP_201_CREATED)
def create_product(payload: schemas.ProductCreate, db: Session = Depends(get_session)):
    if not db.get(models.Category, payload.category_id):
        raise HTTPException(status.HTTP_400_BAD_REQUEST, detail="Categoria inválida.")
    product = models.Product(**payload.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.get("/", response_model=list[schemas.ProductRead])
def list_products(db: Session = Depends(get_session)):
    return db.query(models.Product).order_by(models.Product.name).all()


@router.get("/{product_id}", response_model=schemas.ProductRead)
def get_product(product_id: int, db: Session = Depends(get_session)):
    return _get_product_or_404(product_id, db)


@router.patch("/{product_id}", response_model=schemas.ProductRead)
def update_product(product_id: int, payload: schemas.ProductUpdate, db: Session = Depends(get_session)):
    product = _get_product_or_404(product_id, db)
    updates = payload.model_dump(exclude_none=True)
    for field, value in updates.items():
        setattr(product, field, value)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_session)):
    product = _get_product_or_404(product_id, db)
    db.delete(product)
    db.commit()

