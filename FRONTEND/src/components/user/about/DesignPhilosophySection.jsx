import AppIcon from '../../common/AppIcon';

// Section mo ta triet ly thiet ke va gia tri cot loi.
const DesignPhilosophySection = () => {
    return (
        <section className="bg-[#f5f3f4] px-6 py-24 md:px-12 md:py-32">
            <div className="mx-auto max-w-[1440px]">
                <div className="mb-16 md:mb-20">
                    <h2 className="mb-4 inline-flex items-center gap-3 text-4xl text-[#041627] [font-family:Noto_Serif]">
						<AppIcon name="arrowDiagonal" className="h-7 w-7 text-[#735c00]" strokeWidth={1.8} />
                        Triết lý thiết kế
                    </h2>
                    <div className="h-1 w-24 bg-[#735c00]"></div>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                    <div className="group flex flex-col justify-between rounded-xl bg-white p-10 transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:col-span-2 md:p-12">
                        <div>
                            <h3 className="mb-6 text-3xl [font-family:Noto_Serif]">
                                <span className="inline-flex items-center gap-2">
									<AppIcon name="plus" className="h-6 w-6 text-[#735c00]" strokeWidth={1.8} />
                                    Sự giao thoa của Truyền thống và Hiện đại
                                </span>
                            </h3>
                            <p className="max-w-xl leading-relaxed text-[#44474c] [font-family:Manrope]">
                                Mỗi dự án của RecoLand là một tác phẩm nghệ thuật. Chúng tôi tôn trọng giá trị văn hóa bản
                                địa, kết hợp khéo léo với ngôn ngữ kiến trúc đương đại để tạo nên không gian bền vững.
                            </p>
                        </div>
                    </div>

                    <div className="group relative overflow-hidden rounded-xl bg-[#1a2b3c]">
                        <img
                            alt="Sustainability Focus"
                            className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-LbnTJZTV3HJovHlOCBHigYzgeTb1G9cLs7K2BuXWXZV4rveDlwA8AG3BI7PuA01Mosk90Chd1W3b5H3uBeY1FsJ19G4ouC-HZzDpyIC0RFGSFh6JfjQSJBGgijVKXoz-UWaYeYpPJiKqR-gBBYnEVDkk38zrU8cAGnpmKfnLEhW3t1UREGzE60azthJvqeODwpQT2ADTjOOcwDIEcr2qSBtQlg8-ZtgRxM8WnNA3FMaXYwcyPrQlhL_5jMp6AleiZ3DngE0dFB_x"
                        />
                        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#041627]/80 to-transparent p-8 md:p-10">
                            <h3 className="mb-2 text-2xl text-white [font-family:Noto_Serif]">Bền vững</h3>
                            <p className="text-sm text-[#c4d0de] [font-family:Manrope]">
                                Kiến trúc xanh, tối ưu hóa năng lượng tự nhiên.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl bg-[#e4e2e3] p-10">
                        <h4 className="mb-4 inline-flex items-center gap-2 text-xl [font-family:Noto_Serif]">
                            <AppIcon name="badgeCheck" className="h-5 w-5 text-[#735c00]" strokeWidth={1.8} />
                            Dịch vụ thượng lưu
                        </h4>
                        <p className="text-sm text-[#44474c] [font-family:Manrope]">
                            Trải nghiệm cá nhân hóa từ tư vấn, thiết kế đến quản lý vận hành theo tiêu chuẩn 5 sao.
                        </p>
                    </div>

                    <div className="relative flex items-center overflow-hidden rounded-xl bg-[#735c00] p-10 text-white md:col-span-2 md:p-12">
                        <div className="relative z-10">
                            <p className="text-2xl italic leading-relaxed [font-family:Noto_Serif] md:text-3xl">
                                "Bất động sản không chỉ là những mét vuông, đó là nơi lưu giữ khoảnh khắc hạnh phúc của đời
                                người."
                            </p>
                            <p className="mt-6 text-sm uppercase tracking-widest [font-family:Manrope] opacity-80">
                                CEO RecoLand
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DesignPhilosophySection;