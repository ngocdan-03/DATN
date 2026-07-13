export default function StatCard({ title, value, formatValue }) {
  return (
    <article className="rounded-2xl border bg-white p-5 shadow">
      <p className="text-xs font-semibold uppercase text-gray-500">{title}</p>
      <p className="mt-3 text-2xl font-extrabold text-gray-900">{formatValue(value)}</p>
    </article>
  );
}