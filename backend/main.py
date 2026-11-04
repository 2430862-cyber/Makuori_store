from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session

import models
from database import engine, SessionLocal

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Makuori Store API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://makuori-store.vercel.app"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductSchema(BaseModel):
    name: str
    price: float
    description: str


# Database connection
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "Welcome to Makuori Store API"}


# CREATE
@app.post("/products")
def create_product(product: ProductSchema, db: Session = Depends(get_db)):
    new_product = models.ProductModel(**product.model_dump())
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product


# READ ALL
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.ProductModel).all()


# READ ONE
@app.get("/products/{product_id}")
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


# UPDATE
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductSchema,
    db: Session = Depends(get_db)
):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.name = updated_product.name
    product.price = updated_product.price
    product.description = updated_product.description

    db.commit()
    db.refresh(product)
    return product


# DELETE
@app.delete("/products/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}