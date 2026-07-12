from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal
import models, auth
from routes import router

# Create all tables (safe — won't drop existing data)
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AssetFlow ERP API")

# Configure CORS so the React frontend at localhost:5173 can call the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")

@app.on_event("startup")
def seed_on_startup():
    """Auto-seed the database with demo data if it is empty."""
    db = SessionLocal()
    try:
        # Only seed if no users exist yet
        if db.query(models.User).count() == 0:
            # Departments
            it_dept = models.Department(name="IT Support")
            hr_dept = models.Department(name="Human Resources")
            eng_dept = models.Department(name="Engineering")
            db.add_all([it_dept, hr_dept, eng_dept])
            db.commit()

            # Categories
            laptop_cat = models.Category(name="Laptops", description="Workstation laptops")
            furniture_cat = models.Category(name="Furniture", description="Office furniture")
            vehicles_cat = models.Category(name="Vehicles", description="Company vehicles")
            rooms_cat = models.Category(name="Facilities", description="Meeting rooms")
            electronics_cat = models.Category(name="Electronics", description="AV equipment")
            db.add_all([laptop_cat, furniture_cat, vehicles_cat, rooms_cat, electronics_cat])
            db.commit()

            # Users
            admin = models.User(
                name="Admin User",
                email="admin@example.com",
                password_hash=auth.get_password_hash("password123"),
                role="admin",
                department_id=it_dept.id
            )
            employee = models.User(
                name="John Doe",
                email="employee@example.com",
                password_hash=auth.get_password_hash("password123"),
                role="employee",
                department_id=hr_dept.id
            )
            db.add_all([admin, employee])
            db.commit()

            # Assets
            assets = [
                models.Asset(name='MacBook Pro 16"', status="allocated", category_id=laptop_cat.id),
                models.Asset(name="Ergonomic Chair", status="available", category_id=furniture_cat.id),
                models.Asset(name="Dell XPS 15", status="maintenance", category_id=laptop_cat.id),
                models.Asset(name="Projector", status="available", category_id=electronics_cat.id),
                models.Asset(name="Company Van", status="available", category_id=vehicles_cat.id),
                models.Asset(name="Conference Room A", status="available", category_id=rooms_cat.id),
                models.Asset(name="Conference Room B", status="available", category_id=rooms_cat.id),
            ]
            db.add_all(assets)
            db.commit()

            print("✅ Database seeded with demo data.")
            print("   Login: admin@example.com / password123")
            print("   Login: employee@example.com / password123")
        else:
            print("✅ Database already has data — skipping seed.")
    except Exception as e:
        print(f"❌ Seed error: {e}")
        db.rollback()
    finally:
        db.close()

@app.get("/")
def root():
    return {"message": "AssetFlow ERP API is running. Docs at /docs"}
