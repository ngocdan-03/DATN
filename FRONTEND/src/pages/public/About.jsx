import { useEffect, useRef, useState } from 'react';

// ── Counter animation hook ──
function useCounter(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        if (!start) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [start, target, duration]);
    return count;
}

// ── Intersection observer hook ──
function useInView(threshold = 0.2) {
    const ref = useRef(null);
    const [inView, setInView] = useState(false);
    useEffect(() => {
        const obs = new IntersectionObserver(
            ([e]) => { if (e.isIntersecting) setInView(true); },
            { threshold }
        );
        if (ref.current) obs.observe(ref.current);
        return () => obs.disconnect();
    }, [threshold]);
    return [ref, inView];
}

// ── Stat card ──
function StatCard({ value, suffix, label, inView, delay }) {
    const count = useCounter(value, 1800, inView);
    return (
        <div
            className="text-center"
            style={{
                animation: inView ? `fadeUp 0.6s ease forwards` : 'none',
                animationDelay: `${delay}ms`,
                opacity: 0,
            }}
        >
            <p className="text-5xl font-black text-[#cca830] [font-family:Manrope] md:text-6xl">
                {count}{suffix}
            </p>
            <p className="mt-2 text-sm font-semibold uppercase tracking-widest text-slate-300">{label}</p>
        </div>
    );
}

// ── Value card ──
function ValueCard({ icon, title, desc, inView, delay }) {
    return (
        <div
            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            style={{
                animation: inView ? `fadeUp 0.5s ease forwards` : 'none',
                animationDelay: `${delay}ms`,
                opacity: 0,
            }}
        >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#041627] text-2xl">
                {icon}
            </div>
            <h3 className="mb-2 text-base font-black text-[#041627] [font-family:Manrope]">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-500">{desc}</p>
        </div>
    );
}

