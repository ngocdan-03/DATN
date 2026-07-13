import React from 'react';
import { getStatusConfig } from '../../../constants/finance';
import { formatSignedAmount } from '../../../utils/format';

export default function FinanceTransactionsSection({ 
    transactions = [],
    loading = false,
    onRowClick
    }) {
    
    // Giao diện khi đang tải dữ liệu
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col items-center gap-2">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600"></div>
                    <p className="text-sm font-medium text-slate-500">Đang tải giao dịch...</p>
                </div>
            </div>
        );
    }

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {/* HEADER TABLE */}
            <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-600 [font-family:Manrope]">
                    Lịch sử giao dịch
                </h3>
                <span className="text-xs font-medium text-slate-400">
                    Hiển thị {transactions.length} kết quả gần nhất
                </span>
            </div>

            {/* TABLE CONTAINER */}
            <div className="overflow-x-auto">
                <table className="min-w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                            <th className="px-6 py-4">Mã GD</th>
                            <th className="px-6 py-4">Loại hình</th>
                            <th className="px-6 py-4">Nội dung giao dịch</th>
                            <th className="px-6 py-4">Số tiền</th>
                            <th className="px-6 py-4 text-center">Trạng thái</th>
                            <th className="px-6 py-4 text-right">Thời gian</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {transactions.length > 0 ? (
                            transactions.map((item) => {
                                const isPost = Boolean(item?.post);
                                const statusConfig = getStatusConfig(item.status);
                                
                                return (
                                    <tr 
                                    key={item.id} 
                                    className="group transition-colors hover:bg-slate-50/80"
                                    onClick={() => onRowClick(item.id)}
                                    >
                                        {/* Mã GD */}
                                        <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">
                                            #{item.id}
                                        </td>

                                        {/* Loại hình */}
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <span className={`h-2 w-2 rounded-full flex-none ${isPost ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                                <span className="font-medium text-slate-600">
                                                    {isPost ? 'Thanh toán tin' : 'Nạp tiền'}
                                                </span>
                                            </div>
                                        </td>

                                        {/* Nội dung */}
                                        <td className="px-6 py-4">
                                            <div className="max-w-[280px] md:max-w-[400px]">
                                                <p className="truncate font-medium text-slate-700" title={item.description}>
                                                    {item.description}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Số tiền - Chống xuống dòng */}
                                        <td className={`px-6 py-4 font-black whitespace-nowrap ${isPost ? 'text-rose-600' : 'text-emerald-600'}`}>
                                            {formatSignedAmount(item.amount, isPost)}
                                        </td>

                                        {/* Trạng thái - Badge chống méo */}
                                        <td className="px-6 py-4 text-center">
                                            <span className={`inline-flex items-center justify-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${statusConfig.badgeClass}`}>
                                                {statusConfig.label}
                                            </span>
                                        </td>

                                        {/* Thời gian */}
                                        <td className="px-6 py-4 text-right font-medium text-slate-400 whitespace-nowrap">
                                            {item.transactionDate?.split(' ')[0] || '--/--/----'}
                                            <span className="block text-[10px] opacity-70">
                                                {item.transactionDate?.split(' ')[1] || ''}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" className="px-6 py-12 text-center text-slate-400 font-medium">
                                    Không có dữ liệu giao dịch nào.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}