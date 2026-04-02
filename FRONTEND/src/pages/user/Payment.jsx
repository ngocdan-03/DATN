import { useMemo, useState } from 'react';
import AppNoticeModal from '../../components/common/modals/AppNoticeModal';
import PaymentHero from '../../components/user/payment/PaymentHero';
import PaymentPackageList from '../../components/user/payment/PaymentPackageList';
import PaymentReceiverInfo from '../../components/user/payment/PaymentReceiverInfo';
import PaymentSummary from '../../components/user/payment/PaymentSummary';
import { createVNPayPaymentUrl } from '../../services/paymentService';
import { createLogger } from '../../utils/logger';

const logPaymentPage = createLogger('PaymentPage');

const PACKAGE_OPTIONS = [
	{
		id: 'GOI_1',
		label: 'Goi 1',
		descriptionKey: 'Goi 1',
		amount: 100000,
		displayAmount: '100k VND',
		benefit: 'Nap 100k VND duoc 100k VND.',
		accentClass: 'text-[#005baa]',
	},
	{
		id: 'GOI_2',
		label: 'Goi 2',
		descriptionKey: 'Goi 2',
		amount: 200000,
		displayAmount: '200k VND',
		benefit: 'Nap 200k VND duoc 200k VND.',
		accentClass: 'text-[#005baa]',
	},
	{
		id: 'GOI_3',
		label: 'Goi 3',
		descriptionKey: 'Goi 3',
		amount: 500000,
		displayAmount: '500k VND',
		benefit: 'Nap 500k VND duoc 500k VND.',
		accentClass: 'text-[#ee2e24]',
	},
];

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')} VND`;

const getCurrentUser = () => {
	try {
		const rawUser = localStorage.getItem('user');
		return rawUser ? JSON.parse(rawUser) : null;
	} catch {
		return null;
	}
};

const Payment = () => {
	const [selectedPackageId, setSelectedPackageId] = useState(PACKAGE_OPTIONS[0].id);
	const [creatingPayment, setCreatingPayment] = useState(false);
	const [noticeState, setNoticeState] = useState({
		open: false,
		title: 'Thong bao',
		message: '',
		variant: 'info',
	});

	const selectedPackage = useMemo(() => {
		const foundPackage = PACKAGE_OPTIONS.find((item) => item.id === selectedPackageId);
		if (!foundPackage) return null;
		return {
			...foundPackage,
			formattedAmount: formatCurrency(foundPackage.amount),
		};
	}, [selectedPackageId]);

	const user = useMemo(() => getCurrentUser(), []);

	const handleCreatePayment = async () => {
		if (!selectedPackage) {
			setNoticeState({
				open: true,
				title: 'Chua chon goi',
				message: 'Vui long chon goi thanh toan truoc khi tiep tuc.',
				variant: 'error',
			});
			return;
		}

		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			setNoticeState({
				open: true,
				title: 'Phien dang nhap khong hop le',
				message: 'Vui long dang nhap lai de tiep tuc thanh toan.',
				variant: 'error',
			});
			return;
		}

		setCreatingPayment(true);
		setNoticeState((previous) => ({ ...previous, open: false }));

		const payload = {
			amount: selectedPackage.amount,
			description: `Nap tien ${selectedPackage.descriptionKey}`,
		};

		logPaymentPage('Create VNPay URL', payload);

		try {
			const response = await createVNPayPaymentUrl(payload, token);
			if (response.data?.code === 1000 && response.data?.result?.paymentUrl) {
				window.location.href = response.data.result.paymentUrl;
				return;
			}

			setNoticeState({
				open: true,
				title: 'Khong the khoi tao thanh toan',
				message: response.data?.message || 'Khong the khoi tao thanh toan. Vui long thu lai.',
				variant: 'error',
			});
		} catch (error) {
			setNoticeState({
				open: true,
				title: 'Khong the ket noi cong thanh toan',
				message: error.response?.data?.message || 'Khong the ket noi may chu thanh toan.',
				variant: 'error',
			});
		} finally {
			setCreatingPayment(false);
		}
	};

	return (
		<main className="mx-auto min-h-screen max-w-[1320px] px-4 py-8 md:px-8 md:py-12">
			<AppNoticeModal
				open={noticeState.open}
				title={noticeState.title}
				message={noticeState.message}
				variant={noticeState.variant}
				onConfirm={() => setNoticeState((previous) => ({ ...previous, open: false }))}
			/>

			<PaymentHero />

			<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
				<section className="lg:col-span-2">
					<div className="rounded-3xl border border-[#d8e9ff] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(255,255,255,0.9))] p-5 shadow-[0_18px_46px_-30px_rgba(0,75,146,0.35)] md:p-8">
						<div className="mb-6 flex items-center justify-between gap-4">
							<h2 className="text-3xl text-[#0b1730] [font-family:Noto_Serif]">Chon goi thanh toan</h2>
						</div>

						<PaymentPackageList
							packages={PACKAGE_OPTIONS}
							selectedPackageId={selectedPackageId}
							onSelectPackage={setSelectedPackageId}
						/>

						<hr className="my-8 border-[#dbe9fb]" />

						<PaymentReceiverInfo user={user} />
					</div>
				</section>

				<PaymentSummary selectedPackage={selectedPackage} creatingPayment={creatingPayment} onCreatePayment={handleCreatePayment} />
			</div>
		</main>
	);
};

export default Payment;
