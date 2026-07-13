import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function PostCreateSubmitBar({ isEdit = false }) {
	const { formState: { isSubmitting } } = useFormContext();

	return (
		<div className="sticky bottom-4 z-10 flex justify-end rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-lg backdrop-blur">
			<button
				type="submit"
				disabled={isSubmitting} // Chặn user ấn liên tục lúc đang up ảnh
				className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-700 to-blue-600 px-8 py-3 text-xs font-extrabold uppercase tracking-widest text-white transition hover:from-blue-800 hover:to-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:px-12 md:text-sm"
			>
				{isSubmitting ? (
					<>
						<svg className="mr-2 h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
							<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
							<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						Đang xử lý tải ảnh...
					</>
				) : (
					<>
						<svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
							<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
						</svg>
						{isEdit ? 'Cập nhật bài đăng' : 'Đăng tin ngay'}
					</>
				)}
			</button>
		</div>
	);
}