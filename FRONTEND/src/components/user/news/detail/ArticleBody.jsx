// Than bai dang text theo du lieu hien co.
const ArticleBody = ({ summary }) => {
	const paragraphOne = summary || 'Nội dung bài viết đang được cập nhật.';
	const paragraphTwo =
		'RecoLand sẽ tiếp tục cập nhật phân tích chi tiết và thông tin thị trường mới nhất ngay khi có dữ liệu đầy đủ từ nguồn chính thống.';

	return (
		<section className="space-y-8 text-lg leading-relaxed text-[#44474c]">
			<p>{paragraphOne}</p>
			<p>{paragraphTwo}</p>
		</section>
	);
};

export default ArticleBody;
