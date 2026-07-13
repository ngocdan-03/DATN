import { Link, useNavigate } from "react-router-dom";

export default function Unauthorized() {
    const navigate = useNavigate();

    return (
        <section className="relative min-h-screen overflow-hidden bg-[#f7f9fc] px-6 py-16 text-[#0f172a]">
            
            {/* Background blur effects */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[#93c5fd]/30 blur-3xl" />
                <div className="absolute -bottom-20 right-0 h-80 w-80 rounded-full bg-[#fca5a5]/25 blur-3xl" />
            </div>

            {/* Main container */}
            <div className="relative mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
                <div className="w-full rounded-3xl border border-slate-200 bg-white/90 p-8 shadow-2xl md:p-12">
                    
                    {/* Badge */}
                    <p className="mb-3 inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold tracking-wide text-rose-700">
                        403 Forbidden
                    </p>

                    {/* Title */}
                    <h1 className="text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                        Bạn không có quyền truy cập trang này
                    </h1>

                    {/* Description */}
                    <p className="mt-4 text-slate-600">
                        Tài khoản hiện tại chưa được cấp quyền phù hợp. Vui lòng quay về 
                        trang chủ hoặc đăng nhập bằng tài khoản có quyền cao hơn.
                    </p>

                    {/* Actions */}
                    <div className="mt-8 flex flex-wrap gap-3">
                        
                        <Link
                            to="/"
                            className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
                        >
                            Về trang chủ
                        </Link>

                        <button
                            onClick={() => navigate(-1)}
                            className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            Quay lại
                        </button>

                        <Link
                            to="/login"
                            className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                            Đăng nhập tài khoản khác
                        </Link>

                    </div>
                </div>
            </div>
        </section>
    );
}