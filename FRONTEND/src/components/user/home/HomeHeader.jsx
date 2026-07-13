// Hero banner trang chu danh sach bai dang.
export default function HomeHeader() {
    return (
        <section className="relative overflow-hidden bg-[#041627] px-6 pb-28 pt-14 md:px-10">
            <div className="pointer-events-none absolute inset-0 opacity-30">
                <div className="absolute -right-40 -top-20 h-80 w-80 rounded-full bg-[#cca830]/40 blur-[120px]" />
                <div className="absolute -bottom-16 left-20 h-72 w-72 rounded-full bg-[#8192a7]/25 blur-[120px]" />
            </div>

            <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 lg:grid-cols-2">
                <div className="space-y-6">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[#c8d4e4]">
                        {/* Icon Sparkle */}
                        <svg className="h-4 w-4 text-[#cca830]" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L14.3511 8.64893L21 11L14.3511 13.3511L12 20L9.64893 13.3511L3 11L9.64893 8.64893L12 2Z" />
                        </svg>
                        Bảng tin bất động sản cao cấp
                    </div>

                    <h1 className="text-4xl font-black leading-[1.1] text-white [font-family:Noto_Serif] md:text-6xl">
                        Tìm Kiếm Không Gian
                        <br />
                        Sống Tuyệt Đỉnh
                    </h1>

                    <p className="max-w-xl text-base leading-relaxed text-[#c8d4e4] md:text-lg">
                        Khám phá những bất động sản hạng sang tại Đà Nẵng với dữ liệu minh bạch, hình ảnh thực tế và khả năng lọc thông minh theo nhu cầu đầu tư của bạn.
                    </p>

                    <div className="grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-3">
                        {/* Hộp 1 */}
                        <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
                            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#9fb1c7]">
                                {/* Icon Menu */}
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                Tin đăng
                            </p>
                            <p className="mt-1 text-xl font-bold text-white">1.248+</p>
                        </div>

                        {/* Hộp 2 */}
                        <div className="rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm">
                            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#9fb1c7]">
                                {/* Icon Location */}
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                Khu vực
                            </p>
                            <p className="mt-1 text-xl font-bold text-white">32</p>
                        </div>

                        {/* Hộp 3 */}
                        <div className="col-span-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-sm sm:col-span-1">
                            <p className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[#9fb1c7]">
                                {/* Icon Clock */}
                                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Cập nhật
                            </p>
                            <p className="mt-1 text-xl font-bold text-white">Mỗi giờ</p>
                        </div>
                    </div>
                </div>

                <div className="group relative">
                    <div className="pointer-events-none absolute -inset-4 rounded-2xl border border-[#cca830]/40 opacity-50 transition-opacity duration-700 group-hover:opacity-80" />
                    <img
                        alt="Biệt thự hiện đại Đà Nẵng"
                        className="relative z-10 h-[420px] w-full rounded-2xl object-cover shadow-2xl md:h-[500px]"
                        src="https://res.cloudinary.com/diu2nczm5/image/upload/v1776090777/homeheroimage.jpg"
                    />
                    <div className="absolute -bottom-5 -left-5 -z-0 h-32 w-32 rounded-xl bg-[#cca830]" />
                </div>
            </div>
        </section>
    );
}