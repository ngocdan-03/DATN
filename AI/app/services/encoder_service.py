import httpx
import numpy as np
import logging
from app.config import settings

logger = logging.getLogger(__name__)

GEMINI_EMBED_URL = (
    "https://generativelanguage.googleapis.com/v1beta/"
    "models/text-embedding-004:embedContent"
)

def _normalize(vector) -> list[float]:
    vector = np.array(vector)
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

def _call_gemini_embed(text: str, task_type: str = "RETRIEVAL_DOCUMENT") -> list[float]:
    """Gọi Gemini Embedding API để encode text thành vector 384 chiều"""
    response = httpx.post(
        GEMINI_EMBED_URL,
        params={"key": settings.GEMINI_API_KEY},
        json={
            "model": "models/text-embedding-004",
            "content": {
                "parts": [{"text": text}]
            },
            "outputDimensionality": settings.VECTOR_SIZE,  # 384
            "taskType": task_type,
        },
        timeout=30.0,
    )
    response.raise_for_status()
    data = response.json()
    return data["embedding"]["values"]

def get_model():
    """Không cần load model nữa — dùng Gemini API"""
    logger.info("Using Gemini Embedding API (text-embedding-004) — no local model needed")

def encode_post(post: dict) -> list[float]:
    """Encode bài đăng thành vector 384 chiều qua Gemini API"""
    text = (
        f"Loại bất động sản: {post.get('propertyType', '')}. "
        f"Hình thức: {post.get('listingType', '')}. "
        f"Khu vực: {post.get('wardName', '')}. "
        f"Diện tích: {post.get('area', 0)} m2. "
        f"Giá: {post.get('price', 0)} VND. "
        f"Pháp lý: {post.get('legalStatus', '')}. "
        f"{post.get('title', '')}. "
        f"{post.get('description', '')}."
    )
    vector = _call_gemini_embed(text.strip(), task_type="RETRIEVAL_DOCUMENT")
    return _normalize(vector)

def encode_texts(texts: list[str]) -> list[list[float]]:
    """Encode nhiều text cùng lúc"""
    results = []
    for text in texts:
        vector = _call_gemini_embed(text, task_type="RETRIEVAL_DOCUMENT")
        results.append(_normalize(vector))
    return results