import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.consumers.interaction_consumer import start_interaction_consumers
from app.consumers.post_consumer import start_post_consumers
from app.routers import chatbot, recommend
from app.services.encoder_service import get_model  
from app.services.qdrant_service import init_collections

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    logger.info("Starting AI server...")

    # 1. Gemini Embedding API — không cần nạp model vào RAM
    logger.info("Using Gemini Embedding API — no local model to load")
    get_model()

    # 2. Tạo Qdrant collections nếu chưa có
    init_collections()

    # 3. Khởi động Kafka consumers sau khi model đã nằm sẵn trong RAM
    start_post_consumers()
    start_interaction_consumers()

    logger.info("AI server started successfully")
    yield

    # ── Shutdown ──
    logger.info("Shutting down AI server...")

app = FastAPI(
    title="Real Estate AI Server",
    description="AI recommendation service for real estate platform",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recommend.router)
app.include_router(chatbot.router)

@app.get("/health")
async def health_check():
    return {"status": "ok"}