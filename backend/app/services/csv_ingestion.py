from datetime import datetime
from io import BytesIO

import pandas as pd
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app import models

ALLOWED_ENTITIES = {"categories", "products", "sales"}


def parse_csv(raw_bytes: bytes) -> pd.DataFrame:
    try:
        return pd.read_csv(BytesIO(raw_bytes))
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Erro ao ler CSV: {exc}")


def process_csv_upload(raw_bytes: bytes, entity: str, db: Session) -> dict:
    if entity not in ALLOWED_ENTITIES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Entidade inválida para ingestão.")

    df = parse_csv(raw_bytes)
    inserted = 0
    insight = None
    if entity == "categories":
        inserted = _ingest_categories(df, db)
        insight = "Categorias atualizadas/registradas."
    elif entity == "products":
        inserted = _ingest_products(df, db)
        insight = "Produtos enriquecidos com preço sugerido."
    elif entity == "sales":
        inserted = _ingest_sales(df, db)
        insight = "Vendas agregadas no histórico."

    db.commit()
    return {"records_processed": inserted, "entity": entity, "insight": insight}


def _ingest_categories(df: pd.DataFrame, db: Session) -> int:
    records = df.to_dict(orient="records")
    processed = 0
    for entry in records:
        name = str(entry.get("name", "")).strip()
        if not name:
            continue
        discount = _safe_float(entry.get("discount_percent"), default=0.0)
        category = db.query(models.Category).filter_by(name=name).first()
        if category:
            category.discount_percent = discount
        else:
            db.add(models.Category(name=name, discount_percent=discount))
        processed += 1
    return processed


def _ingest_products(df: pd.DataFrame, db: Session) -> int:
    records = df.to_dict(orient="records")
    processed = 0
    for entry in records:
        name = str(entry.get("name", "")).strip()
        price = _safe_float(entry.get("price"))
        category_id = entry.get("category_id")
        if not name or price is None or category_id is None:
            continue
        cost_price = _safe_float(entry.get("cost_price"), default=price * 0.7)
        product = db.query(models.Product).filter_by(name=name).first()
        if product:
            product.price = price
            product.cost_price = cost_price
            product.category_id = category_id
        else:
            db.add(
                models.Product(
                    name=name,
                    price=price,
                    cost_price=cost_price,
                    category_id=category_id,
                )
            )
        processed += 1
    return processed


def _ingest_sales(df: pd.DataFrame, db: Session) -> int:
    records = df.to_dict(orient="records")
    processed = 0
    for entry in records:
        product_id = entry.get("product_id")
        quantity = entry.get("quantity")
        total_price = _safe_float(entry.get("total_price"))
        date_value = entry.get("date")
        if not all([product_id, quantity, total_price, date_value]):
            continue
        try:
            parsed_date = pd.to_datetime(date_value)
        except Exception:
            continue
        db.add(
            models.Sale(
                product_id=product_id,
                quantity=int(quantity),
                total_price=total_price,
                date=parsed_date.to_pydatetime(),
            )
        )
        processed += 1
    return processed


def _safe_float(value, default=None):
    if value is None or value == "":
        return default
    try:
        return float(value)
    except ValueError:
        return default

