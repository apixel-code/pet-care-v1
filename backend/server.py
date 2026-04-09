from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import hashlib
import secrets

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Admin password from env or default
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'supreme2024')

# Create the main app
app = FastAPI(title="Supreme Pet Clinic API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# ===================== MODELS =====================

class AppointmentCreate(BaseModel):
    pet_name: str
    pet_type: str
    owner_name: str
    phone: str
    service: str
    preferred_date: str
    preferred_time: str
    notes: Optional[str] = ""

class Appointment(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    pet_name: str
    pet_type: str
    owner_name: str
    phone: str
    service: str
    preferred_date: str
    preferred_time: str
    notes: str = ""
    status: str = "pending"  # pending, confirmed, completed, cancelled
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class BlogPostCreate(BaseModel):
    title: str
    excerpt: str
    content: str
    image_url: Optional[str] = ""
    category: str = "পোষা প্রাণীর যত্ন"

class BlogPost(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    excerpt: str
    content: str
    image_url: str = ""
    category: str = "পোষা প্রাণীর যত্ন"
    published: bool = True
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class MessageCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = ""
    message: str

class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: str = ""
    message: str
    read: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())

class AdminLogin(BaseModel):
    password: str

class AdminSession(BaseModel):
    token: str
    expires_at: str

# ===================== HELPER FUNCTIONS =====================

def generate_session_token():
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()

async def verify_admin_session(request: Request) -> bool:
    """Verify admin session from Authorization header"""
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        return False
    token = auth_header[7:]
    hashed = hash_token(token)
    session = await db.admin_sessions.find_one({"token_hash": hashed}, {"_id": 0})
    if not session:
        return False
    # Check expiry
    expires_at = datetime.fromisoformat(session['expires_at'])
    if datetime.now(timezone.utc) > expires_at:
        await db.admin_sessions.delete_one({"token_hash": hashed})
        return False
    return True

# ===================== PUBLIC ENDPOINTS =====================

@api_router.get("/")
async def root():
    return {"message": "সুপ্রীম পেট ক্লিনিকে স্বাগতম!"}

@api_router.get("/health")
async def health_check():
    return {"status": "healthy", "clinic": "Supreme Pet Clinic"}

# ===================== APPOINTMENT ENDPOINTS =====================

@api_router.post("/appointments", response_model=Appointment)
async def create_appointment(input: AppointmentCreate):
    """Create a new appointment (public)"""
    appointment = Appointment(**input.model_dump())
    doc = appointment.model_dump()
    await db.appointments.insert_one(doc)
    return appointment

@api_router.get("/appointments", response_model=List[Appointment])
async def get_appointments(request: Request):
    """Get all appointments (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    appointments = await db.appointments.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return appointments

@api_router.patch("/appointments/{appointment_id}")
async def update_appointment_status(appointment_id: str, status: str, request: Request):
    """Update appointment status (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.appointments.update_one(
        {"id": appointment_id},
        {"$set": {"status": status}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="এপয়েন্টমেন্ট পাওয়া যায়নি")
    return {"message": "স্ট্যাটাস আপডেট হয়েছে"}

@api_router.delete("/appointments/{appointment_id}")
async def delete_appointment(appointment_id: str, request: Request):
    """Delete an appointment (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.appointments.delete_one({"id": appointment_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="এপয়েন্টমেন্ট পাওয়া যায়নি")
    return {"message": "এপয়েন্টমেন্ট মুছে ফেলা হয়েছে"}

# ===================== BLOG ENDPOINTS =====================

@api_router.get("/blogs", response_model=List[BlogPost])
async def get_blogs():
    """Get all published blog posts (public)"""
    blogs = await db.blogs.find({"published": True}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return blogs

@api_router.get("/blogs/all", response_model=List[BlogPost])
async def get_all_blogs(request: Request):
    """Get all blog posts including drafts (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    blogs = await db.blogs.find({}, {"_id": 0}).sort("created_at", -1).to_list(100)
    return blogs

@api_router.get("/blogs/{blog_id}", response_model=BlogPost)
async def get_blog(blog_id: str):
    """Get a single blog post"""
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    if not blog:
        raise HTTPException(status_code=404, detail="ব্লগ পোস্ট পাওয়া যায়নি")
    return blog

@api_router.post("/blogs", response_model=BlogPost)
async def create_blog(input: BlogPostCreate, request: Request):
    """Create a new blog post (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    blog = BlogPost(**input.model_dump())
    doc = blog.model_dump()
    await db.blogs.insert_one(doc)
    return blog

@api_router.put("/blogs/{blog_id}", response_model=BlogPost)
async def update_blog(blog_id: str, input: BlogPostCreate, request: Request):
    """Update a blog post (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.blogs.update_one(
        {"id": blog_id},
        {"$set": input.model_dump()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="ব্লগ পোস্ট পাওয়া যায়নি")
    blog = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
    return blog

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, request: Request):
    """Delete a blog post (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.blogs.delete_one({"id": blog_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="ব্লগ পোস্ট পাওয়া যায়নি")
    return {"message": "ব্লগ পোস্ট মুছে ফেলা হয়েছে"}

# ===================== MESSAGE ENDPOINTS =====================

@api_router.post("/messages", response_model=Message)
async def create_message(input: MessageCreate):
    """Submit a contact message (public)"""
    message = Message(**input.model_dump())
    doc = message.model_dump()
    await db.messages.insert_one(doc)
    return message

@api_router.get("/messages", response_model=List[Message])
async def get_messages(request: Request):
    """Get all messages (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    messages = await db.messages.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    return messages

@api_router.patch("/messages/{message_id}/read")
async def mark_message_read(message_id: str, request: Request):
    """Mark message as read (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.messages.update_one(
        {"id": message_id},
        {"$set": {"read": True}}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="মেসেজ পাওয়া যায়নি")
    return {"message": "পঠিত হিসেবে চিহ্নিত"}

@api_router.delete("/messages/{message_id}")
async def delete_message(message_id: str, request: Request):
    """Delete a message (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    result = await db.messages.delete_one({"id": message_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="মেসেজ পাওয়া যায়নি")
    return {"message": "মেসেজ মুছে ফেলা হয়েছে"}

# ===================== ADMIN AUTH ENDPOINTS =====================

@api_router.post("/admin/login")
async def admin_login(input: AdminLogin):
    """Admin login with password only"""
    if input.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="ভুল পাসওয়ার্ড")
    
    # Generate session token
    token = generate_session_token()
    token_hash = hash_token(token)
    expires_at = datetime.now(timezone.utc).replace(hour=23, minute=59, second=59) + __import__('datetime').timedelta(days=1)
    
    # Store session
    await db.admin_sessions.insert_one({
        "token_hash": token_hash,
        "expires_at": expires_at.isoformat(),
        "created_at": datetime.now(timezone.utc).isoformat()
    })
    
    return {"token": token, "expires_at": expires_at.isoformat(), "message": "সফলভাবে লগইন হয়েছে"}

@api_router.post("/admin/logout")
async def admin_logout(request: Request):
    """Admin logout"""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        token_hash = hash_token(token)
        await db.admin_sessions.delete_one({"token_hash": token_hash})
    return {"message": "সফলভাবে লগআউট হয়েছে"}

@api_router.get("/admin/verify")
async def verify_admin(request: Request):
    """Verify admin session"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অবৈধ সেশন")
    return {"valid": True, "message": "সেশন বৈধ"}

# ===================== STATS ENDPOINT =====================

@api_router.get("/admin/stats")
async def get_admin_stats(request: Request):
    """Get dashboard statistics (admin only)"""
    if not await verify_admin_session(request):
        raise HTTPException(status_code=401, detail="অনুমোদন প্রয়োজন")
    
    total_appointments = await db.appointments.count_documents({})
    pending_appointments = await db.appointments.count_documents({"status": "pending"})
    total_blogs = await db.blogs.count_documents({})
    total_messages = await db.messages.count_documents({})
    unread_messages = await db.messages.count_documents({"read": False})
    
    return {
        "total_appointments": total_appointments,
        "pending_appointments": pending_appointments,
        "total_blogs": total_blogs,
        "total_messages": total_messages,
        "unread_messages": unread_messages
    }

# Include the router in the main app
app.include_router(api_router)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Seed initial blog posts on startup
@app.on_event("startup")
async def seed_data():
    # Seed sample blog posts if none exist
    blog_count = await db.blogs.count_documents({})
    if blog_count == 0:
        sample_blogs = [
            {
                "id": str(uuid.uuid4()),
                "title": "আপনার বিড়াল কি খাওয়া বন্ধ করে দিয়েছে? যা জানা জরুরি",
                "excerpt": "বিড়ালের খাওয়া বন্ধ করা একটি গুরুতর সমস্যার লক্ষণ হতে পারে। জানুন কখন চিকিৎসকের কাছে যাওয়া উচিত।",
                "content": "বিড়ালের খাওয়া বন্ধ করা সবসময় চিন্তার বিষয়। এটি বিভিন্ন কারণে হতে পারে - স্ট্রেস, দাঁতের সমস্যা, পেটের অসুখ বা অন্যান্য স্বাস্থ্য সমস্যা। যদি আপনার বিড়াল ২৪ ঘণ্টার বেশি না খায়, তাহলে দ্রুত পশু চিকিৎসকের পরামর্শ নিন।",
                "image_url": "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800",
                "category": "বিড়ালের যত্ন",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "কুকুরের টিকা: কোন টিকা কখন দিতে হবে?",
                "excerpt": "আপনার কুকুরের জীবন বাঁচাতে টিকা অত্যন্ত গুরুত্বপূর্ণ। জেনে নিন সম্পূর্ণ টিকাসূচি।",
                "content": "কুকুরের টিকা তাদের মারাত্মক রোগ থেকে রক্ষা করে। জলাতঙ্ক, পারভো, ডিস্টেম্পার এবং অন্যান্য রোগ প্রতিরোধে টিকা অপরিহার্য। ৬-৮ সপ্তাহ বয়সে প্রথম টিকা দিতে হয় এবং বার্ষিক বুস্টার দেওয়া উচিত।",
                "image_url": "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800",
                "category": "কুকুরের যত্ন",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            },
            {
                "id": str(uuid.uuid4()),
                "title": "গরমে পোষা প্রাণীর যত্ন: হিটস্ট্রোক থেকে বাঁচান",
                "excerpt": "বাংলাদেশের গরমে পোষা প্রাণীরা হিটস্ট্রোকের শিকার হতে পারে। জানুন কীভাবে তাদের সুরক্ষিত রাখবেন।",
                "content": "গরমের দিনে পোষা প্রাণীদের বিশেষ যত্ন প্রয়োজন। সবসময় পরিষ্কার পানি রাখুন, ঠান্ডা জায়গায় থাকতে দিন এবং দুপুরে বাইরে নিয়ে যাওয়া এড়িয়ে চলুন। হাঁপানো, অতিরিক্ত লালা বা দুর্বলতা হিটস্ট্রোকের লক্ষণ।",
                "image_url": "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800",
                "category": "সাধারণ টিপস",
                "published": True,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
        ]
        for blog in sample_blogs:
            await db.blogs.insert_one(blog)
        logger.info("Seeded sample blog posts")
    
    # Create indexes
    await db.appointments.create_index("id", unique=True)
    await db.blogs.create_index("id", unique=True)
    await db.messages.create_index("id", unique=True)
    await db.admin_sessions.create_index("token_hash", unique=True)
    logger.info("Database indexes created")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
