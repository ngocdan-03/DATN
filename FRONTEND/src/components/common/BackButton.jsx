import { useNavigate } from "react-router-dom";

export default function BackButton() {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(-1)}
			className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border hover:bg-gray-100 mb-10"
		>
			<span>←</span>
			Quay lại
		</button>
	);
}