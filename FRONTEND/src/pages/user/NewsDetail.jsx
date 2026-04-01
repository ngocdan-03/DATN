import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import StateCard from '../../components/common/StateCard';
import BackLink from '../../components/user/news/detail/BackLink';
import DetailArticle from '../../components/user/news/detail/DetailArticle';
import { getNewsDetail } from '../../services/newsService';
import { createLogger } from '../../utils/logger';

const logNewsDetail = createLogger('NewsDetail');

// Trang chi tiet tin tuc theo id tu URL /news/:id.
const NewsDetail = () => {
	const { id } = useParams();
	const [article, setArticle] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchDetail = async () => {
			setLoading(true);
			setError('');
			setArticle(null);
			logNewsDetail('Fetch detail start', { id });

			try {
				const response = await getNewsDetail(id);
				if (response.data?.code === 1000) {
					setArticle(response.data?.result || null);
					logNewsDetail('Fetch detail success', {
						id: response.data?.result?.id,
						title: response.data?.result?.title,
					});
					return;
				}

				setError(response.data?.message || 'Không thể tải chi tiết tin tức.');
			} catch (fetchError) {
				setError(fetchError.response?.data?.message || 'Không thể tải chi tiết tin tức.');
				logNewsDetail('Fetch detail failed', {
					httpStatus: fetchError.response?.status,
					code: fetchError.response?.data?.code,
					message: fetchError.response?.data?.message || fetchError.message,
					id,
				});
			} finally {
				setLoading(false);
			}
		};

		if (!id) {
			setLoading(false);
			setError('ID tin tức không hợp lệ.');
			return;
		}

		fetchDetail();
	}, [id]);

	return (
		<main className="mx-auto max-w-4xl px-6 pb-20 pt-12">
			<BackLink />

			{loading && <StateCard message="Đang tải chi tiết tin tức..." />}

			{!loading && error && <StateCard variant="error" title="Không tải được bài viết" message={error} />}

			{!loading && !error && article && <DetailArticle article={article} />}
		</main>
	);
};

export default NewsDetail;
