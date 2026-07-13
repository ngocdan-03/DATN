import { useEffect, useState } from "react";
import { adminUsersService } from "../../../services/adminUsersService";
import { formatCurrencyVND, formatDateTime, formatInteger } from "../../../utils/format";
import FinanceTransactionsSection from "../../user/Finance/FinanceTransactionsSection";
import Pagination from "../../common/Pagination";

export default function AdminUserDetailModal({ userId, onClose }) {
  const [detailBase, setDetailBase] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    setPage(1);
  }, [userId]);

  useEffect(() => {
    if (!userId) return;

    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await adminUsersService.getUserDetail(userId, { page, size: 5 });
        if (res.code === 1000) {
          const result = res.result || {};

          if (page === 1) {
            setDetailBase(result);
          }

          setTransactions(result.recentTransactions?.data || []);
          setTotalPages(result.recentTransactions?.totalPages || 1);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [userId, page]);

  if (!userId) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Chi tiết người dùng</h3>
            <p className="text-sm text-slate-500">ID: #{detailBase?.id}</p>
          </div>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800">✕</button>
        </div>

        <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-3">
          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Họ tên</p>
            <p className="text-sm font-bold text-slate-900">{detailBase?.fullName}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Email</p>
            <p className="text-sm font-medium text-slate-700">{detailBase?.email}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">SĐT</p>
            <p className="text-sm font-medium text-slate-700">{detailBase?.phone}</p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Số dư ví</p>
            <p className="text-lg font-black text-slate-900">{formatCurrencyVND(detailBase?.balance)}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Ngày tạo</p>
            <p className="text-sm font-medium text-slate-700">{formatDateTime(detailBase?.createdAt)}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Cập nhật</p>
            <p className="text-sm font-medium text-slate-700">{formatDateTime(detailBase?.updatedAt)}</p>
          </div>

          <div className="rounded-xl border bg-slate-50 p-4">
            <p className="text-xs uppercase text-slate-400">Tổng bài đăng</p>
            <p className="text-sm font-bold text-slate-900">{formatInteger(detailBase?.totalPosts)}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Đã duyệt</p>
            <p className="text-sm font-medium text-slate-700">{formatInteger(detailBase?.approvedPosts)}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Chờ duyệt</p>
            <p className="text-sm font-medium text-slate-700">{formatInteger(detailBase?.pendingPosts)}</p>
            <p className="mt-2 text-xs uppercase text-slate-400">Từ chối</p>
            <p className="text-sm font-medium text-slate-700">{formatInteger(detailBase?.rejectedPosts)}</p>
          </div>
        </div>

        <div className="px-6 pb-6">
          <FinanceTransactionsSection transactions={transactions} loading={loading} onRowClick={() => {}} />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            loading={loading}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
          />
        </div>
      </div>
    </div>
  );
}