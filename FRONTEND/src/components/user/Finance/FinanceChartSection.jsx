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

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


export default function FinanceChartSection({ chartData = [] }) {
    const barChartData = useMemo(
        () => ({
            // Dùng chartData truyền từ cha xuống
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
        [chartData]
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
                        padding: 20,
                        font: { size: 12, weight: '600', family: 'Manrope' }
                    },
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    padding: 12,
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: (context) => {
                            const label = context.dataset.label || '';
                            const value = context.parsed.y;
                            return `${label}: ${new Intl.NumberFormat('vi-VN').format(value)} VND`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: {
                        font: { size: 11 },
                        callback: (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0)),
                    },
                },
                x: {
                    grid: { display: false },
                    ticks: { font: { size: 11, weight: '500' } }
                },
            },
        }),
        [],
    );

    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-2 border-b border-slate-50 pb-4 md:flex-row md:items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-900 [font-family:Manrope]">Dòng tiền 6 tháng gần nhất</h3>
                    <p className="text-sm font-medium text-slate-500">So sánh biến động nạp tiền và chi tiêu dịch vụ.</p>
                </div>
            </div>
            
            <div className="h-[350px] w-full">
                <Bar data={barChartData} options={barChartOptions} />
            </div>
        </section>
    );
};