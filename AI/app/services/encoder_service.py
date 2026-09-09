from fastembed import TextEmbedding
from app.config import settings
import numpy as np
import logging

logger = logging.getLogger(__name__)

_model = None

def get_model() -> TextEmbedding:
    global _model
    if _model is None:
        model_name = settings.MODEL_NAME
        if "/" not in model_name:
            model_name = f"sentence-transformers/{model_name}"
        logger.info(f"Loading model: {model_name}")
        _model = TextEmbedding(model_name=model_name, threads=1)
        logger.info("Model loaded successfully")
    return _model

def _normalize(vector) -> list[float]:
    vector = np.array(vector)
    norm = np.linalg.norm(vector)
    if norm > 0:
        vector = vector / norm
    return vector.tolist()

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
    vector = list(model.embed([text.strip()]))[0]
    return _normalize(vector)

def encode_texts(texts: list[str]) -> list[list[float]]:
    """Encode nhiều text cùng lúc"""
    model = get_model()
    vectors = list(model.embed(texts))
    return [_normalize(v) for v in vectors]