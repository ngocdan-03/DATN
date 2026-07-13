import { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { POST_STATUS } from '../../constants/posts';
import { dashboardService } from '../../services/dashboardService';
import { formatCurrencyVND, formatInteger } from '../../utils/format';
import StatCard from '../../components/user/dashboard/StatCard';
import HeaderCard from '../../components/user/dashboard/HeaderCard';
import ViewTrendChart from '../../components/user/dashboard/ViewTrendChart';
import StatusDoughnutChart from '../../components/user/dashboard/StatusDoughnutChart';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

export default function DashBoard() {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await dashboardService.getOverview();
        if (response.code === 1000 && response.overview) {
          setOverview(response.overview);
        } else {
          setError(response.message || 'Không thể tải dữ liệu tổng quan.');
        }
      } catch (err) {
        setError(err?.response?.data?.message|| err?.message || 'Không thể tải dữ liệu tổng quan.');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  const viewTrend = useMemo(() => (Array.isArray(overview?.viewTrend) ? overview.viewTrend : []), [overview?.viewTrend]);
  const statusDistribution = useMemo(
    () => (Array.isArray(overview?.statusDistribution) ? overview.statusDistribution : []),
    [overview?.statusDistribution]
  );

  const viewTrendChartData = useMemo(
    () => ({
      labels: viewTrend.map((item) => item?.label || '--/--'),
      datasets: [
        {
          label: 'Lượt xem',
          data: viewTrend.map((item) => Number(item?.value || 0)),
          borderColor: '#0d4f9f',
          backgroundColor: 'rgba(13, 79, 159, 0.14)',
          fill: true,
          tension: 0.35,
          pointRadius: 3,
          pointHoverRadius: 4,
        },
      ],
    }),
    [viewTrend]
  );

  const statusDoughnutChartData = useMemo(() => {
    if (!statusDistribution.length) {
      return {
        labels: ['Không có dữ liệu'],
        datasets: [
          {
            data: [1],
            backgroundColor: ['#cbd5e1'],
            borderColor: ['#ffffff'],
            borderWidth: 2,
          },
        ],
      };
    }

    return {
      labels: statusDistribution.map((item) => POST_STATUS[item?.status]?.label || item?.status || 'Khác'),
      datasets: [
        {
          data: statusDistribution.map((item) => Number(item?.count || 0)),
          backgroundColor: statusDistribution.map((item) => POST_STATUS[item?.status]?.color || '#64748b'),
          borderColor: ['#ffffff'],
          borderWidth: 2,
        },
      ],
    };
  }, [statusDistribution]);

  const lineChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 },
          grid: { color: 'rgba(148, 163, 184, 0.25)' },
        },
        x: {
          grid: { display: false },
        },
      },
    }),
    []
  );

  const doughnutChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            boxWidth: 14,
            padding: 12,
          },
        },
      },
    }),
    []
  );

  if (loading) {
    return <div>Đang tải dữ liệu tổng quan...</div>;
  }

  if (error) {
    return <div className="text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <HeaderCard title="Tổng quan" />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard
          title="Số dư ví"
          value={overview?.balance}
          formatValue={formatCurrencyVND}
        />
        <StatCard
          title="Số bài đăng đang sống"
          value={overview?.livePostsCount}
          formatValue={formatInteger}
        />
        <StatCard
          title="Lượt xem tin"
          value={overview?.totalViews}
          formatValue={formatInteger}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        <ViewTrendChart data={viewTrendChartData} options={lineChartOptions} />
        <StatusDoughnutChart data={statusDoughnutChartData} options={doughnutChartOptions} />
      </div>
    </div>
  );
};