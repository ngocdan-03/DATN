export default function CreatePostHeader({ isEdit = false }) {
    return (
        <header className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:mb-10">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 [font-family:Manrope] md:text-4xl">
                {isEdit ? 'Chỉnh sửa bài đăng' : 'Đăng tin mới'}
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-600 md:text-base">
                {isEdit ? 'Cập nhật thông tin bất động sản của bạn.' : 'Nhập thông tin bất động sản và tải hình ảnh để tạo bài đăng.'}
            </p>
        </header>
    );
}