from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta

from main import app
from database import get_db
import models

# Use an in-memory SQLite database for testing
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
        "/users",
        json={"email": "admin@example.com", "password": "password123", "role": "admin"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "admin@example.com"

def test_login():
    response = client.post(
        "/token",
        data={"username": "admin@example.com", "password": "password123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
    return response.json()["access_token"]

def test_create_asset():
    token = test_login()
    response = client.post(
        "/assets",
        json={"name": "Test Laptop"},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["name"] == "Test Laptop"
    return response.json()["id"]

def test_create_booking():
    token = test_login()
    asset_id = test_create_asset()
    
    start = datetime.utcnow().isoformat()
    end = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    response = client.post(
        "/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response.status_code == 200
    assert response.json()["asset_id"] == asset_id

def test_overlap_booking():
    token = test_login()
    
    # We know asset_id 1 is already booked from the previous test if tests run sequentially,
    # but pytest runs tests independently in random or sequential order.
    # To be safe, we'll create a new asset.
    response_asset = client.post(
        "/assets",
        json={"name": "Overlap Laptop"},
        headers={"Authorization": f"Bearer {token}"}
    )
    asset_id = response_asset.json()["id"]
    
    start = datetime.utcnow().isoformat()
    end = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    # First booking
    client.post(
        "/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    
    # Overlap booking
    response_overlap = client.post(
        "/bookings",
        json={"asset_id": asset_id, "start_time": start, "end_time": end},
        headers={"Authorization": f"Bearer {token}"}
    )
    assert response_overlap.status_code == 400
    assert "already booked" in response_overlap.json()["detail"]
