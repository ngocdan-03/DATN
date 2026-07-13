import { Link } from 'react-router-dom';
import { CATEGORY } from '../../../constants/news';

export default function NewCard({ item }) {

	const category = CATEGORY.find((cat) => cat.value === item.category)?.label || 'Tin tức';
	const detailPath = `/news/${item.id}`;

	return (
		<article className="group">
			
			{/* Thumbnail */}
			<Link
				to={detailPath}
				className="block relative mb-6 aspect-[4/3] overflow-hidden rounded-sm bg-[#f5f3f4]"
			>
				<img
					alt={item.title}
					className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
					src={item.thumbnailUrl}
				/>
				<div className="absolute left-4 top-4 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#041627] backdrop-blur-sm">
					{category}
				</div>
			</Link>

			{/* Content */}
			<div className="px-2">
				<h3 className="mb-3 text-xl leading-tight text-[#041627] transition-colors [font-family:Noto_Serif] group-hover:text-[#735c00]">
					<Link
						to={detailPath}
						className="hover:underline decoration-[#735c00]/50 underline-offset-4"
					>
						{item.title}
					</Link>
				</h3>

				<div className="mt-6 flex items-center justify-between border-t border-[#c4c6cd]/10 pt-4">
					
					{/* Source */}
					<span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase text-[#44474c]">
						📧 {item.sourceName}
					</span>

					{/* Date */}
					<span className="inline-flex items-center gap-1 text-[10px] text-[#44474c]/60">
						📅 {item.displayDate}
					</span>

				</div>
			</div>

		</article>
	);
}