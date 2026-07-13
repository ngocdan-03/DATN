import google.generativeai as genai
from app.config import settings
import logging

logger = logging.getLogger(__name__)

genai.configure(api_key=settings.GEMINI_API_KEY)

# System prompt định hướng Chatbot chuyên gia pháp lý cho RecoLand
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

_model = None

def get_model():
    global _model
    if _model is None:
        _model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=SYSTEM_PROMPT
        )
    return _model

def count_tokens_from_input(content: str | list) -> int:
    """
    Hàm tính toán chính xác số token của một chuỗi văn bản hoặc một mảng lịch sử chat.
    """
    model = get_model()
    try:
        # Gọi hàm count_tokens có sẵn từ SDK Google để băm thử dữ liệu
        response = model.count_tokens(content)
        return response.total_tokens
    except Exception as e:
        logger.error(f"[Chatbot] Đếm token thất bại: {e}")
        return 0

def chat(message: str, history: list[dict] | None = None) -> str:
    model = get_model()

    # Convert history sang format Gemini
    gemini_history = []
    if history:
        for h in history:
            gemini_history.append({
                "role": h["role"],  # "user" hoặc "model"
                "parts": [h["text"]]
            })

    # đếm token của message
    current_message_tokens = count_tokens_from_input(message)
    logger.info(f"[Chatbot] Số token của message hiện tại: {current_message_tokens}")

    # đếm token của lịch sử chat
    if gemini_history:
        total_history_tokens = count_tokens_from_input(gemini_history)
        logger.info(f"[Chatbot] Số token của lịch sử chat: {total_history_tokens}")
        if total_history_tokens > 8000:
            logger.info(f"[Chatbot] Lịch sử chat tiêu tốn: {total_history_tokens} token, vượt quá giới hạn 8000 token. Cần cắt bớt lịch sử.")

    chat_session = model.start_chat(history=gemini_history)

    try:
        response = chat_session.send_message(message)
        return response.text
    except Exception as e:
        logger.error(f"[Chatbot] Gemini error: {e}")
        raise