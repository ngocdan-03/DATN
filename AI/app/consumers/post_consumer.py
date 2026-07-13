from kafka import KafkaConsumer
from app.schemas.models import PostApprovedEvent, PostDeletedEvent
from app.services.encoder_service import encode_post
from app.services.qdrant_service import upsert_post_vector, delete_post_vector
from app.config import settings
import json
import threading
import logging

logger = logging.getLogger(__name__)

def handle_post_approved(data: dict):
    try:
        event = PostApprovedEvent(**data)
        logger.info(f"[PostConsumer] Indexing post: {event.postId}")

        post_dict = {
            "title": event.title,
            "description": event.description,
            "propertyType": event.propertyType,
            "listingType": event.listingType,
            "area": event.area,
            "price": event.price,
            "wardName": event.wardName,
            "legalStatus": event.legalStatus,
        }

        vector = encode_post(post_dict)

        upsert_post_vector(
            post_id=event.postId,
            vector=vector,
            payload={
                "postId": event.postId,
                "propertyType": event.propertyType,
                "listingType": event.listingType,
                "wardName": event.wardName,
            }
        )
        logger.info(f"[PostConsumer] Indexed post {event.postId} successfully")

    except Exception as e:
        logger.error(f"[PostConsumer] Error handling approved post: {e}")

def handle_post_deleted(data: dict):
    try:
        event = PostDeletedEvent(**data)
        logger.info(f"[PostConsumer] Deleting post vector: {event.postId}")
        delete_post_vector(event.postId)
        logger.info(f"[PostConsumer] Deleted post vector {event.postId}")

    except Exception as e:
        logger.error(f"[PostConsumer] Error handling deleted post: {e}")

def start_post_approved_consumer():
    consumer = KafkaConsumer(
        "post_approved_topic",
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id=settings.KAFKA_GROUP_ID,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    logger.info("[PostConsumer] Listening on post_approved_topic...")
    for message in consumer:
        handle_post_approved(message.value)

def start_post_deleted_consumer():
    consumer = KafkaConsumer(
        "post_deleted_topic",
        bootstrap_servers=settings.KAFKA_BOOTSTRAP_SERVERS,
        group_id=settings.KAFKA_GROUP_ID,
        auto_offset_reset="earliest",
        enable_auto_commit=True,
        value_deserializer=lambda m: json.loads(m.decode("utf-8"))
    )
    logger.info("[PostConsumer] Listening on post_deleted_topic...")
    for message in consumer:
        handle_post_deleted(message.value)

def start_post_consumers():
    """Chạy 2 consumer trong thread riêng để không block main thread"""
    t1 = threading.Thread(target=start_post_approved_consumer, daemon=True)
    t2 = threading.Thread(target=start_post_deleted_consumer, daemon=True)
    t1.start()
    t2.start()
    logger.info("[PostConsumer] Both post consumers started")