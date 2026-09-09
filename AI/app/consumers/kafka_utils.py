import json
from app.config import settings

def get_kafka_common_kwargs():
    """Cấu hình dùng chung cho mọi Kafka Consumer, tự thêm SASL_SSL nếu chạy trên Aiven"""
    kwargs = {
        "bootstrap_servers": settings.KAFKA_BOOTSTRAP_SERVERS,
        "group_id": settings.KAFKA_GROUP_ID,
        "auto_offset_reset": "earliest",
        "enable_auto_commit": True,
        "value_deserializer": lambda m: json.loads(m.decode("utf-8")),

        # ── CẤU HÌNH TRÁNH LỖI COMMIT FAILED / REBALANCE ──
        "session_timeout_ms": 45000,      # Tăng thời gian phát hiện mất kết nối lên 45s (mặc định 10s)
        "heartbeat_interval_ms": 10000,   # Nhịp gửi tín hiệu duy trì mỗi 10s
        "max_poll_interval_ms": 300000,   # Cho phép tối đa 5 phút xử lý xong một đợt bài viết
        "max_poll_records": 10            # Chỉ nhận tối đa 10 messages/lần để tránh bị nghẽn quá lâu
    }
    
    if settings.KAFKA_USERNAME:
        kwargs.update({
            "security_protocol": "SASL_SSL",
            "sasl_mechanism": "SCRAM-SHA-256",
            "sasl_plain_username": settings.KAFKA_USERNAME,
            "sasl_plain_password": settings.KAFKA_PASSWORD,
            "ssl_cafile": settings.KAFKA_CA_CERT_PATH,
        })
    return kwargs