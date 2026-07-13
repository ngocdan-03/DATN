import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Phone, Calendar, MapPin, Save, Clock, Users, Loader2 } from 'lucide-react';
import { GENDER_OPTIONS } from '../../../constants/users';
import { formatDateTime, formatDateForInput, formatDateForBE } from '../../../utils/format';
import { userService } from '../../../services/usersService';
import { authValidationSchemas, buildYupResolver } from '../../../validation';
import AppModal from '../../modals/AppModal';

export default function ProfileForm({ user, onRefresh }) {
    const [loading, setLoading] = useState(false);
    const [modal, setModal] = useState({ open: false, type: 'info', title: '', message: '' });

    // Sử dụng React Hook Form kết hợp với Yup Schema đã viết
    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
    } = useForm({
        resolver: buildYupResolver(authValidationSchemas.updateInfoSchema),
        // values giúp form tự đồng bộ khi dữ liệu user từ cha (Setting.jsx) thay đổi
        values: {
            fullName: user?.fullName,
            phone: user?.phone,
            gender: user?.gender ?? 0,
            birthday: formatDateForInput(user?.birthday),
            address: user?.address,
        }
    });

    const onSubmit = async (data) => {
        try {
            setLoading(true);

            // Chuẩn bị payload khớp với DTO của Backend
            const payload = {
                ...data,
                gender: parseInt(data.gender),
                birthday: formatDateForBE(data.birthday), // Chuyển YYYY-MM-DD sang DD-MM-YYYY
            };

            const res = await userService.updateMyInfo(payload);

            if (res.code === 1000) {
                setModal({
                    open: true,
                    type: 'success',
                    title: 'Thành công',
                    message: 'Thông tin cá nhân của bạn đã được cập nhật thành công!'
                });
                // Reload lại dữ liệu toàn trang
                if (onRefresh) await onRefresh();
            }
        } catch (error) {
            setModal({
                open: true,
                type: 'error',
                title: 'Lỗi cập nhật',
                message: error.message || 'Có lỗi xảy ra khi lưu thông tin.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden font-[Manrope]">
                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
                    <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-700">
                        <div className="rounded-lg bg-blue-100 p-2 text-blue-600">
                            <User size={18} />
                        </div>
                        Thông tin cơ bản
                    </h3>
                </div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        
                        {/* Họ và tên */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Họ và tên</label>
                            <div className="relative group">
                                <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.fullName ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                <input 
                                    type="text" 
                                    {...register('fullName')}
                                    className={`w-full rounded-2xl border ${errors.fullName ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'} py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all`}
                                    placeholder="Nhập họ và tên"
                                />
                            </div>
                            {errors.fullName && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.fullName.message}</p>}
                        </div>

                        {/* Số điện thoại */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Số điện thoại</label>
                            <div className="relative group">
                                <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                <input 
                                    type="text" 
                                    {...register('phone')}
                                    className={`w-full rounded-2xl border ${errors.phone ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'} py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all`}
                                    placeholder="Nhập số điện thoại"
                                />
                            </div>
                            {errors.phone && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.phone.message}</p>}
                        </div>

                        {/* Giới tính */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Giới tính</label>
                            <div className="relative group">
                                <Users className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.gender ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                <select 
                                    {...register('gender')}
                                    className={`w-full rounded-2xl border ${errors.gender ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'} py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all appearance-none cursor-pointer`}
                                >
                                    {GENDER_OPTIONS.map(option => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                                </div>
                            </div>
                            {errors.gender && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.gender.message}</p>}
                        </div>

                        {/* Ngày sinh */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Ngày sinh</label>
                            <div className="relative group">
                                <Calendar className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.birthday ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                <input 
                                    type="date" 
                                    {...register('birthday')}
                                    className={`w-full rounded-2xl border ${errors.birthday ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'} py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all`}
                                />
                            </div>
                            {errors.birthday && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.birthday.message}</p>}
                        </div>

                        {/* Địa chỉ */}
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1">Địa chỉ</label>
                            <div className="relative group">
                                <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.address ? 'text-rose-500' : 'text-slate-400 group-focus-within:text-blue-600'}`} size={18} />
                                <input 
                                    type="text" 
                                    {...register('address')}
                                    className={`w-full rounded-2xl border ${errors.address ? 'border-rose-500 bg-rose-50/30' : 'border-slate-200 bg-slate-50/50'} py-3.5 pl-12 pr-4 text-sm font-bold text-slate-700 focus:border-blue-600 focus:bg-white focus:outline-none transition-all`}
                                    placeholder="Xã, Huyện, Tỉnh"
                                />
                            </div>
                            {errors.address && <p className="text-[10px] font-bold text-rose-500 ml-1">{errors.address.message}</p>}
                        </div>

                        {/* Divider */}
                        <div className="md:col-span-2 h-px bg-slate-50 my-2"></div>

                        {/* Ngày tham gia */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 italic">Ngày tham gia hệ thống</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input 
                                    type="text" 
                                    readOnly
                                    value={formatDateTime(user?.createdAt)} 
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-[13px] font-medium text-slate-400 cursor-not-allowed select-none"
                                />
                            </div>
                        </div>

                        {/* Cập nhật lần cuối */}
                        <div className="space-y-2">
                            <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 ml-1 italic">Cập nhật lần cuối</label>
                            <div className="relative">
                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                                <input 
                                    type="text" 
                                    readOnly
                                    value={formatDateTime(user?.updateAt)} 
                                    className="w-full rounded-2xl border border-slate-100 bg-slate-50 py-3 pl-10 pr-4 text-[13px] font-medium text-slate-400 cursor-not-allowed select-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Nút bấm */}
                    <div className="mt-10 flex justify-end">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 rounded-2xl bg-[#041627] px-10 py-4 text-sm font-bold text-white shadow-xl hover:bg-slate-800 transition-all active:scale-[0.97] disabled:bg-slate-400 disabled:cursor-not-allowed min-w-[180px] justify-center"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </section>

            <AppModal 
                open={modal.open}
                type={modal.type}
                title={modal.title}
                message={modal.message}
                onClose={() => setModal({ ...modal, open: false })}
                onConfirm={() => setModal({ ...modal, open: false })}
            />
        </>
    );
}