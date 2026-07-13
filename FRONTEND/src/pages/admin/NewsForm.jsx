import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import AppModal from "../../components/modals/AppModal";
import { CATEGORY } from "../../constants/news";
import { adminNewsService } from "../../services/adminNewsService";

export default function NewsForm() {
  const { newsId } = useParams();
  const isEdit = Boolean(newsId);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    summary: "",
    originalUrl: "",
    sourceName: "",
    category: "MARKET",
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modal, setModal] = useState({ open: false, type: "info", title: "", message: "" });

  useEffect(() => {
    if (!isEdit) return;

    const fetchDetail = async () => {
      const res = await adminNewsService.getNewsDetail(newsId);
      if (res.code === 1000) {
        const n = res.result;
        setForm({
          title: n.title || "",
          summary: n.summary || "",
          originalUrl: n.originalUrl || "",
          sourceName: n.sourceName || "",
          category: n.category || "",
        });
        setThumbnailPreview(n.thumbnailUrl || "");
      }
    };

    fetchDetail();
  }, [isEdit, newsId]);

  const handleChange = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      if (!isEdit) {
        const formData = new FormData();
        formData.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
        if (thumbnailFile) formData.append("thumbnail", thumbnailFile);
        const res = await adminNewsService.createNews(formData);
        setModal({ open: true, type: "success", title: "Thành công", message: res.message });
      } else {
        const res = await adminNewsService.updateNews(newsId, form);
        setModal({ open: true, type: "success", title: "Cập nhật thành công", message: res.message });
      }
    } catch (err) {
      setModal({ open: true, type: "error", title: "Lỗi", message: err.message || "Có lỗi xảy ra." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleThumbnailChange = async (file) => {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));

    if (isEdit) {
      await adminNewsService.updateThumbnail(newsId, file);
    }
  };

  return (
    <div className="space-y-6">
      <HeaderCard title={isEdit ? "Cập nhật tin tức" : "Thêm tin tức"} />

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6 shadow-sm space-y-5">
        <div>
          <label className="text-xs font-bold uppercase text-slate-500">Tiêu đề</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500">Tóm tắt</label>
          <textarea
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm min-h-[500px]"
            value={form.summary}
            onChange={(e) => handleChange("summary", e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Nguồn</label>
            <input
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              value={form.sourceName}
              onChange={(e) => handleChange("sourceName", e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-500">Chuyên mục</label>
            <select
              className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
              value={form.category}
              onChange={(e) => handleChange("category", e.target.value)}
              required
              disabled={isSubmitting}
            >
              {CATEGORY.filter((opt) => opt.value).map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-slate-500">Link gốc</label>
          <input
            className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm"
            value={form.originalUrl}
            onChange={(e) => handleChange("originalUrl", e.target.value)}
            required
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase text-slate-500">Thumbnail</label>
            <span className="text-[11px] text-slate-400">PNG, JPG, WEBP</span>
          </div>

          <label className="flex cursor-pointer items-center justify-between gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 hover:border-[#cca830]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-slate-500 shadow-sm">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 13v6H5v-6H3v8h18v-8h-2z" />
                  <path d="M11 4h2v9h3l-4 4-4-4h3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {thumbnailFile ? "Đã chọn ảnh mới" : "Chọn ảnh thumbnail"}
                </p>
                <p className="text-xs text-slate-500">
                  {thumbnailFile ? thumbnailFile.name : "Kéo thả hoặc bấm để chọn ảnh"}
                </p>
              </div>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-[11px] font-bold text-slate-600 shadow-sm">
              Tải ảnh
            </span>
            <input
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(e) => handleThumbnailChange(e.target.files[0])}
              disabled={isSubmitting}
            />
          </label>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
            {thumbnailPreview ? (
              <div className="flex h-120 w-full items-center justify-center p-4">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ) : (
              <div className="flex h-120 items-center justify-center text-sm font-semibold text-slate-400">
                Chưa có ảnh thumbnail
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="h-11 rounded-xl border border-slate-200 px-4 text-sm font-bold disabled:opacity-60"
            onClick={() => navigate("/admin/news")}
            disabled={isSubmitting}
          >
            Hủy
          </button>
          <button
            type="submit"
            className="h-11 rounded-xl bg-[#041627] px-4 text-sm font-bold text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (isEdit ? "Đang cập nhật..." : "Đang tạo mới...")
              : (isEdit ? "Cập nhật" : "Tạo mới")
            }
          </button>
        </div>
      </form>

      <AppModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        onClose={() => setModal((p) => ({ ...p, open: false }))}
        onConfirm={() => {
          setModal((p) => ({ ...p, open: false }));
          if (modal.type === "success") navigate("/admin/news");
        }}
      />
    </div>
  );
}