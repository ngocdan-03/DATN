import { useState } from "react";
import Pagination from "../../common/Pagination";
import AppModal from "../../modals/AppModal";
import { formatDateTime } from "../../../utils/format";
import { adminUsersService } from "../../../services/adminUsersService";
import AdminUserDetailModal from "./AdminUserDetailModal";

export default function AdminUsersTable({
  data = [],
  page = 1,
  totalPages = 1,
  loading = false,
  onPrev,
  onNext,
  onReload,
}) {
  const [detailUserId, setDetailUserId] = useState(null);
  const [modal, setModal] = useState({ open: false, userId: null });

  const handleToggleLock = async () => {
    try {
      await adminUsersService.toggleLock(modal.userId);
      onReload && onReload();
    } finally {
      setModal({ open: false, userId: null });
    }
  };

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">
          <span>Danh sách người dùng</span>
          <span className="rounded-full bg-slate-100 px-2 py-1">{data.length} user</span>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
              <tr>
                <th className="px-5 py-4 text-center">ID</th>
                <th className="px-5 py-4">Họ tên</th>
                <th className="px-5 py-4">Email</th>
                <th className="px-5 py-4">SĐT</th>
                <th className="px-5 py-4">Xác minh</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4">Ngày tạo</th>
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
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                data.map((user) => {
                  const verified = user.isVerified;
                  const locked = user.isLocked;

                  return (
                    <tr key={user.id} className="group transition-colors hover:bg-slate-50/50">
                      <td className="px-5 py-4 text-center font-bold text-[#0f172a]">#{user.id}</td>
                      <td className="px-5 py-4 font-semibold text-[#1e293b]">{user.fullName}</td>
                      <td className="px-5 py-4 text-slate-600">{user.email}</td>
                      <td className="px-5 py-4 text-slate-600">{user.phone}</td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${verified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-amber-50 text-amber-700 border border-amber-200"}`}>
                          {verified ? "Đã xác minh" : "Chưa xác minh"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${locked ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-slate-50 text-slate-700 border border-slate-200"}`}>
                          {locked ? "Đang khóa" : "Hoạt động"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">{formatDateTime(user.createdAt)}</td>
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setDetailUserId(user.id)}
                            className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#1d4ed8] hover:bg-[#dbeafe] transition-all active:scale-95"
                          >
                            Chi tiết
                          </button>
                          <button
                            onClick={() => setModal({ open: true, userId: user.id })}
                            className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all active:scale-95 ${locked ? "border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100" : "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"}`}
                          >
                            {locked ? "Mở khóa" : "Khóa"}
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
        message="Bạn chắc chắn muốn thay đổi trạng thái tài khoản này?"
        confirmText="Xác nhận"
        onClose={() => setModal({ open: false, userId: null })}
        onConfirm={handleToggleLock}
      />

      <AdminUserDetailModal
        userId={detailUserId}
        onClose={() => setDetailUserId(null)}
      />
    </div>
  );
}