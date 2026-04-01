import AppIcon from '../../../common/AppIcon';

// Khoi mo ta chi tiet noi dung bai dang.
const PostDescription = ({ description }) => {
	return (
		<section className="rounded-3xl border border-[#e4e2e3] bg-white p-6 md:p-8" data-component="DescriptionBlock">
			<h3 className="inline-flex items-center gap-2 text-xl font-black text-[#041627] [font-family:Noto_Serif]">
				<AppIcon name="article" className="h-[22px] w-[22px] text-[#735c00]" />
				Mô tả chi tiết
			</h3>
			<p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-[#3f4650]">{description}</p>
		</section>
	);
};

export default PostDescription;
