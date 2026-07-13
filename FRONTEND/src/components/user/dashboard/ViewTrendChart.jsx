import { Line } from 'react-chartjs-2';

export default function ViewTrendChart({ data, options }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <h3 className="text-base font-bold text-gray-900">Xu hướng lượt xem 7 ngày</h3>
      <div className="mt-4 h-[320px]">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}