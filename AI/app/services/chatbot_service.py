import httpx
from app.config import settings
import logging

logger = logging.getLogger(__name__)

GEMINI_CHAT_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"
GEMINI_COUNT_TOKENS_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:countTokens"

SYSTEM_PROMPT = """
Bạn là Trợ lý ảo chuyên trách Pháp lý Bất động sản của website RecoLand.

Nhiệm vụ cốt lõi: 
- Hỗ trợ người dùng tìm hiểu và giải đáp các thắc mắc chuyên sâu về khía cạnh pháp lý, thủ tục giấy tờ, thuế, phí và các quy định hiện hành liên quan đến mua bán, cho thuê nhà đất (ưu tiên bối cảnh thị trường bất động sản Đà Nẵng).
- Cung cấp kiến thức về quy trình sang tên Sổ Hồng/Sổ Đỏ, thủ tục công chứng, hợp đồng đặt cọc, tranh chấp quyền sử dụng đất, và cách kiểm tra quy hoạch.

Nguyên tắc hoạt động nghiêm ngặt:
- KHÔNG hướng dẫn người dùng các thao tác kỹ thuật trên website như: cách đăng tin, nạp tiền, các gói tin VIP hay phương thức thanh toán VNPay. Nếu người dùng hỏi các nội dung này, hãy từ chối khéo léo và hướng dẫn họ liên hệ với bộ phận CSKH của RecoLand để được hỗ trợ kỹ thuật.
- Luôn giữ thái độ thân thiện, chuyên nghiệp, khách quan và đáng tin cậy.
- Câu trả lời cần ngắn gọn, chia bố cục rõ ràng, dễ hiểu đối với người dân đại chúng và bắt buộc bằng tiếng Việt.
"""

def _to_gemini_contents(history: list[dict] | None, message: str) -> list[dict]:
    contents = []
    if history:
        for h in history:
            contents.append({"role": h["role"], "parts": [{"text": h["text"]}]})
    contents.append({"role": "user", "parts": [{"text": message}]})
    return contents

def count_tokens_from_input(contents: list[dict]) -> int:
    try:
        response = httpx.post(
            GEMINI_COUNT_TOKENS_URL,
            params={"key": settings.GEMINI_API_KEY},
            json={"contents": contents},
            timeout=10.0
        )
        response.raise_for_status()
        return response.json().get("totalTokens", 0)
    except Exception as e:
        logger.error(f"[Chatbot] Đếm token thất bại: {e}")
        return 0

def chat(message: str, history: list[dict] | None = None) -> str:
    contents = _to_gemini_contents(history, message)

    current_tokens = count_tokens_from_input([{"role": "user", "parts": [{"text": message}]}])
    logger.info(f"[Chatbot] Số token của message hiện tại: {current_tokens}")

    if history:
        history_contents = [{"role": h["role"], "parts": [{"text": h["text"]}]} for h in history]
        total_history_tokens = count_tokens_from_input(history_contents)
        logger.info(f"[Chatbot] Số token của lịch sử chat: {total_history_tokens}")
        if total_history_tokens > 8000:
            logger.info(f"[Chatbot] Lịch sử chat tiêu tốn: {total_history_tokens} token, vượt quá giới hạn 8000. Cần cắt bớt lịch sử.")

    try:
        response = httpx.post(
            GEMINI_CHAT_URL,
            params={"key": settings.GEMINI_API_KEY},
            json={
                "systemInstruction": {"parts": [{"text": SYSTEM_PROMPT}]},
                "contents": contents
            },
            timeout=30.0
        )
        response.raise_for_status()
        data = response.json()
        return data["candidates"][0]["content"]["parts"][0]["text"]
    except Exception as e:
        logger.error(f"[Chatbot] Gemini error: {e}")
        raise