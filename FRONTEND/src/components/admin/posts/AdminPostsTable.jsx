import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppModal from "../../modals/AppModal";
import Pagination from "../../common/Pagination";
import { POST_STATUS } from "../../../constants/posts";
import { formatCurrencyVND, formatInteger } from "../../../utils/format";
import { adminPostsService } from "../../../services/adminPostsService";

export default function AdminPostsTable({
  data = [],
  page = 1,
  totalPages = 1,
  loading = false,
  onPrev,
  onNext,
  onReload,
}) {
  const navigate = useNavigate();
  const [modal, setModal] = useState({ open: false, type: "warning", postId: null, action: null });

  const openConfirm = (postId, action) => {
    setModal({ open: true, type: "warning", postId, action });
  };

  const handleConfirm = async () => {
    try {
      if (modal.action === "approve") await adminPostsService.approvePost(modal.postId);
      if (modal.action === "reject") await adminPostsService.rejectPost(modal.postId);
      if (modal.action === "delete") await adminPostsService.deletePost(modal.postId);
      onReload && onReload();
    } finally {
      setModal({ open: false, type: "warning", postId: null, action: null });
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">
          <span>Danh sách bài đăng</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">{data.length} bài</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
              <tr>
                <th className="px-5 py-4 text-center">ID</th>
                <th className="px-5 py-4">Tiêu đề</th>
                <th className="px-5 py-4">Giá</th>
                <th className="px-5 py-4">Diện tích</th>
                <th className="px-5 py-4">Loại</th>
                <th className="px-5 py-4">Khu vực</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#f1f5f9]">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
                      <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-20 text-center text-slate-400 font-medium">
                    Không có bài đăng phù hợp.
                  </td>
                </tr>
              ) : (
                data.map((post) => {
                  const status = POST_STATUS[post.status] || { label: post.status, color: "#64748b" };
                  const isPending = post.status === "PENDING";

                  return (
                    <tr key={post.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-center font-bold text-[#0f172a]">#{post.id}</td>
                      <td className="px-5 py-4">
                        <p
                          className="max-w-[320px] line-clamp-2 font-semibold text-[#1e293b] group-hover:text-blue-600 transition-colors cursor-pointer"
                          onClick={() => navigate(`/posts/${post.id}`)}
                        >
                          {post.title}
                        </p>
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-700">
                        {formatCurrencyVND(post.price)}
                      </td>
                      <td className="px-5 py-4 font-medium text-slate-600">
                        {formatInteger(post.area)} m²
                      </td>
                      <td className="px-5 py-4 text-slate-600">
                        {post.propertyType} • {post.listingType}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{post.wardName}</td>
                      <td className="px-5 py-4">
                        <span
                          className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                          style={{
                            backgroundColor: `${status.color}15`,
                            color: status.color,
                            border: `1px solid ${status.color}30`,
                          }}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => navigate(`/posts/${post.id}`)}
                            className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#1d4ed8] hover:bg-[#dbeafe] transition-all active:scale-95"
                          >
                            Xem
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => openConfirm(post.id, "approve")}
                                className="rounded-lg border border-[#bbf7d0] bg-[#ecfdf5] px-3 py-1.5 text-xs font-bold text-[#047857] hover:bg-[#d1fae5] transition-all active:scale-95"
                              >
                                Duyệt
                              </button>
                              <button
                                onClick={() => openConfirm(post.id, "reject")}
                                className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2] transition-all active:scale-95"
                              >
                                Từ chối
                              </button>
                            </>
                          )}
                          <button
                            onClick={() => openConfirm(post.id, "delete")}
                            className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-1.5 text-xs font-bold text-[#b45309] hover:bg-[#fef3c7] transition-all active:scale-95"
                          >
                            Xóa
                          </button>
                        </div>
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

      <AppModal
        open={modal.open}
        type="warning"
        title="Xác nhận thao tác"
        message="Bạn chắc chắn muốn thực hiện hành động này?"
        confirmText="Xác nhận"
        onClose={() => setModal({ open: false, type: "warning", postId: null, action: null })}
        onConfirm={handleConfirm}
      />
    </div>
  );
}