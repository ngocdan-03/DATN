from kafka import KafkaConsumer
from app.schemas.models import InteractionEvent
from app.services.user_vector_service import recalculate_user_vector
from app.config import settings
import json
import threading
import logging

logger = logging.getLogger(__name__)

def handle_interaction(data: dict):
    try:
        event = InteractionEvent(**data)
        logger.info(
            f"[InteractionConsumer] userId={event.userId}, "
            f"postId={event.postId}, type={event.interactionType}, "
            f"action={event.action}"
        )

        recalculate_user_vector(
            user_id=event.userId,
            post_id=event.postId,
            interaction_type=event.interactionType,
            action=event.action
        )

    except Exception as e:
        logger.error(f"[InteractionConsumer] Error: {e}")

def start_interaction_consumer():
    consumer = KafkaConsumer(
        "user_interaction_topic",
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id=settings.KAFKA_GROUP_ID,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    logger.info("[InteractionConsumer] Listening on user_interaction_topic...")
    for message in consumer:
        handle_interaction(message.value)

def start_interaction_consumers():
    t = threading.Thread(target=start_interaction_consumer, daemon=True)
    t.start()
    logger.info("[InteractionConsumer] Interaction consumer started")