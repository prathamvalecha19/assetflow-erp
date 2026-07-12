from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean, Text, Float
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime

Base = declarative_base()

class Department(Base):
    __tablename__ = 'departments'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    users = relationship("User", back_populates="department_obj")

    @property
    def size(self):
        return len(self.users)

class Category(Base):
    __tablename__ = 'categories'
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text, nullable=True)
    assets = relationship("Asset", back_populates="category_obj")

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String, default="employee") # admin, department_head, asset_manager, employee
    department_id = Column(Integer, ForeignKey('departments.id'), nullable=True)
    department_obj = relationship("Department", back_populates="users")
    bookings = relationship("Booking", back_populates="user")
    allocations = relationship("Allocation", back_populates="user")

    @property
    def department(self):
        return self.department_obj.name if self.department_obj else "Unassigned"

class Asset(Base):
    __tablename__ = 'assets'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    asset_tag = Column(String, unique=True, index=True)
    serial_number = Column(String, nullable=True)
    acquisition_date = Column(DateTime, nullable=True)
    acquisition_cost = Column(Float, nullable=True)
    condition = Column(String, nullable=True)
    location = Column(String, nullable=True)
    is_shared = Column(Boolean, default=False)
    status = Column(String, default="Available") # Available, Allocated, Reserved, Under Maintenance, Lost, Retired, Disposed
    category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)
    category_obj = relationship("Category", back_populates="assets")
    bookings = relationship("Booking", back_populates="asset")
    maintenances = relationship("Maintenance", back_populates="asset")
    allocations = relationship("Allocation", back_populates="asset")

    @property
    def category(self):
        if self.category_obj:
            return self.category_obj.name
        return getattr(self, '_category_name', 'Uncategorized')

    @category.setter
    def category(self, value):
        # Allow plain string assignment in tests or transient instances
        # without a related Category object.
        self._category_name = value

    @property
    def assignedTo(self):
        for alloc in self.allocations:
            if alloc.status == "Active" and alloc.user:
                return alloc.user.name or alloc.user.email
        return "-"

class Allocation(Base):
    __tablename__ = 'allocations'
    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey('assets.id'))
    user_id = Column(Integer, ForeignKey('users.id'))
    assigned_date = Column(DateTime, default=datetime.utcnow)
    expected_return_date = Column(DateTime, nullable=True)
    returned_date = Column(DateTime, nullable=True)
    status = Column(String, default="Active") # Active, Returned, Transfer Requested
    user = relationship("User", back_populates="allocations")
    asset = relationship("Asset", back_populates="allocations")

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    asset_id = Column(Integer, ForeignKey('assets.id'))
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    status = Column(String, default="Upcoming") # Upcoming, Ongoing, Completed, Cancelled
    user = relationship("User", back_populates="bookings")
    asset = relationship("Asset", back_populates="bookings")

class Maintenance(Base):
    __tablename__ = 'maintenance'
    id = Column(Integer, primary_key=True)
    asset_id = Column(Integer, ForeignKey('assets.id'))
    issue = Column(String)
    priority = Column(String, default="Medium") # Low, Medium, High
    status = Column(String, default="Pending") # Pending, Approved, Rejected, In Progress, Resolved
    technician = Column(String, default="-")
    created_at = Column(DateTime, default=datetime.utcnow)
    asset = relationship("Asset", back_populates="maintenances")