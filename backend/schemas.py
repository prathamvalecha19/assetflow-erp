from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

# --- DEPARTMENTS ---
class DepartmentBase(BaseModel):
    name: str

class DepartmentCreate(DepartmentBase):
    pass

class DepartmentResponse(DepartmentBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- CATEGORIES ---
class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class CategoryResponse(CategoryBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- USERS ---
class UserBase(BaseModel):
    email: str
    name: Optional[str] = None
    role: str = "employee"
    department_id: Optional[int] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    department: Optional[DepartmentResponse] = None
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# --- ASSETS ---
class AssetBase(BaseModel):
    name: str
    category_id: Optional[int] = None

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    status: str
    category: Optional[CategoryResponse] = None
    model_config = ConfigDict(from_attributes=True)

# --- BOOKINGS & ALLOCATIONS ---
class BookingCreate(BaseModel):
    asset_id: int
    start_time: datetime
    end_time: datetime

class BookingResponse(BookingCreate):
    id: int
    user_id: int
    model_config = ConfigDict(from_attributes=True)