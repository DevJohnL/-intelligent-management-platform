from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, PositiveInt


class CategoryBase(BaseModel):
    name: str = Field(..., max_length=80)
    discount_percent: float = Field(0.0, ge=0.0, le=100.0)


class CategoryCreate(CategoryBase):
    pass


class CategoryRead(CategoryBase):
    id: int

    class Config:
        from_attributes = True


class ProductBase(BaseModel):
    name: str
    price: float = Field(..., gt=0)
    cost_price: float = Field(..., gt=0)
    category_id: int


class ProductCreate(ProductBase):
    pass


class ProductUpdate(BaseModel):
    price: Optional[float] = Field(None, gt=0)
    cost_price: Optional[float] = Field(None, gt=0)
    category_id: Optional[int]


class ProductRead(ProductBase):
    id: int
    category: Optional[CategoryRead]

    class Config:
        from_attributes = True


class SaleBase(BaseModel):
    product_id: int
    quantity: PositiveInt
    total_price: float = Field(..., gt=0)
    date: datetime


class SaleCreate(SaleBase):
    pass


class SaleRead(SaleBase):
    id: int

    class Config:
        from_attributes = True


class SaleQuantityByProduct(BaseModel):
    product_id: int
    product_name: str
    quantity: int

    class Config:
        from_attributes = True


class SaleMonthlyQuantityByProduct(BaseModel):
    product_id: int
    product_name: str
    period: str
    year: int
    month: int
    quantity: int

    class Config:
        from_attributes = True

class DashboardMetrics(BaseModel):
    total_sales: float
    total_cost: float
    total_quantity: int
    average_ticket: Optional[float]
    top_product: Optional[str]
    category_alert: Optional[str]

