const VARIANT_STYLE = {
	success: {
		titleClass: 'text-emerald-700',
		buttonClass: 'from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600',
	},
	error: {
		titleClass: 'text-rose-700',
		buttonClass: 'from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600',
	},
	info: {
		titleClass: 'text-[#041627]',
		buttonClass: 'from-[#cca830] to-[#735c00] hover:brightness-105',
	},
};

const AppNoticeModal = ({
	open,
	title = 'Thông báo',
	message,
	variant = 'info',
	confirmLabel = 'OK',
	onConfirm,
}) => {
	if (!open) return null;

	const style = VARIANT_STYLE[variant] || VARIANT_STYLE.info;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041627]/70 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
				<div className="mb-6">
					<h3 className={`text-2xl font-bold [font-family:Noto_Serif] ${style.titleClass}`}>{title}</h3>
					<p className="mt-2 text-sm text-[#44474c]">{message || 'Đã có cập nhật mới.'}</p>
				</div>

				<button
					type="button"
					onClick={onConfirm}
					className={`w-full rounded-xl bg-gradient-to-r px-4 py-3 text-sm font-bold text-white transition-all ${style.buttonClass}`}
				>
					{confirmLabel}
				</button>
			</div>
		</div>
	);
};

export default AppNoticeModal;
