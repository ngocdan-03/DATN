import { useEffect, useRef, useState } from 'react';

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

// ── Section card ──
function SectionCard({ number, title, items, inView, delay }) {
    return (
        <div
            className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
            style={{
                animation: inView ? 'fadeUp 0.6s ease forwards' : 'none',
                animationDelay: `${delay}ms`,
                opacity: 0,
            }}
        >
            <div className="mb-6 flex items-center gap-4">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-[#041627] text-sm font-black text-[#cca830] [font-family:Manrope]">
                    {number}
                </div>
                <h2 className="text-lg font-black text-[#041627] [font-family:Manrope]">{title}</h2>
            </div>
            <div className="space-y-5 border-t border-slate-100 pt-6">
                {items.map((item, i) => (
                    <div key={i}>
                        <div className="mb-1.5 flex items-center gap-2">
                            <div className="h-1.5 w-1.5 flex-none rounded-full bg-[#cca830]" />
                            <p className="text-sm font-bold text-[#041627]">{item.subtitle}</p>
                        </div>
                        <p className="pl-3.5 text-sm leading-relaxed text-slate-500">{item.text}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

const sections = [
    {
        title: 'Quy định chung',
        items: [
            { subtitle: '1.1. Phạm vi áp dụng', text: 'Điều khoản dịch vụ này điều chỉnh việc sử dụng nền tảng RecoLand — website bất động sản tại Đà Nẵng, bao gồm tất cả các tính năng, công cụ và dịch vụ được cung cấp. Khi truy cập hoặc sử dụng dịch vụ, bạn đồng ý bị ràng buộc bởi các điều khoản này.' },
            { subtitle: '1.2. Đối tượng sử dụng', text: 'Dịch vụ dành cho cá nhân từ 18 tuổi trở lên hoặc tổ chức hợp pháp có nhu cầu mua, bán, cho thuê hoặc tìm kiếm thông tin bất động sản. Người dùng chưa đủ tuổi cần có sự đồng ý và giám sát của người giám hộ hợp pháp.' },
        ],
    },
    {
        title: 'Tài khoản người dùng',
        items: [
            { subtitle: '2.1. Đăng ký tài khoản', text: 'Để sử dụng đầy đủ các tính năng, bạn cần tạo tài khoản với thông tin chính xác và cập nhật. Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình.' },
            { subtitle: '2.2. Bảo mật tài khoản', text: 'Bạn cam kết không chia sẻ mật khẩu hoặc cho phép người khác sử dụng tài khoản. Nếu phát hiện bất kỳ hành vi truy cập trái phép nào, hãy thông báo ngay cho RecoLand qua kênh hỗ trợ chính thức.' },
            { subtitle: '2.3. Đình chỉ tài khoản', text: 'RecoLand có quyền tạm ngưng hoặc chấm dứt tài khoản nếu phát hiện vi phạm điều khoản, gian lận, hoặc các hành vi gây hại cho người dùng khác.' },
        ],
    },
    {
        title: 'Đăng tin bất động sản',
        items: [
            { subtitle: '3.1. Yêu cầu nội dung', text: 'Mọi tin đăng phải phản ánh thông tin thực tế về bất động sản: diện tích, vị trí, giá cả, tình trạng pháp lý. Nghiêm cấm đăng thông tin sai lệch, hình ảnh không thuộc bất động sản đang rao bán hoặc nội dung có tính chất lừa đảo.' },
            { subtitle: '3.2. Kiểm duyệt nội dung', text: 'Tất cả tin đăng được đội ngũ RecoLand kiểm duyệt trước khi hiển thị công khai. Chúng tôi có quyền từ chối hoặc gỡ bỏ bất kỳ tin đăng nào không tuân thủ tiêu chuẩn cộng đồng.' },
            { subtitle: '3.3. Trợ lý AI', text: 'Tính năng Trợ lý AI hỗ trợ soạn thảo mô tả, gợi ý giá tham khảo và tư vấn pháp lý cơ bản. Thông tin từ AI chỉ mang tính tham khảo, không thay thế tư vấn chuyên nghiệp từ luật sư hoặc chuyên gia.' },
        ],
    },
    {
        title: 'Thanh toán & Nạp tiền',
        items: [
            { subtitle: '4.1. Hình thức thanh toán', text: 'RecoLand hỗ trợ thanh toán qua chuyển khoản ngân hàng, ví điện tử và cổng thanh toán VNPay. Tất cả giao dịch được mã hóa và bảo mật theo tiêu chuẩn quốc tế.' },
            { subtitle: '4.2. Chính sách hoàn tiền', text: 'Số dư đã nạp không được hoàn trả thành tiền mặt trừ trường hợp có lỗi kỹ thuật từ phía RecoLand được xác nhận. Bạn có thể liên hệ bộ phận hỗ trợ trong vòng 48 giờ kể từ khi xảy ra lỗi.' },
            { subtitle: '4.3. Giá dịch vụ', text: 'Biểu giá đăng tin và các gói dịch vụ được niêm yết công khai. RecoLand có quyền điều chỉnh giá với thông báo trước ít nhất 7 ngày. Giao dịch đã hoàn tất không bị ảnh hưởng bởi thay đổi giá.' },
        ],
    },
    {
        title: 'Quyền riêng tư & Dữ liệu',
        items: [
            { subtitle: '5.1. Thu thập dữ liệu', text: 'RecoLand thu thập thông tin cá nhân cần thiết để cung cấp dịch vụ, bao gồm tên, số điện thoại, địa chỉ email và dữ liệu sử dụng nền tảng. Chúng tôi không bán thông tin của bạn cho bên thứ ba.' },
            { subtitle: '5.2. Bảo mật dữ liệu', text: 'Chúng tôi áp dụng các biện pháp bảo mật kỹ thuật phù hợp để bảo vệ dữ liệu khỏi truy cập trái phép, tuân thủ Nghị định 13/2023/NĐ-CP về bảo vệ dữ liệu cá nhân.' },
        ],
    },
    {
        title: 'Giới hạn trách nhiệm',
        items: [
            { subtitle: '6.1. Thông tin bất động sản', text: 'RecoLand đóng vai trò nền tảng kết nối và không chịu trách nhiệm về tính chính xác tuyệt đối của thông tin do người dùng đăng tải. Người mua và người thuê cần tự xác minh thông tin pháp lý trước khi thực hiện giao dịch.' },
            { subtitle: '6.2. Gián đoạn dịch vụ', text: 'RecoLand không chịu trách nhiệm về thiệt hại phát sinh do gián đoạn dịch vụ vì lý do kỹ thuật, bảo trì hệ thống hoặc sự kiện bất khả kháng. Chúng tôi cam kết thông báo sớm nhất khi hệ thống bảo trì theo kế hoạch.' },
        ],
    },
    {
        title: 'Cập nhật điều khoản',
        items: [
            { subtitle: '7.1. Quyền sửa đổi', text: 'RecoLand có quyền cập nhật Điều khoản Dịch vụ bất kỳ lúc nào. Các thay đổi quan trọng sẽ được thông báo qua email hoặc thông báo trên nền tảng ít nhất 14 ngày trước khi có hiệu lực.' },
            { subtitle: '7.2. Chấp thuận thay đổi', text: 'Việc tiếp tục sử dụng dịch vụ sau khi điều khoản được cập nhật đồng nghĩa bạn chấp thuận các thay đổi đó. Nếu không đồng ý, bạn có quyền ngừng sử dụng và yêu cầu xóa tài khoản.' },
        ],
    },
];

export default function TermsOfService() {
    const [heroRef, heroInView] = useInView(0.1);
    const [contentRef, contentInView] = useInView(0.05);
    const [ctaRef, ctaInView] = useInView(0.3);

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
            `}</style>

            {/* ══════════════════════════════════════
                HERO — Navy fullscreen với slash vàng
            ══════════════════════════════════════ */}
            <section ref={heroRef} className="relative overflow-hidden bg-[#041627] py-28">
                {/* Diagonal gold slash */}
                <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                        background: 'linear-gradient(115deg, transparent 58%, #cca830 58%, #cca830 60%, transparent 60%)',
                        opacity: 0.1,
                    }}
                />
                {/* Grid pattern */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, #cca830 0px, #cca830 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #cca830 0px, #cca830 1px, transparent 1px, transparent 60px)',
                    }}
                />

                <div className="relative z-10 mx-auto max-w-7xl px-6 md:px-10">
                    <p
                        className="mb-4 text-xs font-bold uppercase tracking-[0.3em] text-[#cca830]"
                        style={{ animation: heroInView ? 'fadeUp 0.6s ease 0.1s forwards' : 'none', opacity: 0 }}
                    >
                        Pháp lý & Quy định
                    </p>
                    <h1
                        className="max-w-2xl text-5xl font-black leading-[1.1] text-white [font-family:Noto_Serif] md:text-6xl"
                        style={{ animation: heroInView ? 'fadeUp 0.7s ease 0.2s forwards' : 'none', opacity: 0 }}
                    >
                        Điều khoản <br />
                        <span className="text-[#cca830]">Dịch vụ</span>
                    </h1>
                    <div
                        className="mt-8 flex items-start gap-6"
                        style={{ animation: heroInView ? 'fadeUp 0.7s ease 0.35s forwards' : 'none', opacity: 0 }}
                    >
                        <p className="max-w-xl text-base font-medium leading-relaxed text-slate-300">
                            Vui lòng đọc kỹ các điều khoản dưới đây trước khi sử dụng nền tảng RecoLand.
                            Bằng việc đăng ký tài khoản, bạn đồng ý tuân thủ toàn bộ các quy định này.
                        </p>
                    </div>
                    <div
                        className="mt-8 flex items-center gap-4"
                        style={{ animation: heroInView ? 'fadeUp 0.7s ease 0.5s forwards' : 'none', opacity: 0 }}
                    >
                        <div className="h-px w-12 bg-[#cca830]" />
                        <span className="text-sm font-semibold text-slate-400">Cập nhật lần cuối: 01/06/2025 · Phiên bản 2.0</span>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CONTENT — Sidebar + Cards
            ══════════════════════════════════════ */}
            <section className="mx-auto max-w-7xl px-6 py-20 md:px-10">
                <div className="flex gap-10 items-start">

                    {/* Sidebar sticky */}
                    <aside className="hidden lg:block w-56 flex-none sticky top-24">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-[#cca830]">Mục lục</p>
                        <nav className="space-y-1">
                            {sections.map((s, i) => (
                                <a
                                    key={i}
                                    href={`#section-${i}`}
                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-all hover:bg-white hover:text-[#041627] hover:shadow-sm"
                                >
                                    <span className="text-xs font-black text-[#cca830]">{String(i + 1).padStart(2, '0')}</span>
                                    {s.title}
                                </a>
                            ))}
                        </nav>

                        {/* Support box */}
                        <div className="mt-8 rounded-2xl bg-[#041627] p-5">
                            <p className="mb-1 text-sm font-black text-white [font-family:Manrope]">Cần hỗ trợ?</p>
                            <p className="mb-4 text-xs leading-relaxed text-slate-400">Đội ngũ của chúng tôi luôn sẵn sàng giải đáp mọi thắc mắc.</p>
                            <a
                                href="mailto:buingocdan2003@gmail.com"
                                className="block rounded-xl bg-[#cca830] py-2 text-center text-xs font-bold text-[#041627] transition-all hover:bg-[#b8952a]"
                            >
                                Liên hệ ngay
                            </a>
                        </div>
                    </aside>

                    {/* Cards grid */}
                    <div ref={contentRef} className="flex-1 min-w-0 space-y-6">
                        {sections.map((s, i) => (
                            <div key={i} id={`section-${i}`}>
                                <SectionCard
                                    number={String(i + 1).padStart(2, '0')}
                                    title={s.title}
                                    items={s.items}
                                    inView={contentInView}
                                    delay={i * 60}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════
                CTA — Fullwidth navy
            ══════════════════════════════════════ */}
            <section ref={ctaRef} className="relative overflow-hidden bg-[#041627] py-24">
                <div
                    className="pointer-events-none absolute inset-0 opacity-10"
                    style={{ background: 'radial-gradient(ellipse at 70% 50%, #cca830 0%, transparent 65%)' }}
                />
                <div
                    className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-10"
                    style={{ animation: ctaInView ? 'fadeUp 0.7s ease forwards' : 'none', opacity: 0 }}
                >
                    <h2 className="text-4xl font-black text-white [font-family:Noto_Serif] md:text-5xl">
                        Đồng ý với<br />
                        <span className="text-[#cca830]">Điều khoản RecoLand?</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-xl text-base text-slate-300">
                        Bằng việc tiếp tục sử dụng nền tảng, bạn xác nhận đã đọc, hiểu và chấp thuận toàn bộ điều khoản dịch vụ nêu trên.
                    </p>
                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <a
                            href="/"
                            className="inline-flex items-center gap-2 rounded-full bg-[#cca830] px-8 py-3.5 text-sm font-bold text-[#041627] transition-all hover:bg-[#b8952a] active:scale-[0.98]"
                        >
                            Tôi đồng ý — Khám phá ngay
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}
