from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session

from database import SessionLocal, engine
from models import Stock
from schemas import StockCreate, StockResponse
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="SmartInvest Portfolio Manager",
    description="Portfolio Management API",
    version="1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home():
    return {
        "message": "SmartInvest API Running Successfully"
    }

@app.post("/stocks", response_model=StockResponse)
def create_stock(stock: StockCreate, db: Session = Depends(get_db)):

    db_stock = Stock(
        symbol=stock.symbol,
        shares=stock.shares,
        purchase_price=stock.purchase_price,
        current_price=stock.current_price
    )

    db.add(db_stock)
    db.commit()
    db.refresh(db_stock)

    return db_stock

@app.get("/stocks")
def get_stocks(db: Session = Depends(get_db)):
    return db.query(Stock).all()

@app.get("/portfolio-summary")
def portfolio_summary(db: Session = Depends(get_db)):

    stocks = db.query(Stock).all()

    total_cost = sum(
        s.shares * s.purchase_price
        for s in stocks
    )

    total_value = sum(
        s.shares * s.current_price
        for s in stocks
    )

    profit_loss = total_value - total_cost

    return {
        "total_cost": round(total_cost, 2),
        "total_value": round(total_value, 2),
        "profit_loss": round(profit_loss, 2)
    }
@app.delete("/stocks/{stock_id}")
def delete_stock(stock_id: int, db: Session = Depends(get_db)):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()

    if stock is None:
        return {"message": "Stock not found"}

    db.delete(stock)
    db.commit()

    return {"message": "Stock deleted successfully"}
@app.put("/stocks/{stock_id}", response_model=StockResponse)
def update_stock(stock_id: int, updated_stock: StockCreate, db: Session = Depends(get_db)):
    stock = db.query(Stock).filter(Stock.id == stock_id).first()

    if stock is None:
        return {"message": "Stock not found"}

    stock.symbol = updated_stock.symbol
    stock.shares = updated_stock.shares
    stock.purchase_price = updated_stock.purchase_price
    stock.current_price = updated_stock.current_price

    db.commit()
    db.refresh(stock)

    return stock