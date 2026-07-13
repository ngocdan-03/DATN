import { useMemo } from "react";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { formatCurrencyVND } from "../../../utils/format";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

export default function AdminRevenueChart({ monthlyRevenue = [] }) {
  const chartData = useMemo(
    () => ({
      labels: monthlyRevenue.map((item) => `Tháng ${item.month}`),
      datasets: [
        {
          label: "Doanh thu",
          data: monthlyRevenue.map((item) => Number(item.revenue || 0)),
          backgroundColor: "#0d4f9f",
          borderRadius: 6,
          maxBarThickness: 28,
        },
      ],
    }),
    [monthlyRevenue]
  );

  const chartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (context) => `Doanh thu: ${formatCurrencyVND(context.parsed.y)}`,
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (value) => formatCurrencyVND(Number(value || 0)),
          },
          grid: { color: "rgba(148, 163, 184, 0.25)" },
        },
        x: { grid: { display: false } },
      },
    }),
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between border-b border-slate-50 pb-4">
        <h3 className="text-lg font-bold text-slate-900 [font-family:Manrope]">
          Doanh thu theo tháng
        </h3>
        <span className="text-xs font-medium text-slate-400">12 tháng gần nhất</span>
      </div>

      <div className="h-[320px] w-full">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </section>
  );
}