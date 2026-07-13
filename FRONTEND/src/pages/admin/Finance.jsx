import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import StatCard from "../../components/user/dashboard/StatCard";
import SearchInput from "../../components/common/SearchInput";
import AdminRevenueChart from "../../components/admin/finance/AdminRevenueChart";
import AdminTransactionsFilter from "../../components/admin/finance/AdminTransactionsFilter";
import AdminTransactionsTable from "../../components/admin/finance/AdminTransactionsTable";
import TransactionDetailModal from "../../components/user/Finance/TransactionDetailModal";
import { adminFinanceService } from "../../services/adminFinanceService";
import { formatCurrencyVND, formatInteger } from "../../utils/format";

export default function AdminFinance() {
  const searchRef = useRef();

  const [summary, setSummary] = useState(null);
  const [txs, setTxs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    type: "",
    status: "",
  });

  const [selectedTxId, setSelectedTxId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const year = 2026;

  const fetchSummary = useCallback(async () => {
    const res = await adminFinanceService.getRevenueSummary(year);
    if (res.code === 1000) setSummary(res.result);
  }, [year]);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminFinanceService.getTransactions({
        ...filters,
        page,
        size: 5,
      });
      setTxs(res.result.data || []);
      setTotalPages(res.result.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
    setPage(1);
  };

  const handleApplyFilters = (nextFilters) => {
    const currentKeyword = searchRef.current?.value || "";
    setFilters((prev) => ({
      ...prev,
      keyword: currentKeyword,
      ...nextFilters,
    }));
    setPage(1);
  };

  const openDetail = (id) => {
    setSelectedTxId(id);
    setIsModalOpen(true);
  };

  const monthlyRevenue = useMemo(
    () => (Array.isArray(summary?.monthlyRevenue) ? summary.monthlyRevenue : []),
    [summary?.monthlyRevenue]
  );

  return (
    <div className="space-y-6">
      <HeaderCard title="Quản lý tài chính" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Tổng doanh thu" value={summary?.totalRevenue} formatValue={formatCurrencyVND} />
        <StatCard title="Doanh thu hôm nay" value={summary?.revenueToday} formatValue={formatCurrencyVND} />
        <StatCard title="Doanh thu tháng này" value={summary?.revenueThisMonth} formatValue={formatCurrencyVND} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Doanh thu năm nay" value={summary?.revenueThisYear} formatValue={formatCurrencyVND} />
        <StatCard title="Tổng giao dịch" value={summary?.totalTransactions} formatValue={formatInteger} />
        <StatCard title="Tổng nạp / Phí tin" value={`${summary?.totalDeposits || 0} / ${summary?.totalPostFees || 0}`} formatValue={(v) => v} />
      </div>

      <AdminRevenueChart monthlyRevenue={monthlyRevenue} />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <SearchInput ref={searchRef} onSearch={handleSearch} />
        </div>
        <AdminTransactionsFilter value={filters} onApply={handleApplyFilters} />
      </div>

      <AdminTransactionsTable
        data={txs}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onRowClick={openDetail}
      />

      <TransactionDetailModal
        transactionId={selectedTxId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        fetchDetail={adminFinanceService.getTransactionDetail}
      />
    </div>
  );
}