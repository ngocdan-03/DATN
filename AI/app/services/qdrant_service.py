from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance, VectorParams, PointStruct,
    Filter, FieldCondition, MatchValue,
    UpdateStatus, PointIdsList, PayloadSchemaType
)
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# ── Singleton client ──
_client = None

def get_client() -> QdrantClient:
    global _client
    if _client is None:
        # Dùng port 443 (HTTPS chuẩn) thay vì 6333 vì Render free chặn port 6333
        qdrant_url = settings.QDRANT_URL.replace("https://", "").replace("http://", "").rstrip("/")
        _client = QdrantClient(
            host=qdrant_url,
            port=443,
            https=True,
            api_key=settings.QDRANT_API_KEY if settings.QDRANT_API_KEY else None,
            prefer_grpc=False,
            timeout=30,
        )
        logger.info(f"Connected to Qdrant at {qdrant_url}:443")
    return _client

def _ensure_payload_index(client, collection_name: str, field_name: str, schema_type: PayloadSchemaType):
    """Tạo payload index nếu chưa tồn tại"""
    try:
        collection_info = client.get_collection(collection_name)
        existing_indexes = collection_info.payload_schema or {}
        if field_name not in existing_indexes:
            client.create_payload_index(
                collection_name=collection_name,
                field_name=field_name,
                field_schema=schema_type,
            )
            logger.info(f"Created payload index: {collection_name}.{field_name} ({schema_type})")
        else:
            logger.info(f"Payload index already exists: {collection_name}.{field_name}")
    except Exception as e:
        logger.warning(f"Failed to create payload index {collection_name}.{field_name}: {e}")

def init_collections():
    """Tạo collection nếu chưa tồn tại khi khởi động"""
    client = get_client()

    # Collection cho bài đăng
    if not client.collection_exists(settings.POST_COLLECTION):
        client.create_collection(
            collection_name=settings.POST_COLLECTION,
            vectors_config=VectorParams(
                size=settings.VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )
        logger.info(f"Created collection: {settings.POST_COLLECTION}")

    # Tạo payload index cho các field dùng trong filter
    _ensure_payload_index(client, settings.POST_COLLECTION, "propertyType", PayloadSchemaType.KEYWORD)
    _ensure_payload_index(client, settings.POST_COLLECTION, "listingType", PayloadSchemaType.KEYWORD)

    # Collection cho user preference vector
    if not client.collection_exists(settings.USER_COLLECTION):
        client.create_collection(
            collection_name=settings.USER_COLLECTION,
            vectors_config=VectorParams(
                size=settings.VECTOR_SIZE,
                distance=Distance.COSINE
            )
        )
        logger.info(f"Created collection: {settings.USER_COLLECTION}")

# ── POST VECTOR ──

def upsert_post_vector(post_id: int, vector: list[float], payload: dict):
    """Thêm hoặc cập nhật vector bài đăng"""
    client = get_client()
    client.upsert(
        collection_name=settings.POST_COLLECTION,
        points=[
            PointStruct(
                id=post_id,
                vector=vector,
                payload=payload  # lưu thêm metadata để filter nếu cần
            )
        ]
    )
    logger.info(f"Upserted post vector: {post_id}")

def delete_post_vector(post_id: int):
    """Xóa vector bài đăng khỏi Qdrant"""
    client = get_client()
    client.delete(
        collection_name=settings.POST_COLLECTION,
        points_selector=PointIdsList(points=[post_id])
    )
    logger.info(f"Deleted post vector: {post_id}")

def search_similar_posts(post_id: int, limit: int = 6) -> list[int]:
    """Tìm bài đăng tương tự dựa vào vector của bài đó"""
    client = get_client()

    # Lấy vector của bài đang xem
    results = client.retrieve(
        collection_name=settings.POST_COLLECTION,
        ids=[post_id],
        with_vectors=True,
        with_payload=True
    )

    if not results:
        logger.warning(f"Post {post_id} not found in Qdrant")
        return []

    post_vector = results[0].vector
    post_payload = results[0].payload

    property_type = post_payload.get("propertyType")
    listing_type = post_payload.get("listingType")

    query_filter = Filter(
        must=[
            FieldCondition(key="propertyType", match=MatchValue(value=property_type)),
            FieldCondition(key="listingType", match=MatchValue(value=listing_type)),
        ]
    )

    # Tìm top-K bài tương tự, loại bài hiện tại ra
    similar = client.query_points(
        collection_name=settings.POST_COLLECTION,
        query=post_vector,
        query_filter=query_filter,
        limit=limit + 1,  # +1 vì sẽ exclude bài hiện tại
        score_threshold=0.5  # chỉ lấy bài có độ tương đồng > 50%
    ).points

    return [
        int(hit.id)
        for hit in similar
        if hit.id != post_id
    ][:limit]

# ── USER VECTOR ──

def upsert_user_vector(user_id: int, vector: list[float]):
    """Lưu user preference vector"""
    client = get_client()
    client.upsert(
        collection_name=settings.USER_COLLECTION,
        points=[
            PointStruct(
                id=user_id,
                vector=vector,
                payload={"userId": user_id}
            )
        ]
    )
    logger.info(f"Upserted user vector: {user_id}")

def get_user_vector(user_id: int) -> list[float] | None:
    """Lấy user preference vector"""
    client = get_client()
    results = client.retrieve(
        collection_name=settings.USER_COLLECTION,
        ids=[user_id],
        with_vectors=True
    )
    if not results:
        return None
    return results[0].vector

def search_posts_by_vector(vector: list[float], limit: int = 6) -> list[int]:
    """Tìm bài đăng phù hợp với user vector"""
    client = get_client()
    results = client.query_points(
        collection_name=settings.POST_COLLECTION,
        query=vector,
        limit=limit,
        score_threshold=0.4
    ).points
    return [int(hit.id) for hit in results]