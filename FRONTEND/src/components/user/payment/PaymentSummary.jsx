import { useState } from "react";
import { paymentService } from "../../../services/paymentService";
import { formatCurrencyVND } from "../../../utils/format";

export default function PaymentSummary({ selectedPackage }) {
  const [creatingPayment, setCreatingPayment] = useState(false);

  const handlePayment = async () => {
    setCreatingPayment(true);
    try {
        const result = await paymentService.createVnpayUrl({
            amount: selectedPackage.amount,
            description: selectedPackage.description,
        });
        window.location.href = result.paymentUrl;
    }catch (error) {
        alert(error?.response?.data?.message ||error.message || "Đã có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
        setCreatingPayment(false);
    }
  };

  return (
    <aside className="h-fit rounded-3xl border border-[#d8e9ff] bg-white p-5 shadow-[0_18px_44px_-30px_rgba(0,75,146,0.45)] md:p-7">
      <div className="mb-5 flex items-start justify-between">
        <h2 className="text-3xl [font-family:Noto_Serif]">Tóm tắt đơn</h2>
        <span className="rounded-full bg-[#eef6ff] p-2 text-[#005baa]">📄</span>
      </div>

      <div className="space-y-4 rounded-2xl border border-[#dbe9fb] bg-[#f8fbff] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5d6678]">Gói đã chọn</span>
          <strong className="text-sm text-[#0b1730]">{selectedPackage.label}</strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5d6678]">Tạm tính</span>
          <strong className="text-sm text-[#0b1730]">
            {formatCurrencyVND(selectedPackage.amount)}
          </strong>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#5d6678]">Phí cổng thanh toán</span>
          <strong className="text-sm text-[#0b1730]">0 VNĐ</strong>
        </div>

        <hr className="border-[#d3e4f8]" />

        <div className="flex items-center justify-between">
          <span className="font-semibold text-[#0b1730]">Tổng thanh toán</span>
          <strong className="text-2xl text-[#005baa]">
            {formatCurrencyVND(selectedPackage.amount)}
          </strong>
        </div>
      </div>

      <button
        type="button"
        onClick={handlePayment}
        disabled={creatingPayment}
        className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(120deg,_#005baa,_#00a9e0)] px-5 py-4 text-sm font-bold uppercase tracking-[0.14em] text-white transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_35px_-22px_rgba(0,91,170,0.75)] disabled:cursor-not-allowed disabled:opacity-70"
      >
        ➡️
        {creatingPayment ? "Đang tạo URL..." : "Thanh toán qua VNPay"}
      </button>

      <p className="mt-4 text-center text-xs leading-relaxed text-[#5d6678]">
        Bấm nút thanh toán, bạn đồng ý với điều khoản giao dịch và chính sách bảo mật của VNPay.
      </p>
    </aside>
  );
}