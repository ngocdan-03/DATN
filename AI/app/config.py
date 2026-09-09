from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    # ===== SỬA: Qdrant Cloud dùng URL + API Key thay vì host/port =====
    QDRANT_URL: str = os.getenv("QDRANT_URL", "http://localhost:6333")
    QDRANT_API_KEY: str = os.getenv("QDRANT_API_KEY", "")

    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_GROUP_ID: str = os.getenv("KAFKA_GROUP_ID", "ai-server-group")

    # ===== THÊM MỚI: cấu hình SASL_SSL cho Aiven Kafka =====
    KAFKA_USERNAME: str = os.getenv("KAFKA_USERNAME", "")
    KAFKA_PASSWORD: str = os.getenv("KAFKA_PASSWORD", "")
    KAFKA_CA_CERT_PATH: str = os.getenv("KAFKA_CA_CERT_PATH", "")

    SPRING_BOOT_URL: str = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/real-estate")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "paraphrase-multilingual-MiniLM-L12-v2")
    POST_COLLECTION: str = os.getenv("POST_COLLECTION", "posts")
    USER_COLLECTION: str = os.getenv("USER_COLLECTION", "users")
    VECTOR_SIZE: int = int(os.getenv("VECTOR_SIZE", 384))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()