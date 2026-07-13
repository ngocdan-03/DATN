import React, { useState } from 'react'; // 1. Thêm useState
import { Lock, Mail, ChevronRight } from 'lucide-react';
import ChangePasswordModal from './ChangePasswordModal'; // 2. Import Modal của cậu

export default function SecuritySection({ user }) {
    // 3. Khai báo state quản lý modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <section className="rounded-[2.5rem] border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="border-b border-slate-100 bg-slate-50/50 px-8 py-6">
                    <h3 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-slate-700">
                        <div className="rounded-lg bg-rose-100 p-2 text-rose-600"><Lock size={18} /></div>
                        Bảo mật tài khoản
                    </h3>
                </div>
                
                <div className="p-8 space-y-6">
                    {/* Email - Read Only */}
                    <div className="flex items-center justify-between rounded-2xl border border-slate-50 bg-slate-50/30 p-5">
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-white p-3 text-slate-400 shadow-sm border border-slate-100"><Mail size={20} /></div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-wider text-slate-400">Địa chỉ Email</p>
                                <p className="text-sm font-bold text-slate-700">{user?.email}</p>
                            </div>
                        </div>
                        <span className="rounded-lg bg-slate-100 px-3 py-1 text-[9px] font-black uppercase text-slate-400">Hệ thống</span>
                    </div>

                    {/* Password Trigger */}
                    <button 
                        onClick={() => setIsModalOpen(true)} // 4. Thêm sự kiện onClick để mở modal
                        className="w-full flex items-center justify-between rounded-2xl border border-rose-50 bg-rose-50/20 p-5 group hover:bg-rose-50 transition-all"
                    >
                        <div className="flex items-center gap-4">
                            <div className="rounded-xl bg-white p-3 text-rose-500 shadow-sm border border-rose-100 group-hover:scale-110 transition-transform"><Lock size={20} /></div>
                            <div className="text-left">
                                <p className="text-xs font-black uppercase tracking-wider text-rose-400">Mật khẩu đăng nhập</p>
                                <p className="text-sm font-bold text-slate-700">********</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-rose-600 font-bold text-xs uppercase tracking-widest">
                            Thay đổi <ChevronRight size={16} />
                        </div>
                    </button>
                </div>
            </section>

            {/* 5. Chèn Modal vào đây */}
            <ChangePasswordModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </>
    );
}