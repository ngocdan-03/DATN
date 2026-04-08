import { useEffect, useRef, useState } from 'react';
import StateCard from '../../common/StateCard';
import DashboardFinanceChartSection from './DashboardFinanceChartSection';
import DashboardFinanceTransactionDetailModal from './DashboardFinanceTransactionDetailModal';
import DashboardFinanceTransactionsSection from './DashboardFinanceTransactionsSection';
import { getFinanceSummary, getFinanceTransactionDetail } from '../../../services/dashboardService';
import { createLogger } from '../../../utils/logger';

const logDashboardFinance = createLogger('DashboardFinanceSection');
const FINANCE_PAGE_SIZE = 5;

const DashboardFinanceSection = () => {
	const [chartData, setChartData] = useState([]);
	const [totalDeposit, setTotalDeposit] = useState(0);
	const [totalSpend, setTotalSpend] = useState(0);
	const [hasOverviewData, setHasOverviewData] = useState(false);
	const hasCapturedOverviewRef = useRef(false);

	const [transactions, setTransactions] = useState([]);
	const [keywordInput, setKeywordInput] = useState('');
	const [appliedKeyword, setAppliedKeyword] = useState('');
	const [page, setPage] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [tableLoading, setTableLoading] = useState(false);
	const [error, setError] = useState('');
	const isFirstFetchRef = useRef(true);
	const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
	const [detailLoading, setDetailLoading] = useState(false);
	const [detailError, setDetailError] = useState('');
	const [transactionDetail, setTransactionDetail] = useState(null);

	useEffect(() => {
		const fetchFinanceSummary = async () => {
			const requestedPage = page;
			if (isFirstFetchRef.current) {
				setLoading(true);
			} else {
				setTableLoading(true);
			}
			setError('');
			logDashboardFinance('Fetch finance summary start', {
				page: requestedPage,
				size: FINANCE_PAGE_SIZE,
				keyword: appliedKeyword,
			});

			try {
				const response = await getFinanceSummary({
					page: requestedPage,
					size: FINANCE_PAGE_SIZE,
					keyword: appliedKeyword,
				});
				if (response.data?.code === 1000 && response.data?.result) {
					const result = response.data.result;
					const transactionsPayload = result?.transactions || {};
					const apiCurrentPage = Number(transactionsPayload.currentPage || requestedPage || 1);
					const apiTotalPages = Number(transactionsPayload.totalPages || 1);
					const rows = Array.isArray(transactionsPayload.data) ? transactionsPayload.data : [];

					setTransactions(rows);
					setCurrentPage(apiCurrentPage);
					setTotalPages(apiTotalPages);

					if (!hasCapturedOverviewRef.current && requestedPage === 1 && !appliedKeyword) {
						const nextChartData = Array.isArray(result?.chartData) ? result.chartData : [];
						setChartData(nextChartData);
						setTotalDeposit(Number(result?.totalDeposit6Months || 0));
						setTotalSpend(Number(result?.totalSpend6Months || 0));
						setHasOverviewData(nextChartData.length > 0 || Number(result?.totalDeposit6Months || 0) > 0 || Number(result?.totalSpend6Months || 0) > 0);
						hasCapturedOverviewRef.current = true;
					}

					if (apiCurrentPage !== requestedPage) {
						setPage(apiCurrentPage);
					}
					logDashboardFinance('Fetch finance summary success', {
						currentPage: apiCurrentPage,
						totalPages: apiTotalPages,
						transactions: rows.length,
						chartPoints: Array.isArray(result?.chartData) ? result.chartData.length : 0,
					});
					return;
				}

				setError(response.data?.message || 'Không thể tải dữ liệu tài chính.');
			} catch (fetchError) {
				setError(fetchError.response?.data?.message || 'Không thể tải dữ liệu tài chính.');
				logDashboardFinance('Fetch finance summary failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code || fetchError.code,
					message: fetchError.response?.data?.message || fetchError.message,
				});
			} finally {
				setLoading(false);
				setTableLoading(false);
				isFirstFetchRef.current = false;
			}
		};

		fetchFinanceSummary();
	}, [page, appliedKeyword]);

	const handleSearch = () => {
		const normalizedKeyword = keywordInput.trim();
		setPage(1);
		setAppliedKeyword(normalizedKeyword);
	};

	const handlePrevPage = () => {
		if (tableLoading || currentPage <= 1) return;
		setPage(currentPage - 1);
	};

	const handleNextPage = () => {
		if (tableLoading || currentPage >= totalPages) return;
		setPage(currentPage + 1);
	};

	const handleOpenTransactionDetail = async (transactionId) => {
		if (!transactionId) return;
		setIsDetailModalOpen(true);
		setDetailLoading(true);
		setDetailError('');
		setTransactionDetail(null);

		logDashboardFinance('Fetch transaction detail start', { transactionId });

		try {
			const response = await getFinanceTransactionDetail(transactionId);
			if (response.data?.code === 1000 && response.data?.result) {
				setTransactionDetail(response.data.result);
				logDashboardFinance('Fetch transaction detail success', {
					transactionId: response.data.result?.id,
					status: response.data.result?.status,
					type: response.data.result?.type,
				});
				return;
			}

			setDetailError(response.data?.message || 'Không thể tải chi tiết giao dịch.');
		} catch (fetchError) {
			setDetailError(fetchError.response?.data?.message || 'Không thể tải chi tiết giao dịch.');
			logDashboardFinance('Fetch transaction detail failed', {
				httpStatus: fetchError.response?.status,
				code: fetchError.response?.data?.code || fetchError.code,
				message: fetchError.response?.data?.message || fetchError.message,
				transactionId,
			});
		} finally {
			setDetailLoading(false);
		}
	};

	const handleCloseTransactionDetailModal = () => {
		setIsDetailModalOpen(false);
		setDetailLoading(false);
		setDetailError('');
		setTransactionDetail(null);
	};

	if (loading && !hasOverviewData && !transactions.length) {
		return <StateCard message="Đang tải dữ liệu tài chính..." className="rounded-2xl" />;
	}

	if (error && !hasOverviewData && !transactions.length) {
		return <StateCard variant="error" title="Không tải được tài chính" message={error} className="rounded-2xl" />;
	}

	return (
		<div className="space-y-6">
			<DashboardFinanceChartSection chartData={chartData} totalDeposit={totalDeposit} totalSpend={totalSpend} />

			{error && <StateCard variant="error" title="Không tải được tài chính" message={error} className="rounded-2xl" />}

			<DashboardFinanceTransactionsSection
				transactions={transactions}
				currentPage={currentPage}
				totalPages={totalPages}
				loading={tableLoading}
				keywordInput={keywordInput}
				onKeywordInputChange={setKeywordInput}
				onSearch={handleSearch}
				onRowClick={handleOpenTransactionDetail}
				onPrevPage={handlePrevPage}
				onNextPage={handleNextPage}
			/>

			<DashboardFinanceTransactionDetailModal
				open={isDetailModalOpen}
				loading={detailLoading}
				error={detailError}
				transaction={transactionDetail}
				onClose={handleCloseTransactionDetailModal}
			/>
		</div>
	);
};

export default DashboardFinanceSection;