// ── Team card ──
function TeamCard({ name, role, avatar, inView, delay }) {
    return (
        <div
            className="group text-center"
            style={{
                animation: inView ? `fadeUp 0.5s ease forwards` : 'none',
                animationDelay: `${delay}ms`,
                opacity: 0,
            }}
        >
            <div className="relative mx-auto mb-4 h-28 w-28 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-[#cca830]/30 transition-all duration-300 group-hover:ring-[#cca830]">
                <img src={avatar} alt={name} className="h-full w-full object-cover" />
            </div>
            <p className="font-black text-[#041627] [font-family:Manrope]">{name}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[#cca830]">{role}</p>
        </div>
    );
}

export default function About() {
    const [statsRef, statsInView] = useInView();
    const [valuesRef, valuesInView] = useInView();
    const [teamRef, teamInView] = useInView();
    const [missionRef, missionInView] = useInView(0.3);

    const stats = [
        { value: 500, suffix: '+', label: 'Bài đăng BĐS' },
        { value: 1200, suffix: '+', label: 'Khách hàng tin dùng' },
        { value: 98, suffix: '%', label: 'Độ hài lòng' },
        { value: 3, suffix: ' năm', label: 'Kinh nghiệm' },
    ];

    const values = [
        {
            icon: '🔍',
            title: 'Minh bạch toàn diện',
            desc: 'Mọi thông tin bất động sản đều được kiểm duyệt kỹ lưỡng bởi đội ngũ chuyên gia trước khi hiển thị.',
        },
        {
            icon: '🤖',
            title: 'Công nghệ AI tiên tiến',
            desc: 'Hệ thống gợi ý thông minh phân tích sở thích của bạn để tìm ra bất động sản phù hợp nhất.',
        },
        {
            icon: '⚖️',
            title: 'Hỗ trợ pháp lý',
            desc: 'Trợ lý AI chuyên pháp lý nhà đất tư vấn 24/7, giải đáp mọi thắc mắc về thủ tục và hợp đồng.',
        },
        {
            icon: '📍',
            title: 'Tập trung Đà Nẵng',
            desc: 'Chuyên sâu về thị trường BĐS Đà Nẵng — khu vực, quy hoạch, tiềm năng tăng giá.',
        },
        {
            icon: '🔒',
            title: 'Bảo mật tài khoản',
            desc: 'Hệ thống xác thực OTP và bảo vệ dữ liệu cá nhân theo tiêu chuẩn bảo mật cao nhất.',
        },
        {
            icon: '💳',
            title: 'Thanh toán an toàn',
            desc: 'Tích hợp VNPay đảm bảo mọi giao dịch nạp tiền đều an toàn, nhanh chóng và minh bạch.',
        },
    ];

    const team = [
        { name: 'Bùi Ngọc Dân', role: 'Full Stack Developer', avatar: 'https://res.cloudinary.com/diu2nczm5/image/upload/v1782832430/avatar.jpg' },
    ];

    return (
        <main className="bg-[#f8f7f8]">
            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(24px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideRight {
                    from { opacity: 0; transform: translateX(-32px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes scaleIn {
                    from { opacity: 0; transform: scale(0.92); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>

            {/* ══════════════════════════════════════
                HERO — Navy fullscreen với slash vàng
            ══════════════════════════════════════ */}
            <section className="relative min-h-screen overflow-hidden bg-[#041627]">
                {/* Diagonal gold slash — signature element */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: 'linear-gradient(115deg, transparent 58%, #cca830 58%, #cca830 60%, transparent 60%)',
                        opacity: 0.12,
                    }}
                />
                {/* Grid pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #cca830 0px, #cca830 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #cca830 0px, #cca830 1px, transparent 1px, transparent 60px)',
                    }}
                />

                <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-start justify-center px-6 py-24 md:px-10">
                    <p
                        className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#cca830]"
                        style={{ animation: 'fadeUp 0.6s ease 0.1s forwards', opacity: 0 }}
                    >
                        Về chúng tôi
                    </p>

                    <h1
                        className="max-w-3xl text-5xl font-black leading-[1.1] text-white [font-family:Noto_Serif] md:text-7xl lg:text-8xl"
                        style={{ animation: 'fadeUp 0.7s ease 0.2s forwards', opacity: 0 }}
                    >
                        Đặt nền móng <br />
                        <span className="text-[#cca830]">tin cậy</span> cho <br />
                        mọi giao dịch.
                    </h1>

                    <p
                        className="mt-8 max-w-xl text-base font-medium leading-relaxed text-slate-300 md:text-lg"
                        style={{ animation: 'fadeUp 0.7s ease 0.35s forwards', opacity: 0 }}
                    >
                        RecoLand là nền tảng bất động sản thông minh tại Đà Nẵng — nơi công nghệ AI
                        gặp gỡ sự minh bạch, kết nối người mua và người bán với trải nghiệm
                        nhanh chóng, an toàn và chính xác.
                    </p>

                    <div
                        className="mt-10 flex items-center gap-4"
                        style={{ animation: 'fadeUp 0.7s ease 0.5s forwards', opacity: 0 }}
                    >
                        <div className="h-px w-12 bg-[#cca830]" />
                        <span className="text-sm font-semibold text-slate-400">Thành lập 2023 · Đà Nẵng, Việt Nam</span>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white">Cuộn xuống</span>
                    <div className="h-8 w-px bg-white" />
                </div>
            </section>

            {/* ══════════════════════════════════════
                MISSION — 2 cột text + ảnh
            ══════════════════════════════════════ */}
            <section ref={missionRef} className="mx-auto max-w-7xl px-6 py-24 md:px-10">
                <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
                    <div
                        style={{
                            animation: missionInView ? 'slideRight 0.7s ease forwards' : 'none',
                            opacity: 0,
                        }}
                    >
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#cca830]">Sứ mệnh</p>
                        <h2 className="text-4xl font-black leading-tight text-[#041627] [font-family:Noto_Serif] md:text-5xl">
                            Nền tảng BĐS <br /> đáng tin nhất <br /> Đà Nẵng
                        </h2>
                        <div className="my-6 h-1 w-16 bg-[#cca830]" />
                        <p className="text-base leading-relaxed text-slate-500">
                            Chúng tôi tin rằng mỗi người đều xứng đáng có được ngôi nhà phù hợp với mình —
                            không rào cản thông tin, không lo lắng pháp lý. RecoLand ra đời để xóa bỏ
                            khoảng cách đó bằng công nghệ và sự tận tâm.
                        </p>
                        <p className="mt-4 text-base leading-relaxed text-slate-500">
                            Mỗi bài đăng đều qua kiểm duyệt. Mỗi giao dịch đều minh bạch.
                            Mỗi câu hỏi đều được giải đáp — bởi con người hoặc AI, 24/7.
                        </p>
                    </div>

                    {/* Visual block */}
                    <div
                        className="relative"
                        style={{
                            animation: missionInView ? 'scaleIn 0.8s ease 0.2s forwards' : 'none',
                            opacity: 0,
                        }}
                    >
                        <div className="overflow-hidden rounded-3xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=700&q=80"
                                alt="Bất động sản Đà Nẵng"
                                className="h-96 w-full object-cover"
                            />
                        </div>
                        {/* Floating badge */}
                        <div className="absolute -bottom-6 -left-6 rounded-2xl bg-[#041627] px-6 py-4 shadow-xl">
                            <p className="text-3xl font-black text-[#cca830] [font-family:Manrope]">500+</p>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">Bài đăng đã duyệt</p>
                        </div>
                        {/* Gold border accent */}
                        <div className="absolute -right-4 -top-4 h-24 w-24 rounded-2xl border-4 border-[#cca830] opacity-40" />
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                STATS — Navy band với counter animation
            ══════════════════════════════════════ */}
            <section className="bg-[#041627]">
                <div
                    ref={statsRef}
                    className="mx-auto max-w-7xl px-6 py-20 md:px-10"
                >
                    <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
                        {stats.map((s, i) => (
                            <StatCard
                                key={i}
                                value={s.value}
                                suffix={s.suffix}
                                label={s.label}
                                inView={statsInView}
                                delay={i * 120}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                VALUES — 3x2 grid
            ══════════════════════════════════════ */}
            <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#cca830]">Giá trị cốt lõi</p>
                    <h2 className="text-4xl font-black text-[#041627] [font-family:Noto_Serif] md:text-5xl">
                        Điều tạo nên RecoLand
                    </h2>
                </div>

                <div ref={valuesRef} className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {values.map((v, i) => (
                        <ValueCard
                            key={i}
                            icon={v.icon}
                            title={v.title}
                            desc={v.desc}
                            inView={valuesInView}
                            delay={i * 80}
                        />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                TIMELINE — Hành trình phát triển
            ══════════════════════════════════════ */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-3xl px-6 md:px-10">
                    <div className="mb-14 text-center">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#cca830]">Hành trình</p>
                        <h2 className="text-4xl font-black text-[#041627] [font-family:Noto_Serif]">Từ ý tưởng đến thực tế</h2>
                    </div>

                    <div className="relative space-y-0">
                        <div className="absolute left-[19px] top-0 h-full w-px bg-slate-200" />
                        {[
                            { year: '2023', title: 'Ý tưởng hình thành', desc: 'Nhận ra khoảng trống trong thị trường BĐS Đà Nẵng — thiếu nền tảng minh bạch, thông minh cho người dùng phổ thông.' },
                            { year: '2024', title: 'Ra mắt phiên bản đầu', desc: 'Hệ thống quản lý bài đăng, kiểm duyệt admin, đăng nhập bảo mật OTP và tích hợp VNPay hoàn thiện.' },
                            { year: '2024', title: 'Tích hợp AI', desc: 'Hệ thống gợi ý thông minh dùng vector embedding và Qdrant. Chatbot pháp lý RAG với Gemini API.' },
                            { year: '2025', title: 'Mở rộng', desc: 'Bản đồ tương tác, phân tích thị trường theo khu vực, mở rộng toàn quốc.' },
                        ].map((item, i) => (
                            <div key={i} className="relative flex gap-8 pb-10">
                                <div className="flex flex-col items-center">
                                    <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#041627] ring-4 ring-[#f8f7f8]">
                                        <div className="h-3 w-3 rounded-full bg-[#cca830]" />
                                    </div>
                                </div>
                                <div className="pb-2 pt-1">
                                    <p className="mb-1 text-xs font-bold uppercase tracking-widest text-[#cca830]">{item.year}</p>
                                    <h3 className="mb-2 font-black text-[#041627] [font-family:Manrope]">{item.title}</h3>
                                    <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                TEAM
            ══════════════════════════════════════ */}
            <section className="mx-auto max-w-7xl px-6 py-24 md:px-10">
                <div className="mb-14 text-center">
                    <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#cca830]">Đội ngũ</p>
                    <h2 className="text-4xl font-black text-[#041627] [font-family:Noto_Serif]">Con người đằng sau RecoLand</h2>
                </div>

                <div ref={teamRef} className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
                    {team.map((m, i) => (
                        <TeamCard
                            key={i}
                            name={m.name}
                            role={m.role}
                            avatar={m.avatar}
                            inView={teamInView}
                            delay={i * 100}
                        />
                    ))}
                </div>
            </section>

            {/* ══════════════════════════════════════
                CTA — Fullwidth navy
            ══════════════════════════════════════ */}
            <section className="relative overflow-hidden bg-[#041627] py-24">
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{
                        background: 'radial-gradient(ellipse at 70% 50%, #cca830 0%, transparent 65%)',
                    }}
                />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-10">
                    <h2 className="text-4xl font-black text-white [font-family:Noto_Serif] md:text-5xl">
                        Sẵn sàng tìm<br />
                        <span className="text-[#cca830]">ngôi nhà mơ ước?</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base text-slate-300">
                        Hàng trăm bài đăng được kiểm duyệt kỹ lưỡng đang chờ bạn khám phá.
                        AI của chúng tôi sẽ gợi ý ngay những lựa chọn phù hợp nhất.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-[#cca830] px-8 py-3.5 text-sm font-bold text-[#041627] transition-all hover:bg-[#b8952a] active:scale-[0.98]"
                        >
                            Khám phá ngay
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                        <a
                            href="/user/post-create"
                            className="inline-flex items-center gap-2 rounded-full border border-white/30 px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-white/60 hover:bg-white/10"
                        >
                            Đăng tin BĐS
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
