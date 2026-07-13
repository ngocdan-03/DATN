import React, { useState, useRef } from 'react';
import { Camera, ShieldCheck, CreditCard, Loader2 } from 'lucide-react';
import { formatCurrencyVND } from "../../../utils/format";
import { userService } from "../../../services/usersService";
import AppModal from "../../modals/AppModal";

export default function SettingSidebar({ user, onRefresh }) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    // State quản lý AppModal thông báo
    const [modal, setModal] = useState({
        open: false,
        type: 'info',
        title: '',
        message: ''
    });

    const handleTriggerUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Kiểm tra định dạng file
        if (!file.type.startsWith('image/')) {
            setModal({
                open: true,
                type: 'warning',
                title: 'Định dạng không hỗ trợ',
                message: 'Vui lòng chỉ chọn các tệp tin hình ảnh (jpg, png, webp...).'
            });
            return;
        }

        try {
            setUploading(true);
            const res = await userService.uploadAvatar(file);
            
            if (res.code === 1000) {
                // Gọi hàm load lại data từ Component cha
                if (onRefresh) await onRefresh();
                
                setModal({
                    open: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Ảnh đại diện của bạn đã được cập nhật mới!'
                });
            }
        } catch (error) {
            setModal({
                open: true,
                type: 'error',
                title: 'Lỗi tải lên',
                message: error.message || 'Không thể cập nhật ảnh đại diện lúc này. Vui lòng thử lại sau.'
            });
        } finally {
            setUploading(false);
            e.target.value = null; // Reset input
        }
    };

    const closeModal = () => setModal(prev => ({ ...prev, open: false }));

    return (
        <div className="space-y-6 font-[Manrope]">
            {/* Thẻ Avatar */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-white p-8 text-center shadow-sm">
                <div className="relative mx-auto h-32 w-32">
                    <input 
                        type="file" 
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                    />
                    
                    <div className="h-full w-full overflow-hidden rounded-full border-4 border-slate-50 shadow-md bg-slate-100 relative group">
                        {uploading && (
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
                                <Loader2 className="animate-spin text-blue-600" size={24} />
                            </div>
                        )}
                        
                        <img 
                            src={user?.avatarUrl} 
                            alt="Avatar" 
                            className={`h-full w-full object-cover transition-all duration-500 ${uploading ? 'scale-110 blur-[1px]' : 'group-hover:scale-110'}`}
                        />
                    </div>

                    <button 
                        onClick={handleTriggerUpload}
                        disabled={uploading}
                        className="absolute bottom-0 right-0 z-20 rounded-full bg-blue-600 p-2.5 text-white shadow-lg hover:bg-blue-700 hover:scale-110 transition-all border-2 border-white disabled:bg-slate-300 disabled:scale-100"
                    >
                        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                    </button>
                </div>
                
                <h3 className="mt-5 text-xl font-black text-slate-800 tracking-tight">{user?.fullName}</h3>
                <p className="text-sm font-medium text-slate-400">{user?.email}</p>
                
                <div className="mt-6 flex items-center justify-center">
                    {user?.isVerified ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 border border-emerald-100">
                            <ShieldCheck size={14} /> Đã xác thực
                        </span>
                    ) : (
                        <span className="rounded-full bg-slate-100 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-400 border border-slate-200">
                            Chưa xác thực
                        </span>
                    )}
                </div>
            </section>

            {/* Thẻ Số dư */}
            <section className="rounded-[2.5rem] border border-slate-200 bg-[#041627] p-8 text-white shadow-xl shadow-blue-900/10">
                <div className="flex items-center gap-3 text-blue-400/80 mb-5">
                    <div className="rounded-lg bg-blue-500/10 p-2">
                        <CreditCard size={20} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.15em]">Số dư khả dụng</span>
                </div>
                <p className="text-3xl font-black tracking-tight">
                    {formatCurrencyVND(user?.balance)}
                </p>
            </section>

            {/* AppModal thay thế cho Toast */}
            <AppModal 
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                confirmText="Đồng ý"
                onClose={closeModal}
                onConfirm={closeModal}
            />
        </div>
    );
}