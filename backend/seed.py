from database import SessionLocal, engine
import models
import auth

# Ensure tables are fresh
models.Base.metadata.drop_all(bind=engine)
models.Base.metadata.create_all(bind=engine)

db = SessionLocal()

try:
    # 1. Create Departments
    eng_dept = models.Department(name="Engineering")
    hr_dept = models.Department(name="Human Resources")
    fin_dept = models.Department(name="Finance")
    ops_dept = models.Department(name="Operations")
    it_dept = models.Department(name="IT Support")
    db.add_all([eng_dept, hr_dept, fin_dept, ops_dept, it_dept])
    db.commit()

    # 2. Create Categories
    laptop_cat = models.Category(name="Laptops", description="Workstation laptops")
    furniture_cat = models.Category(name="Furniture", description="Office furniture")
    rooms_cat = models.Category(name="Facilities", description="Meeting rooms")
    electronics_cat = models.Category(name="Electronics", description="AV equipment")
    db.add_all([laptop_cat, furniture_cat, rooms_cat, electronics_cat])
    db.commit()

    # 3. Create Users
    pratham = models.User(
        name="Pratham Valecha",
        email="pratham@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=eng_dept.id
    )
    sahil = models.User(
        name="Sahil Sharma",
        email="sahil@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=eng_dept.id
    )
    krishna = models.User(
        name="Krishna Patel",
        email="krishna@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=hr_dept.id
    )
    riya = models.User(
        name="Riya Mehta",
        email="riya@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=fin_dept.id
    )
    aarav = models.User(
        name="Aarav Singh",
        email="aarav@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=ops_dept.id
    )
    ananya = models.User(
        name="Ananya Gupta",
        email="ananya@assetflow.com",
        password_hash=auth.get_password_hash("password123"),
        role="employee",
        department_id=it_dept.id
    )
    db.add_all([pratham, sahil, krishna, riya, aarav, ananya])
    db.commit()

    # 4. Create Assets
    assets = [
        models.Asset(name="Dell Latitude 7440", asset_tag="AF-0001", status="Allocated", category_id=laptop_cat.id, location="HQ - Floor 3", condition="Good"),
        models.Asset(name="MacBook Pro M3", asset_tag="AF-0002", status="Allocated", category_id=laptop_cat.id, location="HQ - Floor 3", condition="New"),
        models.Asset(name="Lenovo ThinkPad X1", asset_tag="AF-0003", status="Available", category_id=laptop_cat.id, location="HQ - Storage", condition="Good"),
        models.Asset(name="Epson Projector", asset_tag="AF-0004", status="Available", category_id=electronics_cat.id, location="Meeting Room A", condition="Fair", is_shared=True),
        models.Asset(name="Conference Room A", asset_tag="AF-0005", status="Available", category_id=rooms_cat.id, location="HQ - Floor 1", condition="Good", is_shared=True),
        models.Asset(name="Conference Room B", asset_tag="AF-0006", status="Available", category_id=rooms_cat.id, location="HQ - Floor 1", condition="Good", is_shared=True),
        models.Asset(name="Samsung Monitor", asset_tag="AF-0007", status="Available", category_id=electronics_cat.id, location="HQ - Floor 2", condition="Good"),
        models.Asset(name="Canon Printer", asset_tag="AF-0008", status="Available", category_id=electronics_cat.id, location="HQ - Floor 2", condition="Fair"),
    ]
    db.add_all(assets)
    db.commit()

    # 5. Create Allocations
    alloc1 = models.Allocation(asset_id=assets[0].id, user_id=pratham.id, status="Active")
    alloc2 = models.Allocation(asset_id=assets[1].id, user_id=sahil.id, status="Active")
    db.add_all([alloc1, alloc2])
    db.commit()

    # 6. Create Maintenance
    maint1 = models.Maintenance(asset_id=assets[6].id, issue="Flickering screen on HDMI connection", priority="High", status="Pending")
    maint2 = models.Maintenance(asset_id=assets[7].id, issue="Paper jam error code 50.1", priority="Low", status="Resolved", technician="IT Helpdesk")
    db.add_all([maint1, maint2])
    db.commit()

    print("Seed data populated successfully! Logins: pratham@assetflow.com / password123")

except Exception as e:
    db.rollback()
    print(f"Error seeding data: {e}")
finally:
    db.close()
