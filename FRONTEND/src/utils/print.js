export const printInvoice = (elementId, invoiceNo = 'Invoice') => {
    const content = document.getElementById(elementId);
    if (!content) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert('Trình duyệt đã chặn popup. Vui lòng cho phép popup để in hóa đơn.');
        return;
    }

    const fileName = `Hoa_Don_${invoiceNo}`;

    printWindow.document.write(`
        <!DOCTYPE html>
        <html lang="vi">
        <head>
            <meta charset="UTF-8" />
            <title>${fileName}</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600;700;800&display=swap" rel="stylesheet" />
            <style>
                * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
                body { font-family: 'Manrope', sans-serif; background: #f1f5f9; display: flex; justify-content: center; padding: 40px 16px; }
                #invoice-wrapper { width: 100%; max-width: 560px; background: #fff; border-radius: 1.5rem; box-shadow: 0 4px 32px rgba(0,0,0,0.10); overflow: hidden; }
                @page { size: A4; margin: 12mm 10mm; }
                @media print {
                    body { background: #fff; padding: 0; display: block; }
                    #invoice-wrapper { max-width: 100%; border-radius: 0; box-shadow: none; }
                    .no-print { display: none !important; }
                }
            </style>
        </head>
        <body>
            <div id="invoice-wrapper">
                ${content.innerHTML}
            </div>
            <script>
                window.addEventListener('load', function () {
                    setTimeout(function () {
                        window.print();
                        window.addEventListener('afterprint', function () {
                            window.close();
                        });
                    }, 400);
                });
            </script>
        </body>
        </html>
    `);

    printWindow.document.close();
};