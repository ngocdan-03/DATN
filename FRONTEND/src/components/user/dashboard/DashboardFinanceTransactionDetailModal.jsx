import { useRef } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const STATUS_LABELS = {
	SUCCESS: 'Thành công',
	PENDING: 'Đang xử lý',
	FAILED: 'Thất bại',
};

const TYPE_LABELS = {
	DEPOSIT: 'Nạp tiền',
	POST_FEE: 'Phí đăng tin',
};

const STATUS_BADGE_CLASS = {
	SUCCESS: 'bg-[#ecfdf3] text-[#047857] border-[#a7f3d0]',
	PENDING: 'bg-[#fff7ed] text-[#b45309] border-[#fed7aa]',
	FAILED: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
};

const formatCurrencyVND = (value) => {
	const amount = Number(value || 0);
	return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount)} VND`;
};

const buildPdfRows = (transaction) => {
	if (!transaction) return [];

	const allRows = [
		['Ma giao dich', transaction.id ? `#${transaction.id}` : '--'],
		['Ma hoa don', transaction.invoiceNo],
		['Khach hang', transaction.customerName],
		['Email', transaction.customerEmail],
		['So dien thoai', transaction.customerPhone],
		['So tien', formatCurrencyVND(transaction.amount)],
		['Loai giao dich', TYPE_LABELS[transaction.type] || transaction.type],
		['Trang thai', STATUS_LABELS[transaction.status] || transaction.status || 'Khong xac dinh'],
		['Mo ta', transaction.description],
		['Thoi gian giao dich', transaction.transactionDate],
		['VNPay Txn Ref', transaction.vnpTxnRef],
		['VNPay Transaction No', transaction.vnpTransactionNo],
		['Post ID', transaction.postId],
		['Tieu de bai dang', transaction.postTitle],
	];

	return allRows.filter(([, value]) => value !== null && value !== undefined && value !== '');
};

const DetailRow = ({ label, value }) => {
	if (value === null || value === undefined || value === '') return null;
	return (
		<div className="grid grid-cols-1 gap-1 border-b border-[#eef2f7] py-2 md:grid-cols-[170px_1fr] md:gap-3">
			<p className="text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">{label}</p>
			<p className="text-sm text-[#0f172a]">{value}</p>
		</div>
	);
};

const DashboardFinanceTransactionDetailModal = ({
	open,
	loading,
	error,
	transaction,
	onClose,
}) => {
	const invoiceExportRef = useRef(null);

	const handleDownloadInvoicePdf = async () => {
		if (!transaction) return;
		if (!invoiceExportRef.current) return;

		const invoiceCode = transaction.invoiceNo || `GD-${transaction.id || 'UNKNOWN'}`;

		const canvas = await html2canvas(invoiceExportRef.current, {
			scale: 2,
			backgroundColor: '#ffffff',
			useCORS: true,
		});

		const imageData = canvas.toDataURL('image/png');
		const doc = new jsPDF({ unit: 'mm', format: 'a4' });
		const pageWidth = doc.internal.pageSize.getWidth();
		const pageHeight = doc.internal.pageSize.getHeight();
		const renderWidth = pageWidth - 20;
		const renderHeight = (canvas.height * renderWidth) / canvas.width;

		let heightLeft = renderHeight;
		let position = 10;

		doc.addImage(imageData, 'PNG', 10, position, renderWidth, renderHeight);
		heightLeft -= pageHeight - 20;

		while (heightLeft > 0) {
			position = 10 - (renderHeight - heightLeft);
			doc.addPage();
			doc.addImage(imageData, 'PNG', 10, position, renderWidth, renderHeight);
			heightLeft -= pageHeight - 20;
		}

		doc.save(`invoice-${invoiceCode}.pdf`);
	};

	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041627]/70 p-4">
			<div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl md:p-8">
				<div className="mb-4 flex items-start justify-between gap-4">
                    <h2 className="text-lg font-bold text-[#0f172a]">Chi tiết giao dịch</h2>
					<button
						type="button"
						onClick={handleDownloadInvoicePdf}
						disabled={loading || Boolean(error) || !transaction}
						className="rounded-lg border border-[#0d4f9f] px-3 py-1.5 text-sm font-semibold text-[#0d4f9f] hover:bg-[#eff6ff] disabled:cursor-not-allowed disabled:border-[#cbd5e1] disabled:text-[#94a3b8]"
					>
						Tải xuống hóa đơn PDF
					</button>
					<button
						type="button"
						onClick={onClose}
						className="rounded-lg border border-[#d0d7e2] px-3 py-1.5 text-sm font-semibold text-[#334155] hover:bg-[#f8fafc]"
					>
						Đóng
					</button>
				</div>

				{loading && <p className="rounded-lg bg-[#f8fafc] px-4 py-3 text-sm text-[#334155]">Đang tải chi tiết giao dịch...</p>}

				{!loading && error && <p className="rounded-lg bg-[#fef2f2] px-4 py-3 text-sm text-[#b91c1c]">{error}</p>}

				{!loading && !error && transaction && (
					<div className="rounded-xl border border-[#e2e8f0] px-4 py-2">
						<DetailRow label="Mã giao dịch" value={transaction.id ? `#${transaction.id}` : '--'} />
						<DetailRow label="Mã hóa đơn" value={transaction.invoiceNo} />
						<DetailRow label="Khách hàng" value={transaction.customerName} />
						<DetailRow label="Email" value={transaction.customerEmail} />
						<DetailRow label="Số điện thoại" value={transaction.customerPhone} />
						<DetailRow label="Số tiền" value={formatCurrencyVND(transaction.amount)} />
						<DetailRow label="Loại giao dịch" value={TYPE_LABELS[transaction.type] || transaction.type} />
						<DetailRow
							label="Trạng thái"
							value={
								<span
									className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${
										STATUS_BADGE_CLASS[transaction.status] || 'bg-[#eff6ff] text-[#0d4f9f] border-[#bfdbfe]'
									}`}
								>
									{STATUS_LABELS[transaction.status] || transaction.status || 'Không xác định'}
								</span>
							}
						/>
						<DetailRow label="Mô tả" value={transaction.description} />
						<DetailRow label="Thời gian giao dịch" value={transaction.transactionDate} />
						<DetailRow label="VNPay Txn Ref" value={transaction.vnpTxnRef} />
						<DetailRow label="VNPay Transaction No" value={transaction.vnpTransactionNo} />
						<DetailRow label="Post ID" value={transaction.postId} />
						<DetailRow label="Tiêu đề bài đăng" value={transaction.postTitle} />
					</div>
				)}

				{transaction && (
					<div
						ref={invoiceExportRef}
						style={{
							position: 'fixed',
							left: '-100000px',
							top: 0,
							width: '800px',
							background: '#ffffff',
							padding: '24px',
							color: '#0f172a',
							fontFamily: 'Arial, sans-serif',
						}}
					>
						<h1 style={{ fontSize: '28px', margin: '0 0 8px', fontWeight: 700 }}>Hóa đơn giao dịch</h1>
						<p style={{ margin: '0 0 14px', fontSize: '18px' }}>Mã hóa đơn: {transaction.invoiceNo || '--'}</p>
						{buildPdfRows(transaction).map(([label, value]) => (
							<div key={label} style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: '12px', marginBottom: '10px' }}>
								<p style={{ margin: 0, fontWeight: 700, fontSize: '18px' }}>{label}:</p>
								<p style={{ margin: 0, fontSize: '18px' }}>{String(value)}</p>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default DashboardFinanceTransactionDetailModal;
