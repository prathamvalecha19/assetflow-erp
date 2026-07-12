from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta

import crud, schemas, auth
from database import get_db

router = APIRouter()

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@router.get("/assets", response_model=List[schemas.AssetResponse])
def read_assets(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_assets(db, skip=skip, limit=limit)

@router.post("/assets", response_model=schemas.AssetResponse)
def create_asset(
    asset: schemas.AssetCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserResponse = Depends(auth.get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return crud.create_asset(db=db, asset=asset)

@router.post("/bookings", response_model=schemas.BookingResponse)
def create_booking(
    booking: schemas.BookingCreate, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserResponse = Depends(auth.get_current_user)
):
    if crud.check_booking_overlap(db, booking.asset_id, booking.start_time, booking.end_time):
        raise HTTPException(status_code=400, detail="Asset is already booked during this time")
    
    asset = crud.get_asset(db, booking.asset_id)
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    return crud.create_booking(db, booking, user_id=current_user.id)

@router.put("/assets/{asset_id}/maintenance", response_model=schemas.AssetResponse)
def set_asset_maintenance(
    asset_id: int, 
    db: Session = Depends(get_db), 
    current_user: schemas.UserResponse = Depends(auth.get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
        
    asset = crud.update_asset_status(db, asset_id, "maintenance")
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    return asset