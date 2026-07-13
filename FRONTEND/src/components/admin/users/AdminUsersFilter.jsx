import { useEffect, useRef, useState } from "react";

const DEFAULT_FILTERS = {
  isVerified: "",
  isLocked: "",
};

export default function AdminUsersFilter({ value = DEFAULT_FILTERS, onApply }) {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(DEFAULT_FILTERS);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleOutside = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [isOpen]);

  const activeFilterCount = Object.values(draft).filter((val) => val !== "").length;

  const toggleFilter = () => {
    if (!isOpen) {
      setDraft({
        isVerified: value.isVerified ?? "",
        isLocked: value.isLocked ?? "",
      });
    }
    setIsOpen((prev) => !prev);
  };

  const handleApply = () => {
    if (onApply) onApply(draft);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggleFilter}
        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-[#e4e2e3] bg-white px-4 text-sm font-bold text-[#041627] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[#cca830] hover:text-[#735c00]"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
        Bộ lọc
        {activeFilterCount > 0 && (
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#041627] px-1.5 text-[11px] font-extrabold text-white">
            {activeFilterCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-12 z-40 w-[420px] max-w-[85vw] overflow-hidden rounded-2xl border border-[#c4c6cd]/40 bg-white shadow-[0_24px_60px_-30px_rgba(4,22,39,0.5)]">
          <div className="bg-[linear-gradient(135deg,#041627_0%,#123456_100%)] px-5 py-4 text-white">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Admin Filter</p>
                <h3 className="mt-1 text-lg font-black [font-family:Manrope]">Bộ lọc người dùng</h3>
                <p className="mt-1 text-xs text-white/70">Lọc theo xác minh và trạng thái khóa.</p>
              </div>
              <button
                type="button"
                onClick={() => setDraft(DEFAULT_FILTERS)}
                className="inline-flex h-9 items-center gap-1 rounded-lg border border-white/25 bg-white/10 px-3 text-[11px] font-bold uppercase tracking-wider text-white transition hover:bg-white/20"
              >
                Đặt lại
              </button>
            </div>
          </div>

          <div className="space-y-4 p-5">
            <div>
              <label className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5e6570]">
                Xác minh
              </label>
              <select
                className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold outline-none focus:border-[#cca830]"
                value={draft.isVerified}
                onChange={(e) => setDraft((prev) => ({ ...prev, isVerified: e.target.value }))}
              >
                <option value="">Tất cả</option>
                <option value="true">Đã xác minh</option>
                <option value="false">Chưa xác minh</option>
              </select>
            </div>

            <div>
              <label className="mb-2 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#5e6570]">
                Trạng thái khóa
              </label>
              <select
                className="h-11 w-full rounded-xl border border-[#e4e2e3] bg-[#f8f7f8] px-3 text-sm font-semibold outline-none focus:border-[#cca830]"
                value={draft.isLocked}
                onChange={(e) => setDraft((prev) => ({ ...prev, isLocked: e.target.value }))}
              >
                <option value="">Tất cả</option>
                <option value="false">Đang hoạt động</option>
                <option value="true">Đang bị khóa</option>
              </select>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-10 rounded-xl border border-slate-200 bg-white px-4 text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="h-10 rounded-xl bg-[#041627] px-4 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#0a2a47]"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}