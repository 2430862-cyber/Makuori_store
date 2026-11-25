
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt

import models
from database import engine, SessionLocal
from auth import (
    hash_password,
    verify_password,
    create_access_token,
    SECRET_KEY,
    ALGORITHM
)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Create FastAPI application
app = FastAPI(title="Makuori Store API")

# HTTP Bearer authentication
security = HTTPBearer()

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "https://makuori-store.vercel.app",
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# PYDANTIC SCHEMAS
# =========================

class ProductSchema(BaseModel):
    name: str
    price: float
    description: str


class UserRegisterSchema(BaseModel):
    name: str
    email: str
    password: str


class UserLoginSchema(BaseModel):
    email: str
    password: str


# =========================
# DATABASE CONNECTION
# =========================

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# =========================
# AUTHENTICATION
# =========================

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:
        token = credentials.credentials

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        user_id = payload.get("sub")

        if user_id is None:
            raise credentials_exception

        user = db.query(models.UserModel).filter(
            models.UserModel.id == int(user_id)
        ).first()

        if user is None:
            raise credentials_exception

        return user

    except (JWTError, ValueError):
        raise credentials_exception


# =========================
# ADMIN AUTHORIZATION
# =========================

def require_admin(
    current_user: models.UserModel = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin access required"
        )

    return current_user


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {"message": "Welcome to Makuori Store API"}


# =========================
# USER REGISTRATION
# =========================

@app.post("/register")
def register_user(
    user: UserRegisterSchema,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.UserModel).filter(
        models.UserModel.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(user.password)

    new_user = models.UserModel(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role="customer"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id,
        "name": new_user.name,
        "email": new_user.email,
        "role": new_user.role
    }


# =========================
# USER LOGIN
# =========================

@app.post("/login")
def login_user(
    user: UserLoginSchema,
    db: Session = Depends(get_db)
):
    existing_user = db.query(models.UserModel).filter(
        models.UserModel.email == user.email
    ).first()

    if not existing_user or not verify_password(
        user.password,
        existing_user.hashed_password
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": str(existing_user.id),
            "role": existing_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": existing_user.id,
            "name": existing_user.name,
            "email": existing_user.email,
            "role": existing_user.role
        }
    }


# =========================
# PRODUCT OPERATIONS
# =========================

# CREATE PRODUCT (ADMIN ONLY)
@app.post("/products")
def create_product(
    product: ProductSchema,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(require_admin)
):
    new_product = models.ProductModel(**product.model_dump())

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    return new_product


# READ ALL PRODUCTS (PUBLIC)
@app.get("/products")
def get_products(db: Session = Depends(get_db)):
    return db.query(models.ProductModel).all()


# READ ONE PRODUCT (PUBLIC)
@app.get("/products/{product_id}")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


# UPDATE PRODUCT (ADMIN ONLY)
@app.put("/products/{product_id}")
def update_product(
    product_id: int,
    updated_product: ProductSchema,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(require_admin)
):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = updated_product.name
    product.price = updated_product.price
    product.description = updated_product.description

    db.commit()
    db.refresh(product)

    return product


# DELETE PRODUCT (ADMIN ONLY)
@app.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: models.UserModel = Depends(require_admin)
):
    product = db.query(models.ProductModel).filter(
        models.ProductModel.id == product_id
    ).first()

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {"message": "Product deleted successfully"}
