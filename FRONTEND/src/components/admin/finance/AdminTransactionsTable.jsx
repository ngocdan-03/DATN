import Pagination from "../../common/Pagination";
import { formatSignedAmount } from "../../../utils/format";
import { getStatusConfig } from "../../../constants/finance";
import { TYPE_LABELS } from "../../../constants/finance";

export default function AdminTransactionsTable({
  data = [],
  page = 1,
  totalPages = 1,
  loading = false,
  onPrev,
  onNext,
  onRowClick,
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 [font-family:Manrope]">
          Lịch sử giao dịch
        </h3>
        <span className="text-xs font-medium text-slate-400">
          Hiển thị {data.length} kết quả gần nhất
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
              <th className="px-6 py-4">Mã GD</th>
              <th className="px-6 py-4">Người dùng</th>
              <th className="px-6 py-4">Loại hình</th>
              <th className="px-6 py-4">Nội dung</th>
              <th className="px-6 py-4">Số tiền</th>
              <th className="px-6 py-4 text-center">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thời gian</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading ? (
              <tr>
                <td colSpan="7" className="py-20 text-center text-slate-400">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-12 text-center text-slate-400 font-medium">
                  Không có dữ liệu giao dịch nào.
                </td>
              </tr>
            ) : (
              data.map((item) => {
                const isPost = item.type === "POST_FEE";
                const statusConfig = getStatusConfig(item.status);

                return (
                  <tr
                    key={item.id}
                    className="group transition-colors hover:bg-slate-50/80"
                    onClick={() => onRowClick && onRowClick(item.id)}
                  >
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">#{item.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-700">{item.ownerName}</p>
                      <p className="text-xs text-slate-400">{item.ownerEmail}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                      {TYPE_LABELS[item.type] || item.type}
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-[300px] truncate font-medium text-slate-700" title={item.description}>
                        {item.description}
                      </p>
                    </td>
                    <td className={`px-6 py-4 font-black whitespace-nowrap ${isPost ? "text-rose-600" : "text-emerald-600"}`}>
                      {formatSignedAmount(item.amount, isPost)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-tight ${statusConfig.badgeClass}`}>
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-slate-400 whitespace-nowrap">
                      {item.createdAt?.split(" ")[0] || "--/--/----"}
                      <span className="block text-[10px] opacity-70">{item.createdAt?.split(" ")[1] || ""}</span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#f1f5f9] bg-[#f8fafc]/50">
        <Pagination currentPage={page} totalPages={totalPages} loading={loading} onPrev={onPrev} onNext={onNext} />
      </div>
    </section>
  );
}