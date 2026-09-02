from pathlib import Path
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / ".env")

import os
import io
import csv
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

import bcrypt
import jwt
from bson import ObjectId
from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from fastapi.responses import StreamingResponse
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas as pdf_canvas

from seed_data import ANNOUNCEMENTS, NEWS, QUIZ_QUESTIONS, RESOURCES

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]
JWT_ALGORITHM = "HS256"

app = FastAPI()
api_router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)


# ---------- Auth ----------
def hash_password(p: str) -> str:
    return bcrypt.hashpw(p.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(p: str, h: str) -> bool:
    return bcrypt.checkpw(p.encode("utf-8"), h.encode("utf-8"))


def create_access_token(user_id: str, email: str) -> str:
    payload = {"sub": user_id, "email": email, "type": "access",
               "exp": datetime.now(timezone.utc) + timedelta(hours=2)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_current_admin(request: Request) -> dict:
    token = request.cookies.get("access_token")
    auth = request.headers.get("Authorization", "")
    if not token and auth.startswith("Bearer "):
        token = auth[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    if not user or user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Forbidden")
    return {"id": str(user["_id"]), "email": user["email"], "role": "admin"}


class LoginInput(BaseModel):
    email: str
    password: str


@api_router.post("/auth/login")
async def login(input: LoginInput, request: Request, response: Response):
    email = input.email.lower().strip()
    ip = request.client.host if request.client else "unknown"
    ident = f"{ip}:{email}"
    attempts = await db.login_attempts.find_one({"identifier": ident})
    if attempts and attempts.get("count", 0) >= 5:
        locked_until = attempts.get("locked_until")
        if locked_until and datetime.fromisoformat(locked_until) > datetime.now(timezone.utc):
            raise HTTPException(status_code=429, detail="Too many failed attempts. Try again in 15 minutes.")
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(input.password, user["password_hash"]):
        await db.login_attempts.update_one(
            {"identifier": ident},
            {"$inc": {"count": 1},
             "$set": {"locked_until": (datetime.now(timezone.utc) + timedelta(minutes=15)).isoformat()}},
            upsert=True)
        raise HTTPException(status_code=401, detail="Invalid email or password")
    await db.login_attempts.delete_one({"identifier": ident})
    token = create_access_token(str(user["_id"]), email)
    response.set_cookie("access_token", token, httponly=True, secure=True,
                        samesite="none", max_age=7200, path="/")
    return {"token": token, "user": {"email": email, "name": user.get("name", "Admin"), "role": "admin"}}


@api_router.post("/auth/logout")
async def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return {"ok": True}


@api_router.get("/auth/me")
async def me(admin=Depends(get_current_admin)):
    return admin


# ---------- Public content ----------
@api_router.get("/")
async def root():
    return {"message": "TSSD API online"}


@api_router.get("/announcements")
async def get_announcements():
    return await db.announcements.find({"active": True}, {"_id": 0}).to_list(50)


@api_router.get("/news")
async def get_news():
    return await db.news.find({}, {"_id": 0}).sort("date", -1).to_list(100)


@api_router.get("/quiz/questions")
async def get_quiz_questions():
    return await db.quiz_questions.find({}, {"_id": 0}).to_list(50)


class QuizResultInput(BaseModel):
    score: int
    total: int
    lang: str = "en"


@api_router.post("/quiz/results")
async def save_quiz_result(input: QuizResultInput):
    doc = input.model_dump()
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    await db.quiz_results.insert_one(doc)
    return {"ok": True}


@api_router.get("/resources")
async def get_resources():
    return await db.resources.find({}, {"_id": 0, "body_en": 0}).to_list(100)


def _wrap(text: str, width: int = 90):
    words, lines, cur = text.split(), [], ""
    for w in words:
        if len(cur) + len(w) + 1 > width:
            lines.append(cur)
            cur = w
        else:
            cur = f"{cur} {w}".strip()
    if cur:
        lines.append(cur)
    return lines


@api_router.get("/resources/{rid}/download")
async def download_resource(rid: str):
    doc = await db.resources.find_one({"rid": rid})
    if not doc:
        raise HTTPException(status_code=404, detail="Resource not found")
    buf = io.BytesIO()
    c = pdf_canvas.Canvas(buf, pagesize=A4)
    w, h = A4
    y = h - 80
    c.setFont("Helvetica-Bold", 18)
    c.drawString(60, y, "Traffic Safety Services Department")
    y -= 30
    c.setFont("Helvetica-Bold", 14)
    c.drawString(60, y, doc["title"]["en"])
    y -= 16
    c.setFont("Helvetica", 9)
    c.drawString(60, y, f"Official publication - Updated {doc.get('updated', '')}")
    y -= 30
    c.setFont("Helvetica", 11)
    for line in _wrap(doc.get("body_en", "")):
        if y < 80:
            c.showPage()
            c.setFont("Helvetica", 11)
            y = h - 80
        c.drawString(60, y, line)
        y -= 16
    c.setFont("Helvetica-Oblique", 8)
    c.drawString(60, 40, "Issued by the Traffic Safety Services Department. Drive safe.")
    c.save()
    buf.seek(0)
    return StreamingResponse(buf, media_type="application/pdf",
                             headers={"Content-Disposition": f'attachment; filename="{rid}.pdf"'})


# ---------- Enquiries ----------
class EnquiryInput(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    type: str = "general"
    subject: str
    message: str


@api_router.post("/enquiries")
async def create_enquiry(input: EnquiryInput):
    doc = input.model_dump()
    doc["status"] = "pending"
    doc["created_at"] = datetime.now(timezone.utc).isoformat()
    result = await db.enquiries.insert_one(doc)
    return {"ok": True, "id": str(result.inserted_id)}


@api_router.get("/enquiries")
async def list_enquiries(admin=Depends(get_current_admin)):
    rows = await db.enquiries.find().sort("created_at", -1).to_list(1000)
    for r in rows:
        r["id"] = str(r.pop("_id"))
    return rows


class EnquiryStatusInput(BaseModel):
    status: str


@api_router.patch("/enquiries/{enquiry_id}")
async def update_enquiry(enquiry_id: str, input: EnquiryStatusInput, admin=Depends(get_current_admin)):
    if input.status not in ("pending", "in_progress", "resolved"):
        raise HTTPException(status_code=400, detail="Invalid status")
    result = await db.enquiries.update_one({"_id": ObjectId(enquiry_id)},
                                           {"$set": {"status": input.status}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return {"ok": True}


@api_router.get("/enquiries/export")
async def export_enquiries(admin=Depends(get_current_admin)):
    rows = await db.enquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(5000)
    output = io.StringIO()
    fields = ["name", "email", "phone", "type", "subject", "message", "status", "created_at"]
    writer = csv.DictWriter(output, fieldnames=fields)
    writer.writeheader()
    for r in rows:
        writer.writerow({f: r.get(f, "") for f in fields})
    return StreamingResponse(iter([output.getvalue()]), media_type="text/csv",
                             headers={"Content-Disposition": "attachment; filename=enquiries.csv"})


app.include_router(api_router)

frontend_url = os.environ.get("FRONTEND_URL", "")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_url, "http://localhost:3000"] if frontend_url else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")


@app.on_event("startup")
async def seed():
    await db.users.create_index("email", unique=True)
    await db.login_attempts.create_index("identifier")

    admin_email = os.environ.get("ADMIN_EMAIL", "admin@example.com").lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({"email": admin_email, "password_hash": hash_password(admin_password),
                                   "name": "TSSD Administrator", "role": "admin",
                                   "created_at": datetime.now(timezone.utc)})
        logger.info("Seeded admin user %s", admin_email)
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one({"email": admin_email},
                                  {"$set": {"password_hash": hash_password(admin_password)}})

    if await db.announcements.count_documents({}) == 0:
        await db.announcements.insert_many(ANNOUNCEMENTS)
    if await db.news.count_documents({}) == 0:
        await db.news.insert_many(NEWS)
    if await db.quiz_questions.count_documents({}) == 0:
        await db.quiz_questions.insert_many(QUIZ_QUESTIONS)
    if await db.resources.count_documents({}) == 0:
        await db.resources.insert_many(RESOURCES)
    logger.info("Seed check complete")


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
