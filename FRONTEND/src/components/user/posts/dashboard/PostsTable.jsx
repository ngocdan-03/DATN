import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Pagination from "../../../common/Pagination";
import { POST_STATUS } from "../../../../constants/posts";
import { formatInteger } from "../../../../utils/format";
import { postsService } from "../../../../services/postsService";
import AppModal from "../../../modals/AppModal";

export default function PostsTable({
    data = [],
    page = 1,
    totalPages = 1,
    loading = false,
    onPrev,
    onNext,
    onReload,
    isSavedPage = false, // Prop điều khiển chế độ hiển thị
}) {
    const navigate = useNavigate();

    // Modal state dành cho việc xóa bài đăng (chỉ dùng ở trang quản lý tin)
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [modalLoading, setModalLoading] = useState(false);

    // Mở modal xác nhận xóa
    const handleOpenDelete = (id) => {
        setSelectedId(id);
        setModalOpen(true);
    };

    // Xác nhận xóa bài đăng
    const handleConfirmDelete = async () => {
        try {
            setModalLoading(true);
            await postsService.deletePost(selectedId);
            setModalOpen(false);
            setSelectedId(null);
            
            // Reload lại dữ liệu từ trang cha
            onReload && onReload();
        } catch (err) {
            console.error("Lỗi khi xóa bài đăng:", err);
        } finally {
            setModalLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white shadow-sm">
                
                {/* Header Table */}
                <div className="flex items-center justify-between border-b border-[#f1f5f9] px-5 py-4 text-xs font-bold uppercase tracking-widest text-[#64748b]">
                    <span>{isSavedPage ? "Tin đăng đã lưu" : "Danh sách bài đăng của tôi"}</span>
                    <span className="rounded-full bg-slate-100 px-2 py-1">{data.length} bài</span>
                </div>

                {/* Table Content */}
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[#f8fafc] text-[11px] uppercase tracking-wider text-[#64748b] font-bold">
                            <tr>
                                <th className="px-5 py-4 text-center">ID</th>
                                <th className="px-5 py-4">Tiêu đề</th>
                                <th className="px-5 py-4">Trạng thái</th>
                                <th className="px-5 py-4">Lượt xem</th>
                                <th className="px-5 py-4">Ngày tạo</th>
                                <th className="px-5 py-4 text-right">Thao tác</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y divide-[#f1f5f9]">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600"></div>
                                            <span className="text-slate-400 font-medium">Đang tải dữ liệu...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : data.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="py-20 text-center text-slate-400 font-medium">
                                        Không tìm thấy bài đăng nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                data.map((post) => {
                                    const status = POST_STATUS[post.status] || { label: post.status, color: "#64748b" };

                                    return (
                                        <tr key={post.id} className="group transition-colors hover:bg-slate-50/50">
                                            <td className="px-5 py-4 text-center font-bold text-[#0f172a]">
                                                #{post.id}
                                            </td>

                                            <td className="px-5 py-4">
                                                <p className="max-w-[380px] line-clamp-2 font-semibold text-[#1e293b] group-hover:text-blue-600 transition-colors cursor-pointer" onClick={() => navigate(`/posts/${post.id}`)}>
                                                    {post.title}
                                                </p>
                                            </td>

                                            <td className="px-5 py-4">
                                                <span
                                                    className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                                                    style={{
                                                        backgroundColor: `${status.color}15`,
                                                        color: status.color,
                                                        border: `1px solid ${status.color}30`,
                                                    }}
                                                >
                                                    {status.label}
                                                </span>
                                            </td>

                                            <td className="px-5 py-4 font-medium text-[#334155]">
                                                {formatInteger(post.views)}
                                            </td>

                                            <td className="px-5 py-4 text-[#64748b] text-xs">
                                                {post.createdAt}
                                            </td>

                                            <td className="px-5 py-4">
                                                <div className="flex justify-end gap-2">
                                                    {/* Nút Xem: Luôn luôn có */}
                                                    <button
                                                        onClick={() => navigate(`/posts/${post.id}`)}
                                                        className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#1d4ed8] hover:bg-[#dbeafe] transition-all active:scale-95"
                                                    >
                                                        Xem
                                                    </button>

                                                    {/* CHỈ HIỆN SỬA/XÓA KHI KHÔNG PHẢI TRANG LƯU */}
                                                    {!isSavedPage && (
                                                        <>
                                                            <button 
                                                                onClick={() => navigate(`/user/post-edit/${post.id}`)}
                                                                className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-1.5 text-xs font-bold text-[#b45309] hover:bg-[#fef3c7] transition-all active:scale-95"
                                                            >
                                                                Sửa
                                                            </button>
                                                            <button
                                                                onClick={() => handleOpenDelete(post.id)}
                                                                className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-bold text-[#dc2626] hover:bg-[#fee2e2] transition-all active:scale-95"
                                                            >
                                                                Xóa
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Phân trang tích hợp cuối bảng */}
                <div className="border-t border-[#f1f5f9] bg-[#f8fafc]/50">
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        loading={loading}
                        onPrev={onPrev}
                        onNext={onNext}
                    />
                </div>
            </section>

            {/* Modal xác nhận xóa (Chỉ hiển thị khi trigger) */}
            <AppModal
                open={modalOpen}
                type="warning"
                title="Xác nhận xóa bài đăng"
                message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa bài đăng này khỏi hệ thống?"
                confirmText="Xóa vĩnh viễn"
                onClose={() => setModalOpen(false)}
                onConfirm={handleConfirmDelete}
                loading={modalLoading}
            />
        </div>
    );
}