import { postsService } from "../../../../services/postsService";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PostSidebar({ owner, favorite, postId }) {
    const navigate = useNavigate();
    const [isFavorite, setIsFavorite] = useState(favorite);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        setIsFavorite(favorite);
    }, [favorite]);

    const checkAuthAndRun = (callback) => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            navigate("/login", {
                state: {
                    from: { pathname: `/posts/${postId}` }
                }
             });
            return;
        }
        callback();
    };

    const handleToggleFavorite = () => {
        if (isActionLoading) return;
        checkAuthAndRun(async () => {
            try {
                setIsActionLoading(true);
                const result = await postsService.toggleFavorite(postId);
                if (result.code === 1000) {
                    setIsFavorite(!isFavorite);
                }
            } catch (error) {
                console.error("Lỗi khi cập nhật yêu thích:", error);
            } finally {
                setIsActionLoading(false);
            }
        });
    };

    const handleContact = (type, value) => {
        checkAuthAndRun(async () => {
            try {
                // Vẫn gọi API track để biết có bao nhiêu người muốn liên hệ
                await postsService.trackContact(postId);
                
                if (type === "zalo") {
                    window.open(`https://zalo.me/${value}`, '_blank');
                } else if (type === "mail") {
                    window.location.href = `mailto:${value}`;
                }
            } catch (error) {
                console.error("Lỗi khi theo dõi liên hệ:", error);
            }
        });
    };

    return (
        <aside className="w-full lg:w-96">
            <div className="bg-white p-6 rounded-3xl shadow-md border border-gray-100 sticky top-10">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Người đăng tin</h3>
                
                {/* Owner Info */}
                <div className="flex items-center gap-4 mb-8">
                    <img 
                        src={owner.avatarUrl} 
                        alt={owner.fullName} 
                        className="w-16 h-16 rounded-full object-cover border-2 border-[#cca830] p-0.5 shadow-sm" 
                    />
                    <div>
                        <p className="font-black text-[#041627] text-lg leading-tight">{owner.fullName}</p>
                    </div>
                </div>

                {/* Contact Actions: Zalo & Email */}
                <div className="space-y-3">
                    {/* Nút Nhắn tin Zalo - Màu xanh Zalo đặc trưng */}
                    <button 
                        onClick={() => handleContact('zalo', owner.phone)}
                        className="flex items-center justify-center gap-2 w-full bg-[#0068ff] text-white py-4 rounded-xl font-bold hover:bg-[#0052cc] transition-all active:scale-95 shadow-lg shadow-blue-500/20"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        Nhắn tin Zalo
                    </button>    

                    {/* Nút Gửi Email - Giữ nguyên style viền */}
                    <button 
                        onClick={() => handleContact('mail', owner.email)}
                        className="flex items-center justify-center gap-2 w-full border-2 border-[#e4e2e3] text-[#041627] py-4 rounded-xl font-bold hover:border-[#041627] transition-all active:scale-95"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        Gửi Email liên hệ
                    </button>
                </div>

                {/* Favorite Button */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <button
                        onClick={handleToggleFavorite}
                        disabled={isActionLoading} 
                        className={`flex items-center justify-center gap-2 w-full font-bold text-sm transition-all group ${
                            isActionLoading ? 'opacity-50 cursor-wait' : 'hover:text-red-500 text-gray-400'
                        }`}
                    >
                        <svg 
                            className={`w-6 h-6 transition-all group-hover:scale-110 ${
                                isActionLoading ? 'animate-pulse' : ''
                            } ${isFavorite ? 'fill-red-500 text-red-500' : 'fill-none'}`} 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span>{isFavorite ? 'Đã lưu vào yêu thích' : 'Lưu tin này'}</span>
                    </button>
                </div>
            </div>
        </aside>
    );
}