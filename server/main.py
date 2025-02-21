from fastapi import FastAPI
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from fastapi.middleware.cors import CORSMiddleware




load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change this to your frontend URL in production (e.g., "http://localhost:5173")
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, OPTIONS, etc.)
    allow_headers=["*"],  # Allow all headers
)
MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = "herdForm"

client = AsyncIOMotorClient(MONGO_URI)
db = client[DB_NAME]
collection = db["formData"]


class FormData(BaseModel):
    first_name: str
    last_name: str
    email: str
    rare_disease: str | None = None
    message:  str | None = None

@app.post("/submit/")
async def submit(form: FormData):
    form_dict = form.dict()  # Convert Pydantic model to dictionary
    result = await collection.insert_one(form_dict)
    return {"message": "Form submitted successfully", "id": str(result.inserted_id)}

