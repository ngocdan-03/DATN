import { useEffect, useMemo, useState } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import StatCard from "../../components/user/dashboard/StatCard";
import AdminRevenueChart from "../../components/admin/dashboard/AdminRevenueChart";
import { adminDashboardService } from "../../services/adminDashboardService";
import { formatCurrencyVND, formatInteger } from "../../utils/format";

export default function AdminDashBoard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const year = 2026;

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await adminDashboardService.getOverview(year);
        if (response.code === 1000 && response.result) {
          setOverview(response.result);
        } else {
          setError(response.message || "Không thể tải dữ liệu tổng quan admin.");
        }
      } catch (err) {
        setError(err?.message || "Không thể tải dữ liệu tổng quan admin.");
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [year]);

  const monthlyRevenue = useMemo(
    () => (Array.isArray(overview?.monthlyRevenue) ? overview.monthlyRevenue : []),
    [overview?.monthlyRevenue]
  );

  if (loading) return <div>Đang tải dữ liệu tổng quan...</div>;
  if (error) return <div className="text-red-500">Lỗi: {error}</div>;

  return (
    <div className="space-y-6">
      <HeaderCard title="Tổng quan quản trị" />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Tổng người dùng" value={overview?.totalUsers} formatValue={formatInteger} />
        <StatCard title="Tổng bài đăng" value={overview?.totalPosts} formatValue={formatInteger} />
        <StatCard title="Bài chờ duyệt" value={overview?.pendingPosts} formatValue={formatInteger} />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard title="Doanh thu tổng" value={overview?.totalRevenue} formatValue={formatCurrencyVND} />
        <StatCard title="Doanh thu tháng này" value={overview?.revenueThisMonth} formatValue={formatCurrencyVND} />
        <StatCard title="Người dùng mới" value={overview?.newUsersThisMonth} formatValue={formatInteger} />
      </div>

      <AdminRevenueChart monthlyRevenue={monthlyRevenue} />
    </div>
  );
}