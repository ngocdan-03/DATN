from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    QDRANT_HOST: str = os.getenv("QDRANT_HOST", "localhost")
    QDRANT_PORT: int = int(os.getenv("QDRANT_PORT", 6333))
    KAFKA_BOOTSTRAP_SERVERS: str = os.getenv("KAFKA_BOOTSTRAP_SERVERS", "localhost:9092")
    KAFKA_GROUP_ID: str = os.getenv("KAFKA_GROUP_ID", "ai-server-group")
    SPRING_BOOT_URL: str = os.getenv("SPRING_BOOT_URL", "http://localhost:8080/real-estate")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "paraphrase-multilingual-MiniLM-L12-v2")
    POST_COLLECTION: str = os.getenv("POST_COLLECTION", "posts")
    USER_COLLECTION: str = os.getenv("USER_COLLECTION", "users")
    VECTOR_SIZE: int = int(os.getenv("VECTOR_SIZE", 384))
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

settings = Settings()