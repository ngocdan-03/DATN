from fastapi import APIRouter, HTTPException
from app.schemas.chatbot import ChatRequest, ChatResponse
from app.services.chatbot_service import chat
import logging

router = APIRouter(prefix="/api/chatbot", tags=["Chatbot"])
logger = logging.getLogger(__name__)

@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        reply = chat(message=request.message, history=request.history)
        return ChatResponse(reply=reply)
    except Exception as e:
        logger.error(f"[Chatbot] Error: {e}")
        raise HTTPException(status_code=500, detail="Lỗi khi xử lý tin nhắn")