from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional

# --- USERS ---
class UserBase(BaseModel):
    email: str
    role: str = "employee"

class UserCreate(UserBase):
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None


class UserResponse(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)

# --- ASSETS ---
class AssetCreate(BaseModel):
    name: str

class AssetResponse(BaseModel):
    id: int
    name: str
    status: str
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