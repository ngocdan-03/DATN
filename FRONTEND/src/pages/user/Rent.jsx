import AppIcon from '../../components/common/AppIcon';

// Trang placeholder cho danh sach bat dong san cho thue.
const Rent = () => {
	return (
		<section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12">
			<h1 className="inline-flex items-center gap-3 text-4xl font-bold text-[#041627] [font-family:Noto_Serif]">
				<AppIcon name="rentHouse" className="h-8 w-8 text-[#735c00]" />
				Nhà cho thuê
			</h1>
			<p className="mt-4 text-[#44474c] [font-family:Manrope]">
				Nội dung trang cho thuê đang được cập nhật.
			</p>
		</section>
	);
};

export default Rent;
