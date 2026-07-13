import { PAYMENT_PACKAGES } from "../../../constants/payment";
import { formatCurrencyVND } from "../../../utils/format";

export default function PaymentPackageList({ selectedPackageId, onSelectPackage }) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-2xl [font-family:Noto_Serif]">Chọn gói dịch vụ</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {PAYMENT_PACKAGES.map((pkg) => {
          const isSelected = selectedPackageId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => onSelectPackage(pkg.id)}
              className={`rounded-2xl border bg-white p-5 text-left transition-all duration-300 ${
                isSelected
                  ? "border-[#005baa] bg-[linear-gradient(180deg,rgba(0,91,170,0.08),rgba(255,255,255,1))] shadow-[0_18px_36px_-22px_rgba(0,91,170,0.6)]"
                  : "border-[#c6dfff] hover:-translate-y-1 hover:border-[#8ac2ff] hover:shadow-[0_18px_40px_-24px_rgba(0,91,170,0.48)]"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${pkg.accentClass}`}>
                  {pkg.label}
                </p>
                {isSelected ? <span className="text-sm font-bold text-[#005baa]">✓</span> : null}
              </div>

              <p className="mt-3 whitespace-nowrap text-3xl font-bold">
                {formatCurrencyVND(pkg.amount)}
              </p>

              <p className="mt-3 text-sm text-[#5d6678]">{pkg.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}