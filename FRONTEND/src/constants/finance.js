export const TRANSACTION_STATUS = {
    SUCCESS: {
        value: 'SUCCESS',
        label: 'Thành công',
        badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    PENDING: {
        value: 'PENDING',
        label: 'Đang xử lý',
        badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    FAILED: {
        value: 'FAILED',
        label: 'Thất bại',
        badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    }
};
export const getStatusConfig = (statusKey) => {
    return TRANSACTION_STATUS[statusKey] || {
        label: statusKey || 'Không xác định',
        badgeClass: 'bg-slate-50 text-slate-600 border-slate-200'
    };
};

export const TYPE_OPTIONS = [
    { value: "", label: "Tất cả" },
    { value: "DEPOSIT", label: "Nạp tiền" },
    { value: "POST_FEE", label: "Phí đăng tin" },
];
export const TYPE_LABELS = {
    DEPOSIT: "Nạp tiền",
    POST_FEE: "Phí đăng tin",
};
