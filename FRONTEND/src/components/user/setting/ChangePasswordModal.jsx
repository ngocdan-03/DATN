import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { X, Lock, ShieldCheck, Eye, EyeOff, Loader2 } from 'lucide-react';
import { authValidationSchemas } from '../../../validation';
import { userService } from '../../../services/usersService';
import AppModal from '../../modals/AppModal';

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });
    const [loading, setLoading] = useState(false);

    // State quản lý thông báo phản hồi qua AppModal
    const [responseModal, setResponseModal] = useState({
        open: false,
        type: 'info',
        message: '',
        title: ''
    });

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(authValidationSchemas.changePasswordSchema),
        mode: 'onTouched',
    });

    // Nếu cả hai modal đều đóng thì không render gì cả
    if (!isOpen && !responseModal.open) return null;

    const onSubmit = async (data) => {
        try {
            setLoading(true);
            const response = await userService.changePassword({
                oldPassword: data.oldPassword,
                newPassword: data.newPassword,
            });

            if (response.code === 1000) {
                // 1. Đóng modal nhập liệu ngay lập tức để tránh chồng lấn
                onClose(); 
                
                // 2. Hiển thị thông báo thành công qua AppModal
                setResponseModal({
                    open: true,
                    type: 'success',
                    title: 'Đổi mật khẩu thành công',
                    message: 'Mật khẩu của bạn đã được cập nhật. Vui lòng ghi nhớ mật khẩu mới cho lần đăng nhập sau.'
                });
                reset();
            }
        } catch (error) {
            // Trường hợp lỗi: Giữ nguyên modal nhập liệu, hiện AppModal đè lên trên (z-index cao hơn)
            setResponseModal({
                open: true,
                type: 'error',
                title: 'Thao tác thất bại',
                message: error.message || 'Mật khẩu cũ không chính xác hoặc có lỗi hệ thống xảy ra.'
            });
        } finally {
            setLoading(false);
        }
    };

    const toggleShow = (field) => setShowPass((prev) => ({ ...prev, [field]: !prev[field] }));

    const handleCloseResponse = () => {
        setResponseModal((prev) => ({ ...prev, open: false }));
        // Nếu là lỗi, người dùng nhấn "Đã hiểu" sẽ quay lại form nhập liệu (vẫn đang mở)
        // Nếu là thành công, form nhập liệu đã được đóng từ trước trong hàm onSubmit
    };

    return (
        <>
            {/* Modal Nhập Liệu Chính - z-index: 110 */}
            {isOpen && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 font-[Manrope]">
                    <div className="relative w-full max-w-md animate-in zoom-in-95 duration-200 bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">
                        <button 
                            type="button"
                            onClick={onClose} 
                            className="absolute right-6 top-6 z-10 text-white/70 hover:text-white transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <div className="bg-[#041627] p-8 text-center text-white">
                            <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
                                <Lock size={32} className="text-blue-400" />
                            </div>
                            <h2 className="text-xl font-black uppercase tracking-widest">Đổi mật khẩu</h2>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
                            {/* Old Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Mật khẩu hiện tại</label>
                                <div className="relative group">
                                    <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.oldPassword ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                    <input 
                                        type={showPass.old ? "text" : "password"}
                                        {...register('oldPassword')}
                                        className={`w-full rounded-2xl border ${errors.oldPassword ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'} py-3.5 pl-12 pr-12 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition-all`}
                                        placeholder="••••••••"
                                    />
                                    <button type="button" onClick={() => toggleShow('old')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPass.old ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.oldPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.oldPassword.message}</p>}
                            </div>

                            {/* New Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Mật khẩu mới</label>
                                <div className="relative group">
                                    <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.newPassword ? 'text-red-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                    <input 
                                        type={showPass.new ? "text" : "password"}
                                        {...register('newPassword')}
                                        className={`w-full rounded-2xl border ${errors.newPassword ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'} py-3.5 pl-12 pr-12 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition-all`}
                                        placeholder="Nhập mật khẩu mới"
                                    />
                                    <button type="button" onClick={() => toggleShow('new')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPass.new ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.newPassword && <p className="text-[10px] font-bold text-red-500 ml-1 leading-tight">{errors.newPassword.message}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Xác nhận mật khẩu mới</label>
                                <div className="relative group">
                                    <ShieldCheck className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-red-500' : 'text-slate-400'}`} size={18} />
                                    <input 
                                        type={showPass.confirm ? "text" : "password"}
                                        {...register('confirmPassword')}
                                        className={`w-full rounded-2xl border ${errors.confirmPassword ? 'border-red-200 bg-red-50' : 'border-slate-200 bg-slate-50'} py-3.5 pl-12 pr-12 text-sm font-bold text-slate-700 focus:outline-none focus:border-blue-600 focus:bg-white transition-all`}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                    <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                                        {showPass.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-[10px] font-bold text-red-500 ml-1">{errors.confirmPassword.message}</p>}
                            </div>

                            <div className="flex gap-3 pt-6">
                                <button 
                                    type="button" 
                                    onClick={onClose} 
                                    disabled={loading}
                                    className="flex-1 rounded-2xl border border-slate-200 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all active:scale-[0.98] disabled:opacity-50"
                                >
                                    Hủy bỏ
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={loading} 
                                    className="flex-1 rounded-2xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-70"
                                >
                                    {loading ? <Loader2 size={18} className="animate-spin" /> : "Cập nhật mật khẩu"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Thông Báo Phản Hồi (z-index của AppModal nên để >= 150) */}
            <AppModal 
                open={responseModal.open}
                type={responseModal.type}
                title={responseModal.title}
                message={responseModal.message}
                confirmText="Đã hiểu"
                onClose={handleCloseResponse}
                onConfirm={handleCloseResponse}
            />
        </>
    );
}