import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os
import sys

# Add parent directory to sys.path so we can import modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import Base, get_db
from main import app
import crud

# Test database setup
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Override dependency
def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(autouse=True)
def run_around_tests():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    # Seed basic user/assets for testing
    from models import User, Asset
    admin = User(email="admin@assetflow.com", password_hash=crud.get_hash("password123"), role="admin")
    asset_a = Asset(id=1, name="Asset A", category="IT", status="Available")
    asset_b = Asset(id=2, name="Asset B", category="Facilities", status="Available")
    db.add(admin)
    db.add(asset_a)
    db.add(asset_b)
    db.commit()
    db.close()
    yield
    Base.metadata.drop_all(bind=engine)

client = TestClient(app)

def test_login_success():
    response = client.post("/api/auth/login", json={"email": "admin@assetflow.com", "password": "password123"})
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "admin@assetflow.com"

def test_login_failure():
    response = client.post("/api/auth/login", json={"email": "admin@assetflow.com", "password": "wrongpassword"})
    assert response.status_code == 401

def test_get_assets():
    response = client.get("/api/assets")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 2
    assert data[0]["name"] == "Asset A"

def test_create_booking_and_overlap():
    # Start booking at 10:00, end at 12:00
    start_1 = "2026-07-15T10:00:00"
    end_1 = "2026-07-15T12:00:00"
    
    response = client.post("/api/bookings", json={"asset_id": 1, "start_time": start_1, "end_time": end_1}, headers={"Authorization": "Bearer admin@assetflow.com"})
    assert response.status_code == 200
    
    # Try booking same asset at 11:00 to 13:00 (overlap)
    start_2 = "2026-07-15T11:00:00"
    end_2 = "2026-07-15T13:00:00"
    response_overlap = client.post("/api/bookings", json={"asset_id": 1, "start_time": start_2, "end_time": end_2}, headers={"Authorization": "Bearer admin@assetflow.com"})
    assert response_overlap.status_code == 400
    assert "Overlap detected" in response_overlap.json()["detail"]

    # Try booking different asset at 11:00 to 13:00 (no overlap since different asset)
    response_diff_asset = client.post("/api/bookings", json={"asset_id": 2, "start_time": start_2, "end_time": end_2}, headers={"Authorization": "Bearer admin@assetflow.com"})
    assert response_diff_asset.status_code == 200

def test_create_and_update_maintenance():
    # Create maintenance request
    response = client.post("/api/maintenance", json={"asset_id": 1, "issue": "Broken keyboard", "priority": "High", "technician": "Alice"})
    assert response.status_code == 200
    data = response.json()
    assert data["issue"] == "Broken keyboard"
    assert data["status"] == "Pending"
    maint_id = data["id"]
    
    # Update status to In Progress
    response_update = client.patch(f"/api/maintenance/{maint_id}", json={"status": "In Progress"})
    assert response_update.status_code == 200
    assert response_update.json()["status"] == "In Progress"
