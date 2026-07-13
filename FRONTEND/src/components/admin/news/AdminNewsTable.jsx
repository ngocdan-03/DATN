import { useState } from "react";
import Pagination from "../../common/Pagination";
import AppModal from "../../modals/AppModal";
import { CATEGORY } from "../../../constants/news";
import { formatDateTime } from "../../../utils/format";
import { adminNewsService } from "../../../services/adminNewsService";
import { useNavigate } from "react-router-dom";

const statusBadge = (status) =>
  status === "PUBLISHED"
    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
    : "bg-amber-50 text-amber-700 border-amber-200";

export default function AdminNewsTable({
  data = [],
  page = 1,
  totalPages = 1,
  loading = false,
  onPrev,
  onNext,
  onReload,
}) {
  const [modal, setModal] = useState({ open: false, type: "", id: null });
  const navigate = useNavigate();

  const handleConfirm = async () => {
    try {
      if (modal.type === "hide") await adminNewsService.hideNews(modal.id);
      if (modal.type === "show") await adminNewsService.showNews(modal.id);
      onReload && onReload();
    } finally {
      setModal({ open: false, type: "", id: null });
    }
  };

  const getCategoryLabel = (value) =>
    CATEGORY.find((c) => c.value === value)?.label || value;

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">
          <span>Danh sách tin tức</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">{data.length} tin</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
              <tr>
                <th className="px-5 py-4 text-center">ID</th>
                <th className="px-5 py-4">Tiêu đề</th>
                <th className="px-5 py-4">Nguồn</th>
                <th className="px-5 py-4">Chuyên mục</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
                      <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-20 text-center text-slate-400 font-medium">
                    Không có tin tức phù hợp.
                  </td>
                </tr>
              ) : (
                data.map((news) => (
                  <tr key={news.id} className="group transition-colors hover:bg-slate-50/50">
                    <td className="px-5 py-4 text-center font-bold text-[#0f172a]">#{news.id}</td>
                    <td className="px-5 py-4">
                      <p className="max-w-[360px] line-clamp-2 font-semibold text-[#1e293b]">
                        {news.title}
                      </p>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{news.sourceName}</td>
                    <td className="px-5 py-4 text-slate-600">{getCategoryLabel(news.category)}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border ${statusBadge(news.status)}`}>
                        {news.status === "PUBLISHED" ? "Hiển thị" : "Đang ẩn"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600 text-xs">{formatDateTime(news.createdAt)}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/news/${news.id}/edit`)}
                          className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-1.5 text-xs font-bold text-[#b45309] hover:bg-[#fef3c7] transition-all active:scale-95"
                        >
                          Sửa
                        </button>
                        {news.status === "PUBLISHED" ? (
                          <button
                            onClick={() => setModal({ open: true, type: "hide", id: news.id })}
                            className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2] transition-all active:scale-95"
                          >
                            Ẩn
                          </button>
                        ) : (
                          <button
                            onClick={() => setModal({ open: true, type: "show", id: news.id })}
                            className="rounded-lg border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#047857] hover:bg-[#d1fae5] transition-all active:scale-95"
                          >
                            Hiện
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-[#f1f5f9] bg-[#f8fafc]/50">
          <Pagination currentPage={page} totalPages={totalPages} loading={loading} onPrev={onPrev} onNext={onNext} />
        </div>
      </section>

      <AppModal
        open={modal.open}
        type="warning"
        title="Xác nhận thao tác"
        message="Bạn chắc chắn muốn thay đổi trạng thái tin tức này?"
        confirmText="Xác nhận"
        onClose={() => setModal({ open: false, type: "", id: null })}
        onConfirm={handleConfirm}
      />
    </div>
  );
}