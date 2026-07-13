import { Doughnut } from 'react-chartjs-2';

export default function StatusDoughnutChart({ data, options }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow">
      <h3 className="text-base font-bold text-gray-900">Tỷ lệ trạng thái tin</h3>
      <div className="mt-4 h-[320px]">
        <Doughnut data={data} options={options} />
      </div>
    </section>
  );
}