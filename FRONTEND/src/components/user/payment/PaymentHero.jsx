export default function PaymentHero() {
  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-[#bfdbff] bg-[linear-gradient(120deg,_rgba(0,91,170,0.95),_rgba(0,169,224,0.92))] p-6 text-white shadow-[0_20px_45px_-25px_rgba(0,61,122,0.75)] md:p-10">
      <div className="flex flex-col gap-7 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/45 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em]">
            Thanh toán bảo mật qua VNPay
          </span>
          <h1 className="text-4xl leading-tight [font-family:Noto_Serif] md:text-6xl">
            Nâng cấp gói dịch vụ nhanh trong 30 giây
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-blue-50 md:text-base">
            Chọn gói phù hợp và thanh toán qua cổng VNPay. Giao dịch được mã hóa, xác nhận tự động ngay sau khi thanh toán thành công.
          </p>
        </div>

        <div className="rounded-2xl border border-white/30 bg-white/10 p-4 backdrop-blur-sm">
          <p className="text-xs uppercase tracking-[0.18em] text-blue-100">Phương thức</p>
          <p className="mt-1 text-xl font-bold">VNPay QR / ATM / Visa</p>
        </div>
      </div>
    </section>
  );
}