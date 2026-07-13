import React, { useEffect, useState } from 'react';
import { 
    X, Receipt, User, Phone, Calendar, Tag, CheckCircle2, 
    AlertCircle, CreditCard, Landmark, Info, Mail, ShieldCheck, Printer 
} from 'lucide-react';
import { financeService } from '../../../services/financeService';
import { formatCurrencyVND } from '../../../utils/format';
import { PAYMENT_RECEIVER } from "../../../constants/payment";
import { printInvoice } from '../../../utils/print';

export default function TransactionDetailModal({ transactionId, isOpen, onClose, fetchDetail }) {
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && transactionId) {
            const fetchDetailData = async () => {
                setLoading(true);
                try {
                    const service = fetchDetail || financeService.getTransactionDetail;
                    const response = await service(transactionId);
                    if (response.code === 1000) {
                        setDetail(response.result);
                    }
                } catch (error) {
                    console.error("Lỗi lấy chi tiết giao dịch:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchDetailData();
        }
    }, [isOpen, transactionId, fetchDetail]);

    if (!isOpen) return null;

    const isDeposit = detail?.type === 'DEPOSIT';
    const isSuccess = detail?.status === 'SUCCESS';

    const handlePrint = () => {
        printInvoice('invoice-content', detail?.invoiceNo || 'Detail');
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-lg animate-in zoom-in-95 duration-200">
                
                <div className="absolute -top-12 right-0 flex gap-4 print:hidden">
                    <button 
                        onClick={handlePrint}
                        className="flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all shadow-lg"
                    >
                        <Printer size={16} /> In hóa đơn
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:text-slate-300 transition-colors"
                    >
                        <X size={28} />
                    </button>
                </div>

                <div id="invoice-content" className="overflow-hidden rounded-3xl bg-white shadow-2xl print:shadow-none print:rounded-none">
                    
                    <div 
                        className={`${isDeposit ? 'bg-emerald-600' : 'bg-[#041627]'} p-8 text-center text-white transition-colors`}
                        style={{ WebkitPrintColorAdjust: 'exact' }}
                    >
                        <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                            {isDeposit ? <Landmark size={32} className="text-emerald-200" /> : <Receipt size={32} className="text-blue-400" />}
                        </div>
                        <h2 className="text-xl font-bold uppercase tracking-widest [font-family:Manrope]">
                            {isDeposit ? 'Biên lai nạp tiền' : 'Hóa đơn dịch vụ'}
                        </h2>
                        <p className="mt-1 text-sm text-white/60">Mã số: {detail?.invoiceNo || '---'}</p>
                    </div>

                    {loading ? (
                        <div className="flex h-64 items-center justify-center text-blue-600">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-current"></div>
                        </div>
                    ) : detail ? (
                        <div className="relative p-8 bg-white">
                            
                            <div className="absolute right-6 top-6 rotate-12 opacity-10 print:opacity-20">
                                {isSuccess ? (
                                    <CheckCircle2 size={100} className="text-emerald-600" />
                                ) : (
                                    <AlertCircle size={100} className="text-rose-600" />
                                )}
                            </div>

                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 border-b border-slate-50 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 print:bg-slate-50"><User size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Khách hàng</p>
                                            <p className="text-sm font-bold text-slate-800 truncate max-w-[150px]">{detail.customerName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 print:bg-slate-50"><Mail size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Email</p>
                                            <p className="text-[11px] font-semibold text-slate-700 truncate max-w-[150px]">{detail.customerEmail}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 print:bg-slate-50"><Phone size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">SĐT</p>
                                            <p className="text-xs font-semibold text-slate-700">{detail.customerPhone}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-slate-100 p-2 text-slate-500 print:bg-slate-50"><Calendar size={18} /></div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400">Thời gian</p>
                                            <p className="text-xs font-semibold text-slate-700">{detail.transactionDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="my-6 border-t-2 border-dashed border-slate-200"></div>

                            <div className="mb-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100" style={{ WebkitPrintColorAdjust: 'exact' }}>
                                <div className="mb-3 flex items-center gap-2 border-b border-slate-200/50 pb-2 text-slate-800">
                                    <ShieldCheck size={16} className="text-blue-600" />
                                    <span className="text-[11px] font-black uppercase tracking-wider">Đơn vị thụ hưởng</span>
                                </div>
                                <div className="grid grid-cols-2 gap-y-3">
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Đại diện</p>
                                        <p className="text-xs font-bold text-slate-700">{PAYMENT_RECEIVER.fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Liên hệ</p>
                                        <p className="text-xs font-bold text-slate-700">{PAYMENT_RECEIVER.phone}</p>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">Email hỗ trợ</p>
                                        <p className="text-xs font-bold text-slate-700">{PAYMENT_RECEIVER.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-xl border border-slate-100 p-3 bg-white">
                                    <p className="text-[10px] font-bold uppercase tracking-tight text-slate-400 mb-1 flex items-center gap-1.5">
                                        <Info size={12}/> Nội dung giao dịch
                                    </p>
                                    <p className="text-sm font-medium text-slate-700 leading-relaxed italic">"{detail.description}"</p>
                                </div>

                                {isDeposit ? (
                                    <div className="flex justify-between rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-100" style={{ WebkitPrintColorAdjust: 'exact' }}>
                                        <span className="text-[10px] font-bold uppercase text-emerald-600">VNPay Ref: {detail.vnpTxnRef || '---'}</span>
                                        <span className="text-[10px] font-bold uppercase text-emerald-600">Mã GD: {detail.vnpTransactionNo || '---'}</span>
                                    </div>
                                ) : (
                                    detail.postTitle && (
                                        <div className="flex items-center gap-3 rounded-xl bg-blue-50 p-4 ring-1 ring-blue-100" style={{ WebkitPrintColorAdjust: 'exact' }}>
                                            <Tag size={16} className="text-blue-600" />
                                            <div className="truncate">
                                                <p className="text-[10px] font-bold uppercase text-blue-400 tracking-wider">Tin đăng liên quan</p>
                                                <p className="truncate text-xs font-bold text-blue-900">{detail.postTitle}</p>
                                                <p className="text-[9px] font-bold text-blue-600/60 mt-0.5">Mã bài: #{detail.postId}</p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            <div 
                                className={`mt-8 rounded-2xl p-6 text-white shadow-xl ${isSuccess ? (isDeposit ? 'bg-emerald-900 shadow-emerald-100' : 'bg-slate-900 shadow-slate-200') : 'bg-rose-900'}`}
                                style={{ WebkitPrintColorAdjust: 'exact' }}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-white/50">Tổng thanh toán</span>
                                    <span className={`text-2xl font-black ${isSuccess ? (isDeposit ? 'text-emerald-400' : 'text-blue-400') : 'text-white'}`}>
                                        {isDeposit ? '+' : '-'}{formatCurrencyVND(detail.amount)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 text-center">
                                <p className="text-[10px] font-medium text-slate-400 italic">
                                    Cảm ơn bạn đã sử dụng dịch vụ của RecoLand!<br/>Hóa đơn điện tử có giá trị xác thực giao dịch trên toàn hệ thống.
                                </p>
                                <div className="hidden print:block mt-4 pt-4 border-t border-slate-100">
                                    <p className="text-[8px] uppercase tracking-[0.3em] text-slate-300 font-bold">RecoLand Real Estate System</p>
                                    <p className="text-[7px] text-slate-300 mt-1 italic">Xuất bản lúc {new Date().toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                    
                    <div className="flex h-4 w-full bg-slate-50 print:hidden">
                         {[...Array(20)].map((_, i) => (
                             <div key={i} className="h-4 w-8 bg-white" style={{ clipPath: 'polygon(50% 100%, 0 0, 100% 0)' }}></div>
                         ))}
                    </div>
                </div>
            </div>
        </div>
    );
}