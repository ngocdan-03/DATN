import NewsPagination from '../news/NewsPagination';

const STATUS_LABELS = {
	SUCCESS: 'Thành công',
	PENDING: 'Đang xử lý',
	FAILED: 'Thất bại',
};

const STATUS_BADGE_CLASS = {
	SUCCESS: 'bg-[#ecfdf3] text-[#047857] border-[#a7f3d0]',
	PENDING: 'bg-[#fff7ed] text-[#b45309] border-[#fed7aa]',
	FAILED: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
};

const formatSignedAmount = (value, isPostTransaction) => {
	const amount = Number(value || 0);
	const sign = isPostTransaction ? '-' : '+';
	const normalizedAmount = `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(Math.abs(amount))} VND`;
	return `${sign}${normalizedAmount}`;
};

const DashboardFinanceTransactionsSection = ({
	transactions,
	currentPage,
	totalPages,
	loading,
	keywordInput,
	onKeywordInputChange,
	onSearch,
	onRowClick,
	onPrevPage,
	onNextPage,
}) => {
	return (
		<section className="overflow-hidden rounded-2xl border border-[#dbe8f6] bg-white shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
			<div className="border-b border-[#eef2f7] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
				Lịch sử nạp, chi và hóa đơn
			</div>

			<div className="border-b border-[#eef2f7] px-4 py-3">
				<form
					onSubmit={(event) => {
						event.preventDefault();
						onSearch();
					}}
					className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]"
				>
					<input
						type="text"
						value={keywordInput}
						onChange={(event) => onKeywordInputChange(event.target.value)}
						placeholder="Tìm kiếm theo mô tả giao dịch..."
						className="h-11 rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0d4f9f]"
					/>
					<button
						type="submit"
						disabled={loading}
						className="inline-flex h-11 items-center justify-center rounded-xl bg-[#0d4f9f] px-5 text-sm font-bold text-white transition hover:bg-[#0a3f7d] disabled:cursor-not-allowed disabled:bg-[#93c5fd]"
					>
						Tìm kiếm
					</button>
				</form>
			</div>

			<div className="overflow-x-auto">
				<table className="min-w-full text-left text-sm">
					<thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.12em] text-[#64748b]">
						<tr>
							<th className="px-4 py-3">ID</th>
							<th className="px-4 py-3">Loại</th>
							<th className="px-4 py-3">Mô tả</th>
							<th className="px-4 py-3">Số tiền</th>
							<th className="px-4 py-3">Trạng thái</th>
							<th className="px-4 py-3">Thời gian</th>
						</tr>
					</thead>
					<tbody>
						{transactions.length ? (
							transactions.map((item) => {
								const transactionType = item?.post ? 'Chi / Hóa đơn tin đăng' : 'Nạp tiền';
								const amountClassName = item?.post ? 'text-[#b91c1c]' : 'text-[#047857]';

								return (
									<tr
										key={item?.id}
										onClick={() => onRowClick?.(item?.id)}
										className="cursor-pointer border-t border-[#eef2f7] transition-colors hover:bg-[#f8fafc]"
									>
										<td className="px-4 py-4 font-semibold text-[#0f172a]">#{item?.id || '--'}</td>
										<td className="px-4 py-4 text-[#0f172a]">{transactionType}</td>
										<td className="px-4 py-4 text-[#334155]">
											<p className="line-clamp-2 max-w-[520px]">{item?.description || '--'}</p>
										</td>
										<td className={`px-4 py-4 font-bold ${amountClassName}`}>
											{formatSignedAmount(item?.amount, Boolean(item?.post))}
										</td>
										<td className="px-4 py-4">
											<span
												className={`rounded-full border px-3 py-1 text-xs font-semibold ${
													STATUS_BADGE_CLASS[item?.status] || 'bg-[#eff6ff] text-[#0d4f9f] border-[#bfdbfe]'
												}`}
											>
												{STATUS_LABELS[item?.status] || item?.status || 'Không xác định'}
											</span>
										</td>
										<td className="px-4 py-4 text-[#475569]">{item?.transactionDate || '--'}</td>
									</tr>
								);
							})
						) : (
							<tr>
								<td className="px-4 py-6 text-[#64748b]" colSpan={6}>
									Chưa có giao dịch để hiển thị.
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>

			<NewsPagination
				currentPage={currentPage}
				totalPages={totalPages}
				loading={loading}
				onPrev={onPrevPage}
				onNext={onNextPage}
				wrapperClassName="mb-0 mt-6 pb-4"
			/>
		</section>
	);
};

export default DashboardFinanceTransactionsSection;
