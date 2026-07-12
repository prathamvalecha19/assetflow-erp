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

class UserLogin(BaseModel):
    email: str
    password: str

# --- ASSETS ---
class AssetBase(BaseModel):
    name: str
    category_id: Optional[int] = None
    serial_number: Optional[str] = None
    acquisition_date: Optional[datetime] = None
    acquisition_cost: Optional[float] = None
    condition: Optional[str] = None
    location: Optional[str] = None
    is_shared: bool = False

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: int
    asset_tag: str
    status: str
    category: Optional[CategoryResponse] = None
    model_config = ConfigDict(from_attributes=True)

# --- ALLOCATIONS ---
class AllocationCreate(BaseModel):
    asset_id: int
    user_id: int
    expected_return_date: Optional[datetime] = None

class AllocationUpdate(BaseModel):
    status: Optional[str] = None
    returned_date: Optional[datetime] = None

class AllocationResponse(BaseModel):
    id: int
    asset_id: int
    user_id: int
    assigned_date: datetime
    expected_return_date: Optional[datetime] = None
    returned_date: Optional[datetime] = None
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
    status: str = "Upcoming"
    resource: str = "" # helper for asset name in frontend API
    employee: str = "" # helper for user email in frontend API
    model_config = ConfigDict(from_attributes=True)

# --- MAINTENANCE ---
class MaintenanceCreate(BaseModel):
    asset_id: int
    issue: str
    priority: str = "Medium"
    technician: str = "-"

class MaintenanceUpdate(BaseModel):
    status: Optional[str] = None
    technician: Optional[str] = None

class MaintenanceResponse(BaseModel):
    id: int
    asset_id: int
    asset: str = "" # helper for asset name
    issue: str
    priority: str
    status: str
    technician: str
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)