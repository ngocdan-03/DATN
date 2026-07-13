import { POST_STATUS } from "../../../../constants/posts";

export default function PostsFilter({ value = "", onChange }) {
	const options = [
		{ value: "", label: "Tất cả" },
		...Object.values(POST_STATUS).filter(
			(status) => status.value !== "DELETED"
		),
	];

	return (
		<select
			value={value}
			onChange={(e) => onChange(e.target.value)}
			className="h-11 min-w-[180px] rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0d4f9f]"
		>
			{options.map((option) => (
				<option key={option.value || ""} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	);
}