import React, { useEffect, useState, useCallback } from 'react';
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import { userService } from "../../services/usersService";
import SettingSidebar from "../../components/user/setting/SettingSidebar";
import ProfileForm from "../../components/user/setting/ProfileForm";
import SecuritySection from "../../components/user/setting/SecuritySection";

export default function Setting() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Dùng useCallback để hàm này không bị khởi tạo lại mỗi khi re-render
    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const res = await userService.getMyInfo();
            if (res.code === 1000) {
                setUser(res.result);
            }
        } catch (err) {
            console.error("Lỗi khi tải thông tin người dùng:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    // Giao diện khi đang tải dữ liệu (Sử dụng hiệu ứng Skeleton đơn giản)
    if (loading && !user) {
        return (
            <div className="flex h-[80vh] flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                <p className="text-sm font-bold uppercase tracking-widest text-slate-400 animate-pulse">
                    Đang thiết lập không gian của bạn...
                </p>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl space-y-8 pb-20 font-[Manrope] animate-in fade-in duration-500">
            {/* 1. Tiêu đề trang */}
            <HeaderCard title="Thiết lập tài khoản" />

            {/* 2. Bố cục chính Grid */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                
                {/* CỘT TRÁI (1/3): Thông tin cá nhân nhanh & Số dư */}
                <aside className="lg:col-span-1">
                    <SettingSidebar 
                    user={user}
                    onRefresh={fetchUserData}
                     />
                </aside>

                {/* CỘT PHẢI (2/3): Các Form tương tác chính */}
                <main className="space-y-6 lg:col-span-2">
                    
                    {/* Form cập nhật thông tin cá nhân */}
                    <ProfileForm 
                        user={user} 
                        onRefresh={fetchUserData} 
                    />

                    {/* Section quản lý bảo mật & mật khẩu */}
                    <SecuritySection 
                        user={user} 
                    />

                    {/* Footer hỗ trợ nhanh (Optional) */}
                    <div className="flex items-center justify-center gap-4 rounded-2xl bg-slate-50 p-6 border border-dashed border-slate-200">
                        <p className="text-xs text-slate-400 font-medium italic">
                            Bạn cần hỗ trợ thêm? Liên hệ trung tâm trợ giúp của RecoLand
                        </p>
                    </div>
                </main>
            </div>
        </div>
    );
}