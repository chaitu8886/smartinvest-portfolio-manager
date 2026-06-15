from pydantic import BaseModel

class StockCreate(BaseModel):
    symbol: str
    shares: int
    purchase_price: float
    current_price: float

class StockResponse(StockCreate):
    id: int

    class Config:
        from_attributes = True