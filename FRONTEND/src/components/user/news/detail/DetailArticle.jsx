import ArticleBody from './ArticleBody';
import DetailHero from './DetailHero';
import FeaturedImage from './FeaturedImage';
import LeadSummary from './LeadSummary';
import SourceCTA from './SourceCTA';

// Khoi article tong hop cac section cua trang chi tiet.
const DetailArticle = ({ article }) => {
	return (
		<article>
			<DetailHero
				category={article?.category}
				title={article?.title}
				sourceName={article?.sourceName}
				displayDate={article?.displayDate}
			/>
			<FeaturedImage thumbnailUrl={article?.thumbnailUrl} title={article?.title} />
			<LeadSummary summary={article?.summary} />
			<ArticleBody summary={article?.summary} />
			<SourceCTA sourceName={article?.sourceName} originalUrl={article?.originalUrl} />
		</article>
	);
};

export default DetailArticle;
