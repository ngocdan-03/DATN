from app.services.qdrant_service import (
    get_user_vector, upsert_user_vector, get_client
)
from app.config import settings
import numpy as np
import logging

logger = logging.getLogger(__name__)

INTERACTION_WEIGHTS = {
    "VIEW": 1,
    "SAVE": 3,
    "CONTACT": 5
}

# Hệ số học cơ bản — kiểm soát tốc độ thay đổi vector
BASE_LEARNING_RATE = 0.1
MAX_WEIGHT = max(INTERACTION_WEIGHTS.values())  # = 5

def recalculate_user_vector(
    user_id: int,
    post_id: int,
    interaction_type: str,
    action: str
):
    client = get_client()
    post_results = client.retrieve(
        collection_name=settings.POST_COLLECTION,
        ids=[post_id],
        with_vectors=True
    )

    if not post_results:
        logger.warning(f"Post {post_id} not found in Qdrant, skip update user vector")
        return

    post_vector = np.array(post_results[0].vector)
    weight = INTERACTION_WEIGHTS.get(interaction_type, 1)

    current_vector = get_user_vector(user_id)

    if current_vector is None:
        if action == "ADD":
            new_vector = post_vector
        else:
            return
    else:
        current = np.array(current_vector)

        alpha = BASE_LEARNING_RATE * (weight / MAX_WEIGHT)

        if action == "ADD":
            new_vector = (1 - alpha) * current + alpha * post_vector
        else:
            new_vector = (current - alpha * post_vector) / (1 - alpha)

    norm = np.linalg.norm(new_vector)
    if norm > 0:
        new_vector = new_vector / norm

    upsert_user_vector(user_id, new_vector.tolist())
    logger.info(
        f"Updated user vector: userId={user_id}, "
        f"postId={post_id}, type={interaction_type}, "
        f"action={action}, alpha={alpha:.3f}"
    )