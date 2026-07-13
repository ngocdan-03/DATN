import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { newsService } from "../../services/newsService";
import BackButton from "../../components/common/BackButton";

export default function NewsDetail() {
	const { id } = useParams();

	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(false);

	const fetchDetail = useCallback(async () => {
		try {
			setLoading(true);
			const res = await newsService.getNewsDetail(id);
			setData(res.result);
		} catch (err) {
			console.error("Lỗi:", err);
		} finally {
			setLoading(false);
		}
	}, [id]);

	useEffect(() => {
		fetchDetail();
		window.scrollTo(0, 0);
	}, [fetchDetail]);

	// loading
	if (loading) {
		return <p className="text-center py-10">Đang tải...</p>;
	}

	// not found
	if (!data) {
		return <p className="text-center py-10">Không tìm thấy bài viết</p>;
	}

	return (
		<main className="mx-auto max-w-[900px] px-6 py-10">
            <BackButton />

			{/* CATEGORY */}
			<span className="inline-block mb-3 rounded-full bg-[#041627] px-3 py-1 text-xs font-semibold text-white">
				{data.category}
			</span>

			{/* TITLE */}
			<h1 className="mb-4 text-3xl font-bold leading-tight text-[#041627]">
				{data.title}
			</h1>

			{/* META */}
			<div className="mb-6 flex items-center justify-between text-sm text-gray-500">
				<span>{data.displayDate}</span>
				<span>Nguồn: {data.sourceName}</span>
			</div>

			{/* IMAGE */}
			<img
				src={data.thumbnailUrl}
				alt={data.title}
				className="mb-6 w-full rounded-xl object-cover"
			/>

			{/* SUMMARY (CONTENT) */}
			<div className="space-y-4 text-[15px] leading-relaxed text-gray-800">
				{data.summary.split("\n").map((para, index) => (
					<p key={index}>{para}</p>
				))}
			</div>

			{/* LINK GỐC */}
			<div className="mt-8">
				<a
					href={data.originalUrl}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block rounded-md bg-[#041627] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0a2a47]"
				>
					Xem bài gốc →
				</a>
			</div>

		</main>
	);
}