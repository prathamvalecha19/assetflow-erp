from database import SessionLocal, engine
import models
import auth

# Ensure tables are fresh
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 1. Create Departments
    it_dept = models.Department(name="IT Support")
    hr_dept = models.Department(name="Human Resources")
    db.add_all([it_dept, hr_dept])
    db.commit()

    # 2. Create Categories
    laptop_cat = models.Category(name="Laptops", description="Workstation laptops")
    monitor_cat = models.Category(name="Monitors", description="External displays")
    db.add_all([laptop_cat, monitor_cat])
    db.commit()

    # 3. Create Users
    admin = models.User(
        name="Admin User",
        email="admin@example.com",
        password_hash=auth.get_password_hash("password123"),
        role="admin",
        department_id=it_dept.id
    )
    employee = models.User(
        name="Test Employee",
        email="employee@example.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=hr_dept.id
    )
    db.add_all([admin, employee])
    db.commit()

    # 4. Create Assets
    asset1 = models.Asset(name="MacBook Pro 16", category_id=laptop_cat.id)
    asset2 = models.Asset(name="Dell UltraSharp 27", category_id=monitor_cat.id)
    db.add_all([asset1, asset2])
    db.commit()

    print("✅ Seed data populated successfully! You can login with admin@example.com / password123")

except Exception as e:
    print(f"❌ Error seeding data: {e}")
    db.rollback()
finally:
    db.close()
