from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas
import auth


def get_hash(password: str):
    return auth.get_password_hash(password)


# -- Departments --
def get_departments(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Department).offset(skip).limit(limit).all()

def create_department(db: Session, department: schemas.DepartmentCreate):
    db_dept = models.Department(name=department.name)
    db.add(db_dept)
    db.commit()
    db.refresh(db_dept)
    return db_dept

# -- Categories --
def get_categories(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Category).offset(skip).limit(limit).all()

def create_category(db: Session, category: schemas.CategoryCreate):
    db_cat = models.Category(name=category.name, description=category.description)
    db.add(db_cat)
    db.commit()
    db.refresh(db_cat)
    return db_cat

# -- Users --
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(
        email=user.email, 
        password_hash=hashed_password, 
        role=user.role,
        name=user.name,
        department_id=user.department_id
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# -- Assets --
def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    # Generate asset_tag like AF-0001
    last_asset = db.query(models.Asset).order_by(models.Asset.id.desc()).first()
    new_id = (last_asset.id + 1) if last_asset else 1
    asset_tag = f"AF-{new_id:04d}"

    db_asset = models.Asset(
        name=asset.name, 
        asset_tag=asset_tag,
        category_id=asset.category_id,
        serial_number=asset.serial_number,
        acquisition_date=asset.acquisition_date,
        acquisition_cost=asset.acquisition_cost,
        condition=asset.condition,
        location=asset.location,
        is_shared=asset.is_shared,
        status="Available"
    )
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

def get_asset(db: Session, asset_id: int):
    return db.query(models.Asset).filter(models.Asset.id == asset_id).first()

def update_asset_status(db: Session, asset_id: int, status: str):
    db_asset = get_asset(db, asset_id)
    if db_asset:
        db_asset.status = status
        db.commit()
        db.refresh(db_asset)
    return db_asset

# -- Allocations --
def get_allocations(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Allocation).offset(skip).limit(limit).all()

def allocate_asset(db: Session, allocation: schemas.AllocationCreate):
    # Check if asset is available
    db_asset = get_asset(db, allocation.asset_id)
    if not db_asset or db_asset.status != "Available":
        return None # Asset not available
    
    db_allocation = models.Allocation(
        asset_id=allocation.asset_id,
        user_id=allocation.user_id,
        expected_return_date=allocation.expected_return_date,
        status="Active"
    )
    db.add(db_allocation)
    
    # Update asset status
    db_asset.status = "Allocated"
    db.commit()
    db.refresh(db_allocation)
    return db_allocation

def return_asset(db: Session, allocation_id: int):
    db_allocation = db.query(models.Allocation).filter(models.Allocation.id == allocation_id).first()
    if db_allocation and db_allocation.status != "Returned":
        db_allocation.status = "Returned"
        db_allocation.returned_date = datetime.utcnow()
        
        # Update asset status back to Available
        db_asset = get_asset(db, db_allocation.asset_id)
        if db_asset:
            db_asset.status = "Available"
            
        db.commit()
        db.refresh(db_allocation)
    return db_allocation

# -- Bookings --
def get_bookings(db: Session):
    return db.query(models.Booking).all()

def check_booking_overlap(db: Session, asset_id: int, start_time: datetime, end_time: datetime):
    # Only check overlap against bookings that are NOT Cancelled
    return db.query(models.Booking).filter(
        models.Booking.asset_id == asset_id,
        models.Booking.status != "Cancelled",
        models.Booking.start_time < end_time,
        models.Booking.end_time > start_time
    ).first() is not None

def create_booking(db: Session, booking: schemas.BookingCreate, user_id: int):
    db_asset = get_asset(db, booking.asset_id)
    if not db_asset:
        return None
        
    db_booking = models.Booking(
        user_id=user_id,
        asset_id=booking.asset_id,
        start_time=booking.start_time,
        end_time=booking.end_time,
        status="Upcoming"
    )
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

def update_booking_status(db: Session, booking_id: int, status: str):
    db_booking = db.query(models.Booking).filter(models.Booking.id == booking_id).first()
    if db_booking:
        db_booking.status = status
        db.commit()
        db.refresh(db_booking)
    return db_booking

# -- Maintenance --
def get_maintenances(db: Session):
    return db.query(models.Maintenance).all()

def create_maintenance(db: Session, maintenance: schemas.MaintenanceCreate):
    db_maint = models.Maintenance(
        asset_id=maintenance.asset_id,
        issue=maintenance.issue,
        priority=maintenance.priority,
        technician=maintenance.technician,
        status="Pending"
    )
    
    db.add(db_maint)
    db.commit()
    db.refresh(db_maint)
    return db_maint

def update_maintenance(db: Session, maintenance_id: int, updates: schemas.MaintenanceUpdate):
    db_maint = db.query(models.Maintenance).filter(models.Maintenance.id == maintenance_id).first()
    if not db_maint:
        return None
        
    if updates.status is not None:
        db_maint.status = updates.status
        # Handle asset status transitions
        if updates.status == "Resolved":
            db_asset = get_asset(db, db_maint.asset_id)
            if db_asset:
                db_asset.status = "Available"
        elif updates.status in ["Approved", "In Progress"]:
            db_asset = get_asset(db, db_maint.asset_id)
            if db_asset:
                db_asset.status = "Under Maintenance"
                
    if updates.technician is not None:
        db_maint.technician = updates.technician
        
    db.commit()
    db.refresh(db_maint)
    return db_maint