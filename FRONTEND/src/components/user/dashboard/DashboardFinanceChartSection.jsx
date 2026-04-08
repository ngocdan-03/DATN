import { useMemo } from 'react';
import {
	BarElement,
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LinearScale,
	Tooltip,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import StateCard from '../../common/StateCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const formatCurrencyVND = (value) => {
	const amount = Number(value || 0);
	return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount)} VND`;
};

const DashboardFinanceChartSection = ({ chartData, totalDeposit, totalSpend }) => {
	const hasOverviewData = chartData.length > 0 || totalDeposit > 0 || totalSpend > 0;

	const barChartData = useMemo(
		() => ({
			labels: chartData.map((item) => item?.label || item?.lable || '--/----'),
			datasets: [
				{
					label: 'Nạp tiền',
					data: chartData.map((item) => Number(item?.totalDeposit || 0)),
					backgroundColor: '#0d9488',
					borderRadius: 6,
					maxBarThickness: 28,
				},
				{
					label: 'Chi tiêu',
					data: chartData.map((item) => Number(item?.totalSpend || 0)),
					backgroundColor: '#f59e0b',
					borderRadius: 6,
					maxBarThickness: 28,
				},
			],
		}),
		[chartData],
	);

	const barChartOptions = useMemo(
		() => ({
			responsive: true,
			maintainAspectRatio: false,
			plugins: {
				legend: {
					position: 'top',
					labels: {
						usePointStyle: true,
						pointStyle: 'rectRounded',
						padding: 14,
					},
				},
			},
			scales: {
				y: {
					beginAtZero: true,
					grid: { color: 'rgba(148, 163, 184, 0.22)' },
					ticks: {
						callback: (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0)),
					},
				},
				x: {
					grid: { display: false },
				},
			},
		}),
		[],
	);

	if (!hasOverviewData) {
		return (
			<StateCard
				variant="info"
				title="Dữ liệu biểu đồ chỉ có ở trang đầu"
				message="Chuyển về trang 1 để xem tổng nạp, tổng chi và biểu đồ dòng tiền 6 tháng."
				className="rounded-2xl"
			/>
		);
	}

	return (
		<>
			<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
				<article className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Tổng nạp 6 tháng</p>
					<p className="mt-3 text-2xl font-extrabold text-[#0f172a]">{formatCurrencyVND(totalDeposit)}</p>
				</article>

				<article className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
					<p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#64748b]">Tổng chi 6 tháng</p>
					<p className="mt-3 text-2xl font-extrabold text-[#0f172a]">{formatCurrencyVND(totalSpend)}</p>
				</article>
			</div>

			<section className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
				<h3 className="text-base font-bold text-[#0f172a]">Dòng tiền 6 tháng gần nhất</h3>
				<p className="mt-1 text-sm text-[#64748b]">So sánh tổng nạp và tổng chi theo tháng.</p>
				<div className="mt-4 h-[340px]">
					<Bar data={barChartData} options={barChartOptions} />
				</div>
			</section>
		</>
	);
};

export default DashboardFinanceChartSection;
