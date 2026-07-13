import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import BackButton from '../../components/common/BackButton';

// ── Format timestamp ──
function formatTime(date) {
  return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
}

// ── Topic button ──
function TopicChip({ label, icon, desc, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 group ${
        disabled
          ? 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-60'
          : 'border-slate-200 bg-white hover:border-[#cca830]/50 hover:bg-[#cca830]/5 hover:shadow-sm cursor-pointer active:scale-[0.98]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5 flex-none">{icon}</span>
        <div>
          <p className={`text-xs font-bold leading-snug ${disabled ? 'text-slate-400' : 'text-[#041627] group-hover:text-[#b08f25]'}`}>{label}</p>
          <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{desc}</p>
        </div>
      </div>
    </button>
  );
}

const topics = [
  {
    icon: '📋',
    label: 'Thủ tục cấp Sổ Hồng',
    desc: 'Hồ sơ, thời gian, cơ quan thụ lý',
    prompt: 'Thủ tục cấp Sổ Hồng tại Đà Nẵng gồm những bước nào? Cần chuẩn bị hồ sơ gì?'
  },
  {
    icon: '🤝',
    label: 'Hợp đồng đặt cọc',
    desc: 'Điều khoản, rủi ro, mất cọc',
    prompt: 'Hợp đồng đặt cọc mua nhà cần có những điều khoản nào? Khi nào bên mua bị mất cọc?'
  },
  {
    icon: '💰',
    label: 'Thuế & Phí chuyển nhượng',
    desc: 'Thuế TNCN, lệ phí trước bạ, công chứng',
    prompt: 'Khi mua bán bất động sản tại Đà Nẵng cần đóng những loại thuế và phí nào? Tính như thế nào?'
  },
  {
    icon: '🏗️',
    label: 'Quy hoạch Đà Nẵng 2030',
    desc: 'Đất quy hoạch, hạn chế giao dịch',
    prompt: 'Làm thế nào để kiểm tra đất có nằm trong quy hoạch tại Đà Nẵng? Ảnh hưởng đến giao dịch như thế nào?'
  },
  {
    icon: '🏠',
    label: 'Mua nhà chung cư',
    desc: 'Hợp đồng mua bán, tranh chấp phí dịch vụ',
    prompt: 'Mua căn hộ chung cư cần lưu ý gì về hợp đồng và quyền lợi pháp lý của người mua?'
  },
  {
    icon: '📝',
    label: 'Tặng cho, thừa kế nhà đất',
    desc: 'Thủ tục, thuế, tranh chấp thừa kế',
    prompt: 'Thủ tục tặng cho nhà đất hoặc chia thừa kế tài sản là bất động sản tại Đà Nẵng như thế nào?'
  },
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    {
      id: 'init-bot',
      role: 'bot',
      content: 'Xin chào! Tôi là Trợ lý Pháp lý AI của RecoLand.\n\nTôi có thể giải đáp các thắc mắc về thủ tục nhà đất, hợp đồng, thuế phí và quy hoạch tại Đà Nẵng. Bạn muốn tìm hiểu vấn đề gì?',
      timestamp: new Date()
    }
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== 'init-bot')
        .map((m) => ({
          role: m.role === 'user' ? 'user' : 'model',
          text: m.content
        }));

      const response = await axios.post('http://localhost:8000/api/chatbot/chat', {
        message: messageText,
        history
      });

      if (response.data && response.data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `bot-${Date.now()}`,
            role: 'bot',
            content: response.data.reply,
            timestamp: new Date()
          }
        ]);
      } else {
        throw new Error("Không tìm thấy trường 'reply' trong phản hồi của Server");
      }
    } catch (error) {
      console.error("Lỗi kết nối bộ tư vấn pháp lý AI:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          role: 'bot',
          content: 'Xin lỗi bạn, hệ thống đang bận hoặc gặp sự cố kết nối. Vui lòng thử lại câu hỏi trong giây lát!',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <main className="min-h-screen bg-[#f8f7f8] pb-20 pt-6">
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.4; }
          40% { transform: scale(1); opacity: 1; }
        }
        .msg-enter { animation: fadeUp 0.25s ease forwards; }
        .dot-blink { animation: blink 1.2s ease-in-out infinite; }
      `}</style>

      <div className="mx-auto max-w-7xl px-6 md:px-10">

        {/* ── Header ── */}
        <div className="mb-8 flex items-center justify-between">
          <BackButton />
          <div className="text-right">
            <h1 className="text-2xl font-black text-[#041627] [font-family:Noto_Serif]">Trợ lý Pháp lý AI</h1>
            <p className="text-sm text-slate-400 font-medium">Powered by Gemini.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ══════════════════════════════════════
              CỘT TRÁI — Khung chat
          ══════════════════════════════════════ */}
          <div className="lg:col-span-8 flex flex-col h-[680px] bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">

            {/* Bot header */}
            <div className="flex items-center gap-3 px-5 py-4 bg-[#041627] border-b border-white/10">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#cca830] flex items-center justify-center text-xl shadow-inner">⚖️</div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-[#041627]" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-white [font-family:Manrope]">AI Legal Advisor</p>
                <p className="text-[11px] text-emerald-400 font-semibold">Đang trực tuyến · phản hồi tức thì</p>
              </div>
              {/* Message count badge */}
              <div className="bg-white/10 px-3 py-1 rounded-full">
                <span className="text-[11px] font-bold text-white/70">{messages.length} tin nhắn</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-5 py-6 space-y-5 overflow-y-auto scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 msg-enter ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {/* Bot avatar */}
                  {msg.role === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-[#041627] flex items-center justify-center text-sm flex-none mt-1">⚖️</div>
                  )}

                  <div className="flex flex-col gap-1 max-w-[78%]">
                    <div className={`px-4 py-3 text-sm leading-relaxed whitespace-pre-line shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-[#041627] text-white rounded-2xl rounded-tr-sm'
                        : 'bg-slate-50 border border-slate-200/80 text-slate-700 rounded-2xl rounded-tl-sm'
                    }`}>
                      {msg.content}
                    </div>
                    <p className={`text-[10px] font-medium text-slate-400 ${msg.role === 'user' ? 'text-right' : 'text-left pl-1'}`}>
                      {formatTime(msg.timestamp)}
                    </p>
                  </div>

                  {/* User avatar */}
                  {msg.role === 'user' && (
                    <div className="w-8 h-8 rounded-xl bg-[#cca830] flex items-center justify-center text-sm flex-none mt-1 font-black text-[#041627]">U</div>
                  )}
                </div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <div className="flex gap-3 justify-start msg-enter">
                  <div className="w-8 h-8 rounded-xl bg-[#041627] flex items-center justify-center text-sm flex-none">⚖️</div>
                  <div className="bg-slate-50 border border-slate-200/80 px-4 py-3.5 rounded-2xl rounded-tl-sm shadow-sm flex items-center gap-1.5">
                    {[0, 150, 300].map((delay, i) => (
                      <span
                        key={i}
                        className="w-2 h-2 bg-slate-400 rounded-full dot-blink"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input bar */}
            <div className="px-4 py-4 bg-white border-t border-slate-100">
              <div className={`flex gap-2 bg-slate-100 rounded-2xl px-2 py-2 transition-all duration-200 ${
                isLoading ? 'opacity-70' : 'focus-within:ring-2 focus-within:ring-[#041627]/15 focus-within:bg-slate-50'
              }`}>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  disabled={isLoading}
                  placeholder={isLoading ? 'Trợ lý đang tra cứu điều luật...' : 'Nhập câu hỏi pháp lý của bạn...'}
                  className="flex-1 bg-transparent px-3 py-1.5 text-sm outline-none disabled:cursor-not-allowed text-slate-800 placeholder:text-slate-400 font-medium"
                />
                <button
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className={`flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200 flex-none ${
                    isLoading || !input.trim()
                      ? 'bg-slate-300 text-white cursor-not-allowed'
                      : 'bg-[#041627] text-white hover:bg-[#cca830] active:scale-90'
                  }`}
                >
                  <svg className="w-4 h-4 rotate-90" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
              <p className="text-[10px] text-slate-400 text-center mt-2">Enter để gửi · AI trả lời dựa trên dữ liệu pháp luật Việt Nam</p>
            </div>
          </div>

          {/* ══════════════════════════════════════
              CỘT PHẢI — Sidebar
          ══════════════════════════════════════ */}
          <aside className="lg:col-span-4 space-y-5">

            {/* Topics */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-5 bg-[#cca830] rounded-full flex-none" />
                <h3 className="font-black text-sm text-[#041627] [font-family:Manrope]">Chủ đề thường gặp</h3>
              </div>
              <div className="space-y-2">
                {topics.map((t, i) => (
                  <TopicChip
                    key={i}
                    icon={t.icon}
                    label={t.label}
                    desc={t.desc}
                    disabled={isLoading}
                    onClick={() => handleSendMessage(t.prompt)}
                  />
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-3xl border border-[#cca830]/25 bg-[#cca830]/5 p-5">
              <div className="flex items-center gap-2 mb-3">
                <svg className="w-4 h-4 text-[#8a6f00] flex-none" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <p className="text-xs font-bold text-[#8a6f00]">Lưu ý quan trọng</p>
              </div>
              <p className="text-[11px] text-[#8a6f00]/80 leading-relaxed">
                Thông tin từ AI chỉ mang tính <strong>tham khảo</strong>. Luật đất đai có thể thay đổi theo thời điểm và quy định địa phương. Vui lòng liên hệ <strong>cơ quan chức năng hoặc luật sư</strong> trước khi thực hiện giao dịch tài chính.
              </p>
            </div>

            {/* Quick stats */}
            <div className="bg-[#041627] rounded-3xl p-5 grid grid-cols-2 gap-4">
              {[
                { value: '24/7', label: 'Hỗ trợ' },
                { value: 'Miễn phí', label: 'Chi phí' },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-lg font-black text-[#cca830] [font-family:Manrope]">{s.value}</p>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </aside>

        </div>
      </div>
    </main>
  );
}
