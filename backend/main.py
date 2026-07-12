from fastapi import FastAPI
from database import engine
import models
from routes import router

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="AssetFlow ERP API")

app.include_router(router)

@app.get("/")
def root():
    return {"message": "Welcome to AssetFlow ERP API"}
