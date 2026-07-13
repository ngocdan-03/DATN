from sentence_transformers import SentenceTransformer
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Load model 1 lần khi khởi động
_model = None

def get_model() -> SentenceTransformer:
    global _model
    if _model is None:
        logger.info(f"Loading model: {settings.MODEL_NAME}")
        _model = SentenceTransformer(settings.MODEL_NAME)
        logger.info("Model loaded successfully")
    return _model

def encode_post(post: dict) -> list[float]:
    """Encode bài đăng thành vector 384 chiều"""
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
    model = get_model()
    vector = model.encode(text.strip(), normalize_embeddings=True)
    return vector.tolist()

def encode_texts(texts: list[str]) -> list[list[float]]:
    """Encode nhiều text cùng lúc"""
    model = get_model()
    vectors = model.encode(texts, normalize_embeddings=True)
    return vectors.tolist()