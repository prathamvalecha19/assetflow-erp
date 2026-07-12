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

@router.post("/auth/login", response_model=schemas.Token)
def login_json(login_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=login_data.email)
    if not user or not auth.verify_password(login_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/users", response_model=List[schemas.UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_users(db, skip=skip, limit=limit)

@router.post("/users", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = auth.get_password_hash(user.password)
    return crud.create_user(db=db, user=user, hashed_password=hashed_password)

@router.get("/departments", response_model=List[schemas.DepartmentResponse])
def read_departments(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_departments(db, skip=skip, limit=limit)

@router.post("/departments", response_model=schemas.DepartmentResponse)
def create_department(department: schemas.DepartmentCreate, db: Session = Depends(get_db)):
    return crud.create_department(db=db, department=department)

@router.get("/categories", response_model=List[schemas.CategoryResponse])
def read_categories(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_categories(db, skip=skip, limit=limit)

@router.post("/categories", response_model=schemas.CategoryResponse)
def create_category(category: schemas.CategoryCreate, db: Session = Depends(get_db)):
    return crud.create_category(db=db, category=category)

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

@router.get("/bookings", response_model=List[schemas.BookingResponse])
def read_bookings(db: Session = Depends(get_db)):
    bookings = crud.get_bookings(db)
    response = []
    for b in bookings:
        response.append(schemas.BookingResponse(
            id=b.id,
            asset_id=b.asset_id,
            user_id=b.user_id,
            start_time=b.start_time,
            end_time=b.end_time,
            status=b.status,
            resource=b.asset.name if b.asset else f"Asset #{b.asset_id}",
            employee=b.user.email if b.user else f"User #{b.user_id}"
        ))
    return response

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
        
    b = crud.create_booking(db, booking, user_id=current_user.id)
    return schemas.BookingResponse(
        id=b.id,
        asset_id=b.asset_id,
        user_id=b.user_id,
        start_time=b.start_time,
        end_time=b.end_time,
        status=b.status,
        resource=b.asset.name if b.asset else f"Asset #{b.asset_id}",
        employee=current_user.email
    )

@router.get("/maintenance", response_model=List[schemas.MaintenanceResponse])
def read_maintenances(db: Session = Depends(get_db)):
    maintenances = crud.get_maintenances(db)
    response = []
    for m in maintenances:
        response.append(schemas.MaintenanceResponse(
            id=m.id,
            asset_id=m.asset_id,
            asset=m.asset.name if m.asset else f"Asset #{m.asset_id}",
            issue=m.issue,
            priority=m.priority,
            status=m.status,
            technician=m.technician,
            created_at=m.created_at
        ))
    return response

@router.post("/maintenance", response_model=schemas.MaintenanceResponse)
def create_maintenance(
    maintenance: schemas.MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(auth.get_current_user)
):
    m = crud.create_maintenance(db=db, maintenance=maintenance)
    return schemas.MaintenanceResponse(
        id=m.id,
        asset_id=m.asset_id,
        asset=m.asset.name if m.asset else f"Asset #{m.asset_id}",
        issue=m.issue,
        priority=m.priority,
        status=m.status,
        technician=m.technician,
        created_at=m.created_at
    )

@router.patch("/maintenance/{id}", response_model=schemas.MaintenanceResponse)
def update_maintenance(
    id: int,
    updates: schemas.MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.UserResponse = Depends(auth.get_current_user)
):
    m = crud.update_maintenance(db, id, updates)
    if not m:
        raise HTTPException(status_code=404, detail="Maintenance request not found")
    return schemas.MaintenanceResponse(
        id=m.id,
        asset_id=m.asset_id,
        asset=m.asset.name if m.asset else f"Asset #{m.asset_id}",
        issue=m.issue,
        priority=m.priority,
        status=m.status,
        technician=m.technician,
        created_at=m.created_at
    )