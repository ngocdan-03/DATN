from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.routers import recommend
from app.routers import chatbot
from app.services.qdrant_service import init_collections
from app.consumers.post_consumer import start_post_consumers
from app.consumers.interaction_consumer import start_interaction_consumers
import logging
from fastapi.middleware.cors import CORSMiddleware

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # ── Startup ──
    logger.info("Starting AI server...")

    # 1. Tạo Qdrant collections nếu chưa có
    init_collections()

    # 2. Khởi động Kafka consumers trong background thread
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