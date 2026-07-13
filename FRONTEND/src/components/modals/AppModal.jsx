import { useEffect } from "react";

const toneMap = {
  success: {
    ring: "ring-emerald-200",
    dot: "bg-emerald-600",
    title: "text-emerald-900",
    body: "text-emerald-800",
    action: "bg-emerald-600 hover:bg-emerald-700",
  },
  warning: {
    ring: "ring-amber-200",
    dot: "bg-amber-600",
    title: "text-amber-900",
    body: "text-amber-800",
    action: "bg-amber-600 hover:bg-amber-700",
  },
  error: {
    ring: "ring-red-200",
    dot: "bg-red-600",
    title: "text-red-900",
    body: "text-red-800",
    action: "bg-red-600 hover:bg-red-700",
  },
  info: {
    ring: "ring-sky-200",
    dot: "bg-sky-600",
    title: "text-sky-900",
    body: "text-sky-800",
    action: "bg-sky-600 hover:bg-sky-700",
  },
};

const defaultTitle = {
  success: "Thành công",
  warning: "Cảnh báo",
  error: "Có lỗi xảy ra",
  info: "Thông báo",
};

export default function AppModal({
  open = false,
  type = "info",
  title,
  message,
  confirmText = "Đóng",
  onClose,
  onConfirm,
  closeOnBackdrop = true,
  closeOnEsc = true,
  loading = false,
}) {
  const tone = toneMap[type] || toneMap.info;
  const heading = title || defaultTitle[type] || defaultTitle.info;

  useEffect(() => {
    if (!open || !closeOnEsc || !onClose) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, closeOnEsc, onClose]);

  if (!open || !message) return null;

  const handleBackdropClick = () => {
    if (closeOnBackdrop && onClose && !loading) onClose();
  };

  const handleConfirm = () => {
    if (loading) return;
    if (onConfirm) onConfirm();
    else if (onClose) onClose();
  };

  return (
      <div
          className="fixed inset-0 z-[150] flex items-center justify-center bg-slate-900/50 p-4" 
          role="presentation"
          onClick={handleBackdropClick}
      >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-live="assertive"
        className={
          "w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl ring-1 " + tone.ring
        }
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start gap-3">
          <span className={"mt-1 inline-block h-2.5 w-2.5 rounded-full " + tone.dot} />
          <div>
            <h3 className={"text-base font-bold " + tone.title}>{heading}</h3>
            <p className={"mt-1 text-sm leading-relaxed " + tone.body}>{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Hủy
            </button>
          ) : null}

          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className={
              "rounded-lg px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-60 " +
              tone.action
            }
          >
            {loading ? "Đang xử lý..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}