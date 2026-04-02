import { Link, useSearchParams } from 'react-router-dom';
import AppIcon from '../../components/common/AppIcon';

const formatAmountFromQuery = (rawAmount) => {
	if (!rawAmount) return null;
	const numeric = Number(String(rawAmount).replace(/[^\d.-]/g, ''));
	if (!Number.isFinite(numeric) || numeric <= 0) return null;
	return `${numeric.toLocaleString('vi-VN')} VND`;
};

const getStatusMeta = (statusValue) => {
	const normalizedStatus = String(statusValue || '').trim().toLowerCase();

	if (['success', 'succeeded', 'ok', 'paid', 'completed', 'thanhcong', '1'].includes(normalizedStatus)) {
		return {
			title: 'Thanh toan thanh cong',
			description: 'Giao dich da duoc ghi nhan. So du tai khoan se duoc cap nhat trong it phut.',
			panelClass: 'border-[#b7f0c5] bg-[#f2fff5]',
			badgeClass: 'border-[#2f8a43]/25 bg-[#2f8a43]/10 text-[#1f6b31]',
			iconName: 'badgeCheck',
		};
	}

	if (['pending', 'processing', 'inprogress', 'dangxuly', '0'].includes(normalizedStatus)) {
		return {
			title: 'Giao dich dang xu ly',
			description: 'He thong da nhan yeu cau thanh toan va dang doi ket qua cuoi cung.',
			panelClass: 'border-[#cfe2fa] bg-[#f8fbff]',
			badgeClass: 'border-[#0d4f9f]/25 bg-[#0d4f9f]/10 text-[#0d4f9f]',
			iconName: 'clock',
		};
	}

	return {
		title: 'Thanh toan chua thanh cong',
		description: 'Giao dich bi huy hoac that bai. Ban co the thu lai voi mot goi khac.',
		panelClass: 'border-[#ffd7d2] bg-[#fff8f7]',
		badgeClass: 'border-[#ba1a1a]/25 bg-[#ba1a1a]/10 text-[#ba1a1a]',
		iconName: 'logout',
	};
};

const PaymentResult = () => {
	const [searchParams] = useSearchParams();
	const status = searchParams.get('status') || '';
	const amount = searchParams.get('amount') || '';
	const message = searchParams.get('message') || '';

	const statusMeta = getStatusMeta(status);
	const formattedAmount = formatAmountFromQuery(amount);
	const displayMessage = message?.trim() || statusMeta.description;

	return (
		<main className="mx-auto min-h-screen max-w-[920px] px-4 py-10 md:px-8 md:py-14">
			<section className={`rounded-3xl border p-6 shadow-[0_20px_45px_-35px_rgba(4,22,39,0.45)] md:p-9 ${statusMeta.panelClass}`}>
				<div className="mb-6 flex items-center gap-3">
					<span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] ${statusMeta.badgeClass}`}>
						<AppIcon name={statusMeta.iconName} className="h-4 w-4" />
						Ket qua giao dich
					</span>
				</div>

				<h1 className="text-3xl text-[#0b1730] [font-family:Noto_Serif] md:text-4xl">{statusMeta.title}</h1>
				<p className="mt-3 text-sm font-medium text-[#364a63] md:text-base">{displayMessage}</p>

				<div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2">
					<div className="rounded-2xl border border-[#d6e6fb] bg-white px-5 py-4">
						<p className="text-xs uppercase tracking-[0.1em] text-[#5d6678]">Trang thai</p>
						<p className="mt-1 text-lg font-bold text-[#0b1730]">{status || 'Khong xac dinh'}</p>
					</div>
					<div className="rounded-2xl border border-[#d6e6fb] bg-white px-5 py-4">
						<p className="text-xs uppercase tracking-[0.1em] text-[#5d6678]">So tien</p>
						<p className="mt-1 text-lg font-bold text-[#0b1730]">{formattedAmount || 'Khong co du lieu'}</p>
					</div>
				</div>

				<div className="mt-8 flex flex-wrap items-center gap-3">
					<Link
						to="/payment"
						className="inline-flex items-center gap-2 rounded-xl bg-[#005baa] px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#004785]"
					>
						<AppIcon name="currencyCard" className="h-4 w-4" />
						Thu lai thanh toan
					</Link>
					<Link
						to="/home"
						className="inline-flex items-center gap-2 rounded-xl border border-[#b5cde8] bg-white px-5 py-3 text-sm font-bold uppercase tracking-[0.08em] text-[#0d4f9f] transition-colors hover:bg-[#edf5ff]"
					>
						<AppIcon name="homeWork" className="h-4 w-4" />
						Ve trang chu
					</Link>
				</div>
			</section>
		</main>
	);
};

export default PaymentResult;