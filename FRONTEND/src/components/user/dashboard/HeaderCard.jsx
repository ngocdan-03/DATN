export default function HeaderCard({ title }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow">
      <p className="text-sm font-semibold uppercase text-gray-500">Khu vực làm việc</p>
      <h1 className="mt-2 text-2xl font-bold text-gray-900">{title}</h1>
    </div>
  );
}