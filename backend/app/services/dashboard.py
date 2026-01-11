from typing import Optional

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app import models


def build_dashboard_metrics(db: Session) -> dict:
    total_sales = db.execute(select(func.coalesce(func.sum(models.Sale.total_price), 0))).scalar_one()
    total_quantity = db.execute(select(func.coalesce(func.sum(models.Sale.quantity), 0))).scalar_one()
    total_cost = (
        db.execute(
            select(
                func.coalesce(func.sum(models.Sale.quantity * models.Product.cost_price), 0)
            )
            .join(models.Product, models.Sale.product_id == models.Product.id)
        )
        .scalar_one()
    )

    average_ticket: Optional[float] = (
        total_sales / total_quantity if total_quantity else None
    )

    top_product = (
        db.execute(
            select(models.Product.name)
            .join(models.Sale)
            .group_by(models.Product.id)
            .order_by(func.sum(models.Sale.total_price).desc())
            .limit(1)
        )
        .scalar_one_or_none()
    )

    alert_message = _build_margin_alert(db)

    return {
        "total_sales": float(total_sales),
        "total_cost": float(total_cost),
        "total_quantity": int(total_quantity),
        "average_ticket": float(average_ticket) if average_ticket else None,
        "top_product": top_product,
        "alert_message": alert_message,
    }


def _build_margin_alert(db: Session) -> Optional[str]:
    records = db.execute(
        select(
            models.Product.name,
            (func.sum(models.Sale.total_price) - func.sum(models.Sale.quantity * models.Product.cost_price)).label(
                "profit"
            ),
            func.sum(models.Sale.total_price).label("revenue"),
        )
        .join(models.Sale)
        .group_by(models.Product.id)
    ).all()

    for name, profit, revenue in records:
        if revenue and profit is not None:
            margin_ratio = profit / revenue
            if margin_ratio < 0.2:
                return f"A margem de {name} caiu abaixo de 20%; revisar custo."
    return None

