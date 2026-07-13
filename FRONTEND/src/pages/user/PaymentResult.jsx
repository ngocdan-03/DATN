import { Link, useSearchParams } from "react-router-dom";
import { PAYMENT_RESULT_STYLES } from "../../constants/payment";

export default function PaymentResult() {
  const [searchParams] = useSearchParams();

  const status = (searchParams.get("status") || "").toLowerCase();
  const amountRaw = searchParams.get("amount");
  const message =
    searchParams.get("message") || "Không có thông tin phản hồi từ hệ thống.";

  const uiType =
    status === "success" || status === "ok"
      ? "success"
      : status === "warning" || status === "pending"
      ? "warning"
      : "error";

  const ui = PAYMENT_RESULT_STYLES[uiType];

  const amount = Number(amountRaw || 0);
  const formattedAmount =
    Number.isFinite(amount) && amount > 0
      ? amount.toLocaleString("vi-VN") + " VNĐ"
      : "Không xác định";

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-12 md:px-10">
      <div className="overflow-hidden rounded-3xl border border-[#d8e9ff] bg-white shadow-[0_18px_44px_-30px_rgba(0,75,146,0.45)]">
        <div className="bg-[linear-gradient(120deg,_#005baa,_#00a9e0)] px-6 py-6 text-white md:px-8">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-3xl [font-family:Noto_Serif] md:text-4xl">
              Kết quả thanh toán
            </h1>
            <span
              className={
                "rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider " +
                ui.badge
              }
            >
              {ui.label}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          <div className={"rounded-2xl border p-5 " + ui.card}>
            <div className="mb-4 flex items-center gap-2">
              <span className="text-xl">{ui.icon}</span>
              <p className={"text-lg font-semibold " + ui.title}>
                Trạng thái: {status || "Không xác định"}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3">
                <span className="text-sm text-[#5d6678]">Số tiền</span>
                <strong className="text-[#0b1730]">{formattedAmount}</strong>
              </div>

              <div className="rounded-xl bg-white/80 px-4 py-3">
                <p className="mb-1 text-sm text-[#5d6678]">Thông báo</p>
                <p className="font-medium text-[#0b1730]">{message}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              to="/user/payment"
              className="inline-flex items-center rounded-xl border border-[#bcd9ff] px-4 py-2 text-sm font-semibold text-[#005baa] hover:bg-[#eef6ff]"
            >
              Thanh toán lại
            </Link>
            <Link
              to="/user/dashboard"
              className="inline-flex items-center rounded-xl bg-[linear-gradient(120deg,_#005baa,_#00a9e0)] px-4 py-2 text-sm font-semibold text-white hover:brightness-105"
            >
              Về trang người dùng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}