export const formatCurrencyVND = (value) => {
  const amount = Number(value || 0);
  return `${new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 0 }).format(amount)} VNĐ`;
};

export const formatInteger = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

export const formatArea = (value) => {
  const area = Number(value || 0);
  return area > 0 ? `${area.toLocaleString('vi-VN')} m²` : '';
}

export const formatSignedAmount = (value, isPostTransaction) => {
    const amount = Number(value || 0);
    const sign = isPostTransaction ? '-' : '+';
    const normalizedAmount = new Intl.NumberFormat('vi-VN').format(Math.abs(amount));
    return `${sign}${normalizedAmount} VNĐ`;
};

export const formatDateTime = (isoString) => {
    if (!isoString) return "---";
    try {
        return new Date(isoString).toLocaleString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    } catch (error) {
        console.error("Format DateTime Error:", error);
        return "---";
    }
};

export const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    try {
        // Tách lấy phần ngày trước chữ 'T' (YYYY-MM-DD)
        return dateString.split('T')[0];
    } catch (error) {
        console.error("Format Date For Input Error:", error);
        return "";
    }
};

export const formatDateForBE = (dateString) => {
    if (!dateString) return null;
    try {
        const [y, m, d] = dateString.split("-");
        if (!y || !m || !d) return null;
        return `${d}-${m}-${y}`;
    } catch (error) {
        console.error("Format Date For BE Error:", error);
        return null;
    }
};