from fastapi import APIRouter, HTTPException
from app.schemas.models import SimilarRequest, PersonalRequest, RecommendResponse
from app.services.qdrant_service import (
    search_similar_posts,
    get_user_vector,
    search_posts_by_vector
)
import logging

router = APIRouter(prefix="/recommend", tags=["Recommend"])
logger = logging.getLogger(__name__)

@router.post("/similar", response_model=RecommendResponse)
async def get_similar_posts(request: SimilarRequest):
    """
    Gợi ý bài đăng tương tự dựa vào vector của bài đang xem.
    Spring Boot gọi API này khi user vào trang chi tiết bài đăng.
    """
    try:
        post_ids = search_similar_posts(
            post_id=request.postId,
            limit=request.limit
        )

        if not post_ids:
            return RecommendResponse(postIds=[], fallback=True)

        return RecommendResponse(postIds=post_ids, fallback=False)

    except Exception as e:
        logger.error(f"[Recommend] Error getting similar posts: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/personal", response_model=RecommendResponse)
async def get_personal_recommendations(request: PersonalRequest):
    """
    Gợi ý bài đăng theo sở thích cá nhân.
    Spring Boot gọi API này khi user đã đăng nhập vào trang chủ.
    fallback=True → user chưa có lịch sử, Spring Boot tự lấy bài mới nhất.
    """
    try:
        user_vector = get_user_vector(request.userId)

        if user_vector is None:
            logger.info(f"[Recommend] User {request.userId} has no vector, fallback")
            return RecommendResponse(postIds=[], fallback=True)

        post_ids = search_posts_by_vector(
            vector=user_vector,
            limit=request.limit
        )

        if not post_ids:
            return RecommendResponse(postIds=[], fallback=True)

        return RecommendResponse(postIds=post_ids, fallback=False)

    except Exception as e:
        logger.error(f"[Recommend] Error getting personal recommendations: {e}")
        raise HTTPException(status_code=500, detail=str(e))