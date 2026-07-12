from sqlalchemy.orm import Session
from datetime import datetime
import models, schemas

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate, hashed_password: str):
    db_user = models.User(email=user.email, password_hash=hashed_password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_assets(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Asset).offset(skip).limit(limit).all()

def create_asset(db: Session, asset: schemas.AssetCreate):
    db_asset = models.Asset(name=asset.name)
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

def check_booking_overlap(db: Session, asset_id: int, start_time: datetime, end_time: datetime):
    return db.query(models.Booking).filter(
        models.Booking.asset_id == asset_id,
        models.Booking.start_time < end_time,
        models.Booking.end_time > start_time
    ).first() is not None

def create_booking(db: Session, booking: schemas.BookingCreate, user_id: int):
    db_booking = models.Booking(
        user_id=user_id,
        asset_id=booking.asset_id,
        start_time=booking.start_time,
        end_time=booking.end_time
    )
    db.add(db_booking)
    
    # Update asset status
    db_asset = get_asset(db, booking.asset_id)
    if db_asset:
        db_asset.status = "allocated"
        
    db.commit()
    db.refresh(db_booking)
    return db_booking