from sqlalchemy import Column, Integer, String, Float
from database import Base

class Stock(Base):
    __tablename__ = "stocks"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    shares = Column(Integer)
    purchase_price = Column(Float)
    current_price = Column(Float)