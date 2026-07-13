from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

# ── Nhận từ Kafka ──
class PostApprovedEvent(BaseModel):
    postId: int
    title: str
    description: str
    propertyType: str
    listingType: str
    area: float
    price: float
    wardName: str
    legalStatus: str

class PostDeletedEvent(BaseModel):
    postId: int

class InteractionEvent(BaseModel):
    userId: int
    postId: int
    interactionType: str   # VIEW, SAVE, CONTACT
    action: str            # ADD, REMOVE
    timestamp: str

# ── Request từ Spring Boot ──
class SimilarRequest(BaseModel):
    postId: int
    limit: int = 6

class PersonalRequest(BaseModel):
    userId: int
    limit: int = 6

# ── Response ──
class RecommendResponse(BaseModel):
    postIds: list[int]
    fallback: bool = False