import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AppIcon from '../../common/AppIcon';
import StateCard from '../../common/StateCard';
import NewsPagination from '../news/NewsPagination';
import { POST_STATUS_LABELS } from '../../../constants/postFilters';
import { getSavedPosts } from '../../../services/postService';
import { createLogger } from '../../../utils/logger';

const logDashboardEngagement = createLogger('DashboardEngagementSection');
const SAVED_POST_PAGE_SIZE = 5;

const STATUS_BADGE_CLASS = {
	APPROVED: 'bg-[#ecfdf3] text-[#047857] border-[#a7f3d0]',
};

const formatInteger = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

const DashboardEngagementSection = () => {
	const [keywordInput, setKeywordInput] = useState('');
	const [appliedKeyword, setAppliedKeyword] = useState('');
	const [page, setPage] = useState(1);
	const [savedPosts, setSavedPosts] = useState([]);
	const [totalPages, setTotalPages] = useState(1);
	const [totalElements, setTotalElements] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchSavedPosts = async () => {
			setLoading(true);
			setError('');
			logDashboardEngagement('Fetch saved posts start', {
				keyword: appliedKeyword,
				page,
				size: SAVED_POST_PAGE_SIZE,
			});

			try {
				const response = await getSavedPosts({
					keyword: appliedKeyword,
					page,
					size: SAVED_POST_PAGE_SIZE,
				});

				if (response.data?.code === 1000) {
					const result = response.data?.result || {};
					const rows = Array.isArray(result.data) ? result.data : [];
					const currentPage = result.currentPage || page;
					setSavedPosts(rows);
					setTotalPages(result.totalPages || 1);
					setTotalElements(result.totalElements || rows.length);
					if (currentPage !== page) {
						setPage(currentPage);
					}
					logDashboardEngagement('Fetch saved posts success', {
						items: rows.length,
						totalElements: result.totalElements || rows.length,
						totalPages: result.totalPages || 1,
						currentPage,
					});
					return;
				}

				setSavedPosts([]);
				setTotalPages(1);
				setTotalElements(0);
				setError(response.data?.message || 'Không thể tải danh sách bài đăng đã lưu.');
			} catch (fetchError) {
				setSavedPosts([]);
				setTotalPages(1);
				setTotalElements(0);
				setError(fetchError.response?.data?.message || 'Không thể tải danh sách bài đăng đã lưu.');
				logDashboardEngagement('Fetch saved posts failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code || fetchError.code,
					message: fetchError.response?.data?.message || fetchError.message,
				});
			} finally {
				setLoading(false);
			}
		};

		fetchSavedPosts();
	}, [appliedKeyword, page]);

	const handleSearch = () => {
		setPage(1);
		setAppliedKeyword(keywordInput.trim());
	};

	const handlePrevPage = () => {
		if (loading || page <= 1) return;
		setPage((previous) => previous - 1);
	};

	const handleNextPage = () => {
		if (loading || page >= totalPages) return;
		setPage((previous) => previous + 1);
	};

	return (
		<div className="space-y-5">
			<section className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
					<input
						type="text"
						value={keywordInput}
						onChange={(event) => setKeywordInput(event.target.value)}
						placeholder="Tìm theo tiêu đề bài đã lưu"
						className="h-11 rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0d4f9f]"
					/>

					<button
						type="button"
						onClick={handleSearch}
						className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0d4f9f] px-5 text-sm font-bold text-white transition hover:bg-[#0a3f7d]"
					>
						<AppIcon name="search" className="h-4 w-4" />
						Tìm kiếm
					</button>
				</div>
			</section>

			{error && <StateCard variant="error" title="Không tải được danh sách" message={error} className="rounded-2xl" />}

			<section className="overflow-hidden rounded-2xl border border-[#dbe8f6] bg-white shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
				<div className="flex items-center justify-between border-b border-[#eef2f7] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
					<span>Bài đăng đã lưu</span>
					<span>
						Hiển thị {savedPosts.length} / {totalElements} bài
					</span>
				</div>

				<div className="overflow-x-auto">
					<table className="min-w-full text-left text-sm">
						<thead className="bg-[#f8fafc] text-xs uppercase tracking-[0.12em] text-[#64748b]">
							<tr>
								<th className="px-4 py-3">ID</th>
								<th className="px-4 py-3">Tiêu đề</th>
								<th className="px-4 py-3">Trạng thái</th>
								<th className="px-4 py-3">Lượt xem</th>
								<th className="px-4 py-3">Ngày tạo</th>
								<th className="px-4 py-3">Cập nhật</th>
								<th className="px-4 py-3 text-right">Thao tác</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								<tr>
									<td className="px-4 py-6 text-[#64748b]" colSpan={7}>
										Đang tải danh sách bài đăng đã lưu...
									</td>
								</tr>
							) : savedPosts.length ? (
								savedPosts.map((post) => (
									<tr key={post?.id} className="border-t border-[#eef2f7]">
										<td className="px-4 py-4 font-semibold text-[#0f172a]">#{post?.id || '--'}</td>
										<td className="px-4 py-4 text-[#0f172a]">
											<p className="line-clamp-2 max-w-[460px] font-medium">{post?.title || 'Không có tiêu đề'}</p>
										</td>
										<td className="px-4 py-4">
											<span
												className={`rounded-full border px-3 py-1 text-xs font-semibold ${
													STATUS_BADGE_CLASS[post?.status] || 'bg-[#eff6ff] text-[#0d4f9f] border-[#bfdbfe]'
												}`}
											>
												{POST_STATUS_LABELS[post?.status] || post?.status || 'Không xác định'}
											</span>
										</td>
										<td className="px-4 py-4 text-[#0f172a]">{formatInteger(post?.views)}</td>
										<td className="px-4 py-4 text-[#475569]">{post?.createdAt || '--'}</td>
										<td className="px-4 py-4 text-[#475569]">{post?.updatedAt || '--'}</td>
										<td className="px-4 py-4">
											<div className="flex items-center justify-end">
												<Link
													to={post?.id ? `/posts/${post.id}` : '/posts/0'}
													className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#0d4f9f]"
												>
													Xem
												</Link>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td className="px-4 py-6 text-[#64748b]" colSpan={7}>
										Không có bài đăng đã lưu nào khớp điều kiện tìm kiếm.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<NewsPagination
					currentPage={page}
					totalPages={totalPages}
					loading={loading}
					onPrev={handlePrevPage}
					onNext={handleNextPage}
					wrapperClassName="mb-0 mt-6 pb-4"
				/>
			</section>
		</div>
	);
};

export default DashboardEngagementSection;