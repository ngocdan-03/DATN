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
import { Doughnut, Line } from 'react-chartjs-2';
import StateCard from '../../common/StateCard';
import { POST_STATUS_LABELS } from '../../../constants/postFilters';
import { getDashboardOverview } from '../../../services/dashboardService';
import { createLogger } from '../../../utils/logger';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, ArcElement, Tooltip, Legend, Filler);

const logDashboardOverview = createLogger('DashboardOverviewSection');

const STATUS_COLORS = {
	PENDING: '#f59e0b',
	APPROVED: '#10b981',
	REJECTED: '#ef4444',
	DELETED: '#64748b',
	EXPIRED: '#64748b',
};

const formatCurrencyVND = (value) => {
	const amount = Number(value || 0);
	return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount)} VND`;
};

const formatInteger = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

const DashboardOverviewSection = () => {
	const [overview, setOverview] = useState(null);
	const [loadingOverview, setLoadingOverview] = useState(true);
	const [overviewError, setOverviewError] = useState('');

	useEffect(() => {
		const fetchOverview = async () => {
			setLoadingOverview(true);
			setOverviewError('');
			logDashboardOverview('Fetch overview start');

			try {
				const response = await getDashboardOverview();
				if (response.data?.code === 1000 && response.data?.result) {
					setOverview(response.data.result);
					logDashboardOverview('Fetch overview success', {
						balance: response.data.result.balance,
						livePostsCount: response.data.result.livePostsCount,
						totalViews: response.data.result.totalViews,
					});
					return;
				}

				setOverviewError(response.data?.message || 'Không thể tải dữ liệu tổng quan dashboard.');
			} catch (error) {
				setOverviewError(error.response?.data?.message || 'Không thể tải dữ liệu tổng quan dashboard.');
				logDashboardOverview('Fetch overview failed', {
					httpStatus: error.response?.status,
					code: error.response?.data?.code || error.code,
					message: error.response?.data?.message || error.message,
				});
			} finally {
				setLoadingOverview(false);
			}
		};

		fetchOverview();
	}, []);

	const viewTrend = useMemo(() => (Array.isArray(overview?.viewTrend) ? overview.viewTrend : []), [overview?.viewTrend]);
	const statusDistribution = useMemo(
		() => (Array.isArray(overview?.statusDistribution) ? overview.statusDistribution : []),
		[overview?.statusDistribution],
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
		[viewTrend],
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
			labels: statusDistribution.map((item) => POST_STATUS_LABELS[item?.status] || item?.status || 'Khác'),
			datasets: [
				{
					data: statusDistribution.map((item) => Number(item?.count || 0)),
					backgroundColor: statusDistribution.map((item) => STATUS_COLORS[item?.status] || '#64748b'),
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
		[],
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
		[],
	);

	if (loadingOverview) {
		return <StateCard message="Đang tải dữ liệu tổng quan..." className="rounded-2xl" />;
	}

	if (overviewError) {
		return <StateCard variant="error" title="Không tải được dashboard" message={overviewError} className="rounded-2xl" />;
	}

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
				<article className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Số dư ví</p>
					<p className="mt-3 text-2xl font-extrabold text-[#0f172a]">{formatCurrencyVND(overview?.balance)}</p>
				</article>

				<article className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Số bài đăng đang sống</p>
					<p className="mt-3 text-2xl font-extrabold text-[#0f172a]">{formatInteger(overview?.livePostsCount)}</p>
				</article>

				<article className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Lượt xem tin</p>
					<p className="mt-3 text-2xl font-extrabold text-[#0f172a]">{formatInteger(overview?.totalViews)}</p>
				</article>
			</div>

			<div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
				<section className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<h3 className="text-base font-bold text-[#0f172a]">Xu hướng lượt xem 7 ngày</h3>
					<div className="mt-4 h-[320px]">
						<Line data={viewTrendChartData} options={lineChartOptions} />
					</div>
				</section>

				<section className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<h3 className="text-base font-bold text-[#0f172a]">Tỷ lệ trạng thái tin</h3>
					<div className="mt-4 h-[320px]">
						<Doughnut data={statusDoughnutChartData} options={doughnutChartOptions} />
					</div>
				</section>
			</div>
		</div>
	);
};

export default DashboardOverviewSection;