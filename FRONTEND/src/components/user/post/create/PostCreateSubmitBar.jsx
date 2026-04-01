import AppIcon from '../../../common/AppIcon';

const PostCreateSubmitBar = ({ isSubmitting }) => {
	return (
		<div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur">
			<button
				type="submit"
				disabled={isSubmitting}
				className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-3 text-xs font-extrabold uppercase tracking-widest text-white transition hover:from-blue-800 hover:to-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:px-12 md:text-sm"
			>
				<AppIcon name="plus" className="h-4 w-4" />
				{isSubmitting ? 'Đang gửi...' : 'Đăng tin ngay'}
			</button>
		</div>
	);
};

export default PostCreateSubmitBar;
