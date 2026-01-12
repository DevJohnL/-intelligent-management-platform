from io import StringIO
import csv

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.database import get_session
from app.models import Category, Product, Sale

router = APIRouter(prefix="/download", tags=["download"])


@router.get("/database", response_class=StreamingResponse)
def download_database_csv(db: Session = Depends(get_session)):
    stmt = (
        select(Sale)
        .options(selectinload(Sale.product).selectinload(Product.category))
        .order_by(Sale.date)
    )
    sales = db.scalars(stmt).all()

    buffer = StringIO()
    writer = csv.writer(buffer)
    writer.writerow(
        [
            "sale_id",
            "sale_date",
            "product_id",
            "product_name",
            "product_price",
            "product_cost_price",
            "category_id",
            "category_name",
            "category_discount_percent",
            "quantity",
            "total_price",
        ]
    )

    for sale in sales:
        product = sale.product
        category = product.category
        writer.writerow(
            [
                sale.id,
                sale.date.isoformat(),
                product.id,
                product.name,
                f"{product.price:.2f}",
                f"{product.cost_price:.2f}",
                category.id,
                category.name,
                f"{category.discount_percent:.2f}",
                sale.quantity,
                f"{sale.total_price:.2f}",
            ]
        )

    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=smartmart-data.csv"},
    )

