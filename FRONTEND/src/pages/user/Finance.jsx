import React, { useEffect, useState, useRef } from 'react';
import HeaderCard from '../../components/user/dashboard/HeaderCard';
import StatCard from '../../components/user/dashboard/StatCard';
import FinanceChartSection from '../../components/user/Finance/FinanceChartSection';
import FinanceTransactionsSection from '../../components/user/Finance/FinanceTransactionsSection';
import SearchInput from '../../components/common/SearchInput';
import Pagination from '../../components/common/Pagination';
import TransactionDetailModal from '../../components/user/Finance/TransactionDetailModal';

import { financeService } from '../../services/financeService';
import { formatCurrencyVND } from "../../utils/format";

export default function Finance() {
    // 1. Tách biệt state: overviewData giữ dữ liệu trang 1, transactions cập nhật theo trang
    const [transactions, setTransactions] = useState([]);
    const [overviewData, setOverviewData] = useState({
        chartData: [],
        totalDeposit: 0,
        totalSpend: 0
    });

    const [selectedTxId, setSelectedTxId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 2. States cho phân trang & tìm kiếm
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [keyword, setKeyword] = useState("");
    const [loading, setLoading] = useState(false);
    
    const searchRef = useRef();

    // 3. Hàm gọi API
    const fetchFinanceData = async (page, searchKeyword) => {
        setLoading(true);
        try {
            const response = await financeService.getFinanceSummary({
                page: page,
                size: 5,
                keyword: searchKeyword
            });

            if (response.code === 1000) {
                const res = response.result;
                
                // LUÔN CẬP NHẬT: Danh sách giao dịch cho bảng
                setTransactions(res.transactions?.data || []);
                setTotalPages(res.transactions?.totalPages || 1);

                // CHỈ CẬP NHẬT OVERVIEW: Khi ở trang 1 và không tìm kiếm
                // Các trang sau (2, 3...) API trả về 0 hoặc rỗng thì ta bỏ qua, giữ lại data cũ
                if (page === 1 && !searchKeyword) {
                    setOverviewData({
                        chartData: res.chartData || [],
                        totalDeposit: res.totalDeposit6Months || 0,
                        totalSpend: res.totalSpend6Months || 0
                    });
                }
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu tài chính:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFinanceData(currentPage, keyword);
    }, [currentPage, keyword]);

    // 4. Xử lý sự kiện
    const handleSearch = (val) => {
        setKeyword(val);
        setCurrentPage(1); 
    };

    const handlePrev = () => {
        if (currentPage > 1) setCurrentPage(prev => prev - 1);
    };

    const handleNext = () => {
        if (currentPage < totalPages) setCurrentPage(prev => prev + 1);
    };

    const openDetail = (id) => {
        setSelectedTxId(id);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-7 pb-10">
            <HeaderCard title="Quản lý tài chính" />

            {/* PHẦN TỔNG QUAN: Luôn hiển thị, không bị ẩn khi sang trang 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard
                    title="Tổng nạp 6 tháng"
                    value={overviewData.totalDeposit}
                    formatValue={formatCurrencyVND}
                />
                <StatCard
                    title="Tổng chi 6 tháng"
                    value={overviewData.totalSpend}
                    formatValue={formatCurrencyVND}
                />
            </div>

            <div className="w-full">
                {/* Biểu đồ luôn nhận data từ overviewData (dữ liệu trang 1 cố định) */}
                <FinanceChartSection chartData={overviewData.chartData} />
            </div>

            {/* PHẦN CHI TIẾT GIAO DỊCH */}
            <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold text-slate-800 [font-family:Manrope]">
                        {keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Lịch sử giao dịch"}
                    </h2>
                    <div className="w-full sm:w-72">
                        <SearchInput ref={searchRef} onSearch={handleSearch} />
                    </div>
                </div>

                <FinanceTransactionsSection 
                    transactions={transactions} 
                    loading={loading}
                    onRowClick={openDetail}
                />

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    loading={loading}
                    onPrev={handlePrev}
                    onNext={handleNext}
                />
            </div>
            <TransactionDetailModal
                transactionId={selectedTxId}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </div>
    );
}