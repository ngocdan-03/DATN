import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import AppIcon from '../../common/AppIcon';
import StateCard from '../../common/StateCard';
import NewsPagination from '../news/NewsPagination';
import { POST_STATUS_LABELS, POST_STATUS_OPTIONS } from '../../../constants/postFilters';
import { getMyPosts } from '../../../services/postService';
import { createLogger } from '../../../utils/logger';

const logDashboardPosts = createLogger('DashboardPostsSection');

const STATUS_BADGE_CLASS = {
	PENDING: 'bg-[#fff7ed] text-[#b45309] border-[#fed7aa]',
	APPROVED: 'bg-[#ecfdf3] text-[#047857] border-[#a7f3d0]',
	REJECTED: 'bg-[#fef2f2] text-[#b91c1c] border-[#fecaca]',
};

const formatInteger = (value) => new Intl.NumberFormat('vi-VN').format(Number(value || 0));

const formatDate = (value) => {
	if (!value) return '--';
	return value;
};

const DashboardPostsSection = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialKeyword = searchParams.get('postsKeyword') || '';
	const initialStatus = searchParams.get('postsStatus') || '';
	const initialPageRaw = Number(searchParams.get('postsPage') || '1');
	const initialPage = Number.isFinite(initialPageRaw) && initialPageRaw > 0 ? initialPageRaw : 1;

	const [notice, setNotice] = useState('');
	const [postKeywordInput, setPostKeywordInput] = useState(initialKeyword);
	const [postStatusInput, setPostStatusInput] = useState(initialStatus);
	const [appliedPostKeyword, setAppliedPostKeyword] = useState(initialKeyword);
	const [appliedPostStatus, setAppliedPostStatus] = useState(initialStatus);
	const [postPage, setPostPage] = useState(initialPage);
	const [postItems, setPostItems] = useState([]);
	const [postTotalPages, setPostTotalPages] = useState(1);
	const [postTotalElements, setPostTotalElements] = useState(0);
	const [loadingPosts, setLoadingPosts] = useState(false);
	const [postsError, setPostsError] = useState('');

	const syncPostsQueryParams = ({ keyword, status, page }) => {
		setSearchParams((previousParams) => {
			const nextParams = new URLSearchParams(previousParams);
			nextParams.set('tab', 'posts');

			if (keyword) {
				nextParams.set('postsKeyword', keyword);
			} else {
				nextParams.delete('postsKeyword');
			}

			if (status) {
				nextParams.set('postsStatus', status);
			} else {
				nextParams.delete('postsStatus');
			}

			nextParams.set('postsPage', String(page));
			return nextParams;
		});
	};

	useEffect(() => {
		const fetchMyPosts = async () => {
			setLoadingPosts(true);
			setPostsError('');
			logDashboardPosts('Fetch my posts start', {
				keyword: appliedPostKeyword,
				status: appliedPostStatus,
				page: postPage,
				size: 6,
			});

			try {
				const response = await getMyPosts({
					keyword: appliedPostKeyword,
					status: appliedPostStatus,
					page: postPage,
					size: 6,
				});

				if (response.data?.code === 1000) {
					const result = response.data?.result || {};
					const rows = Array.isArray(result.data) ? result.data : [];
					const currentPage = result.currentPage || postPage;
					setPostItems(rows);
					setPostTotalPages(result.totalPages || 1);
					setPostTotalElements(result.totalElements || rows.length);
					if (currentPage !== postPage) {
						setPostPage(currentPage);
					}
					logDashboardPosts('Fetch my posts success', {
						items: rows.length,
						totalElements: result.totalElements || rows.length,
						totalPages: result.totalPages || 1,
						page: currentPage,
					});
					return;
				}

				setPostItems([]);
				setPostTotalPages(1);
				setPostTotalElements(0);
				setPostsError(response.data?.message || 'Không thể tải danh sách tin của bạn.');
			} catch (error) {
				setPostItems([]);
				setPostTotalPages(1);
				setPostTotalElements(0);
				setPostsError(error.response?.data?.message || 'Không thể tải danh sách tin của bạn.');
				logDashboardPosts('Fetch my posts failed', {
					httpStatus: error.response?.status,
					code: error.response?.data?.code || error.code,
					message: error.response?.data?.message || error.message,
				});
			} finally {
				setLoadingPosts(false);
			}
		};

		fetchMyPosts();
	}, [appliedPostKeyword, appliedPostStatus, postPage]);

	const handlePostSearch = () => {
		const normalizedKeyword = postKeywordInput.trim();
		const normalizedStatus = postStatusInput.trim();

		setNotice('');
		setPostPage(1);
		setAppliedPostKeyword(normalizedKeyword);
		setAppliedPostStatus(normalizedStatus);
		syncPostsQueryParams({ keyword: normalizedKeyword, status: normalizedStatus, page: 1 });
	};

	const handlePostStatusChange = (nextStatus) => {
		const normalizedKeyword = postKeywordInput.trim();
		const normalizedStatus = nextStatus.trim();

		setNotice('');
		setPostStatusInput(nextStatus);
		setPostPage(1);
		setAppliedPostStatus(normalizedStatus);
		syncPostsQueryParams({ keyword: normalizedKeyword, status: normalizedStatus, page: 1 });
	};

	const handlePostPrev = () => {
		if (postPage <= 1 || loadingPosts) return;
		const nextPage = postPage - 1;
		setPostPage(nextPage);
		syncPostsQueryParams({ keyword: appliedPostKeyword, status: appliedPostStatus, page: nextPage });
	};

	const handlePostNext = () => {
		if (postPage >= postTotalPages || loadingPosts) return;
		const nextPage = postPage + 1;
		setPostPage(nextPage);
		syncPostsQueryParams({ keyword: appliedPostKeyword, status: appliedPostStatus, page: nextPage });
	};

	const handlePostEdit = (postId) => {
		setNotice(`Chức năng sửa bài đăng #${postId} đang được cập nhật.`);
	};

	const handlePostDelete = (postId) => {
		setNotice(`Chức năng xóa bài đăng #${postId} đang được cập nhật.`);
	};

	return (
		<div className="space-y-5">
			<section className="rounded-2xl border border-[#dbe8f6] bg-white p-5 shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
				<div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_250px_auto]">
					<input
						type="text"
						value={postKeywordInput}
						onChange={(event) => setPostKeywordInput(event.target.value)}
						placeholder="Tìm theo tiêu đề"
						className="h-11 rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0d4f9f]"
					/>

					<select
						value={postStatusInput}
						onChange={(event) => handlePostStatusChange(event.target.value)}
						className="h-11 rounded-xl border border-[#cbd5e1] bg-white px-4 text-sm text-[#0f172a] outline-none transition focus:border-[#0d4f9f]"
					>
						{POST_STATUS_OPTIONS.map((option) => (
							<option key={option.value || 'ALL'} value={option.value}>
								{option.label}
							</option>
						))}
					</select>

					<button
						type="button"
						onClick={handlePostSearch}
						className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#0d4f9f] px-5 text-sm font-bold text-white transition hover:bg-[#0a3f7d]"
					>
						<AppIcon name="search" className="h-4 w-4" />
						Tìm kiếm
					</button>
				</div>
			</section>

			{notice && <StateCard variant="info" title="Thông báo" message={notice} className="rounded-2xl" />}

			{postsError && <StateCard variant="error" title="Không tải được danh sách" message={postsError} className="rounded-2xl" />}

			<section className="overflow-hidden rounded-2xl border border-[#dbe8f6] bg-white shadow-[0_20px_40px_-32px_rgba(2,8,20,0.45)]">
				<div className="flex items-center justify-between border-b border-[#eef2f7] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[#64748b]">
					<span>Danh sách bài đăng của bạn</span>
					<span>
						Hiển thị {postItems.length} / {postTotalElements} bài
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
							{loadingPosts ? (
								<tr>
									<td className="px-4 py-6 text-[#64748b]" colSpan={7}>
										Đang tải danh sách bài đăng...
									</td>
								</tr>
							) : postItems.length ? (
								postItems.map((post) => (
									<tr key={post?.id} className="border-t border-[#eef2f7]">
										<td className="px-4 py-4 font-semibold text-[#0f172a]">#{post?.id || '--'}</td>
										<td className="px-4 py-4 text-[#0f172a]">
											<p className="line-clamp-2 max-w-[460px] font-medium">{post?.title || 'Không có tiêu đề'}</p>
										</td>
										<td className="px-4 py-4">
											<span className={`rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_BADGE_CLASS[post?.status] || 'bg-[#eff6ff] text-[#0d4f9f] border-[#bfdbfe]'}`}>
												{POST_STATUS_LABELS[post?.status] || post?.status || 'Không xác định'}
											</span>
										</td>
										<td className="px-4 py-4 text-[#0f172a]">{formatInteger(post?.views)}</td>
										<td className="px-4 py-4 text-[#475569]">{formatDate(post?.createdAt)}</td>
										<td className="px-4 py-4 text-[#475569]">{formatDate(post?.updatedAt)}</td>
										<td className="px-4 py-4">
											<div className="flex items-center justify-end gap-2">
												<Link
													to={post?.id ? `/posts/${post.id}` : '/posts/0'}
													className="rounded-lg border border-[#bfdbfe] bg-[#eff6ff] px-3 py-1.5 text-xs font-bold text-[#0d4f9f]"
												>
													Xem
												</Link>
												<button
													type="button"
													onClick={() => handlePostEdit(post?.id)}
													className="rounded-lg border border-[#fde68a] bg-[#fffbeb] px-3 py-1.5 text-xs font-bold text-[#a16207]"
												>
													Sửa
												</button>
												<button
													type="button"
													onClick={() => handlePostDelete(post?.id)}
													className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-1.5 text-xs font-bold text-[#b91c1c]"
												>
													Xóa
												</button>
											</div>
										</td>
									</tr>
								))
							) : (
								<tr>
									<td className="px-4 py-6 text-[#64748b]" colSpan={7}>
										Không có bài đăng nào khớp điều kiện tìm kiếm.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>

				<NewsPagination
					currentPage={postPage}
					totalPages={postTotalPages}
					loading={loadingPosts}
					onPrev={handlePostPrev}
					onNext={handlePostNext}
					wrapperClassName="mb-0 mt-6 pb-4"
				/>
			</section>
		</div>
	);
};

export default DashboardPostsSection;