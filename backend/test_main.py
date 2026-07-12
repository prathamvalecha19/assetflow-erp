from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
import time

from main import app
from database import get_db
import models

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/api/users",
        json={"email": "admin@example.com", "password": "password123", "role": "admin", "name": "Admin User"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"
    return response.json()["id"]

def test_login():
    response = client.post(
        "/api/token",
        data={"username": "admin@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    return response.json()["access_token"]

def test_create_department():
    name = f"IT Support_{time.time()}"
    response = client.post("/api/departments", json={"name": name})
    assert response.status_code == 200
    assert response.json()["name"] == name
    return response.json()["id"]

def test_create_category():
    name = f"Laptops_{time.time()}"
    response = client.post("/api/categories", json={"name": name, "description": "Work laptops"})
    assert response.status_code == 200
    assert response.json()["name"] == name
    return response.json()["id"]

def test_create_asset():
    token = test_login()
    cat_id = test_create_category()
    response = client.post(
        "/api/assets",
        json={"name": "Test Laptop", "category_id": cat_id, "is_shared": False},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Laptop"
    assert "AF-" in response.json()["asset_tag"]
    return response.json()["id"]

def test_create_shared_asset():
    token = test_login()
    cat_id = client.get("/api/categories").json()[0]["id"]
    response = client.post(
        "/api/assets",
        json={"name": "Shared Room", "category_id": cat_id, "is_shared": True},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    return response.json()["id"]

def test_create_booking():
    token = test_login()
    asset_id = test_create_shared_asset()
    
    start = datetime.utcnow().isoformat()
    end = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    response = client.post(
        "/api/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["asset_id"] == asset_id

def test_overlap_booking():
    token = test_login()
    asset_id = test_create_shared_asset()
    
    start = datetime.utcnow().isoformat()
    end = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    client.post(
        "/api/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    response_overlap = client.post(
        "/api/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response_overlap.status_code == 400

def test_create_allocation():
    token = test_login()
    asset_id = test_create_asset() # not shared
    user_id = client.get("/api/users").json()[0]["id"]
    
    response = client.post(
        "/api/allocations",
        json={"asset_id": asset_id, "user_id": user_id},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Active"
    
    # Check asset status updated
    assets = client.get("/api/assets").json()
    allocated_asset = next(a for a in assets if a["id"] == asset_id)
    assert allocated_asset["status"] == "Allocated"
    
    return response.json()["id"], asset_id

def test_return_allocation():
    token = test_login()
    alloc_id, asset_id = test_create_allocation()
    
    response = client.patch(
        f"/api/allocations/{alloc_id}/return",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "Returned"
    
    # Check asset status updated back to Available
    assets = client.get("/api/assets").json()
    returned_asset = next(a for a in assets if a["id"] == asset_id)
    assert returned_asset["status"] == "Available"
