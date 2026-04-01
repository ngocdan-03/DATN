const LoginRequiredModal = ({
	open,
	title = 'Yêu cầu đăng nhập',
	message,
	onClose,
	onConfirm,
	confirmLabel = 'Đăng nhập',
}) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041627]/70 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
				<div className="mb-6">
					<h3 className="text-2xl font-bold text-[#041627] [font-family:Noto_Serif]">{title}</h3>
					<p className="mt-2 text-sm text-[#44474c]">
						{message || 'Bạn cần đăng nhập để tiếp tục thao tác này.'}
					</p>
				</div>

				<div className="flex gap-3">
					<button
						type="button"
						onClick={onClose}
						className="w-1/2 rounded-xl border border-[#c4c6cd] px-4 py-3 text-sm font-semibold text-[#44474c] transition-colors hover:bg-[#f5f3f4]"
					>
						Đóng
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="w-1/2 rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-105"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
};

export default LoginRequiredModal;
