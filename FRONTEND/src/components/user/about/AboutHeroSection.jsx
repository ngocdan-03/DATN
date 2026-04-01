import AppIcon from '../../common/AppIcon';

// Hero mo dau cho trang gioi thieu thuong hieu.
const AboutHeroSection = () => {
    return (
        <header className="relative mx-auto max-w-[1440px] overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20">
            <div className="grid grid-cols-12 items-center gap-6">
                <div className="z-10 col-span-12 lg:col-span-5">
                    <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#735c00] [font-family:Manrope]">
						<AppIcon name="menuRows" className="h-4 w-4" />
                        Giới thiệu RecoLand
                    </p>
                    <h1 className="mb-8 text-5xl font-bold leading-[1.1] text-[#041627] [font-family:Noto_Serif] md:text-7xl lg:text-8xl">
                        Kiến tạo
                        <br />
                        <span className="font-normal italic">Di sản</span>
                        <br />
                        Kiến trúc.
                    </h1>
                    <p className="mb-10 max-w-md text-lg leading-relaxed text-[#44474c] [font-family:Manrope]">
                        Tại RecoLand, chúng tôi không chỉ xây dựng ngôi nhà; chúng tôi kiến tạo những không gian sống
                        đậm chất nghệ thuật, nơi giá trị văn hóa và kiến trúc hiện đại giao thoa.
                    </p>
                </div>

                <div className="relative col-span-12 mt-12 lg:col-span-7 lg:mt-0">
                    <div className="relative w-full overflow-hidden rounded-lg bg-[#1a2b3c] shadow-2xl aspect-[4/5] md:translate-x-12 md:translate-y-12">
                        <img
                            alt="High-end modern architecture"
                            className="h-full w-full object-cover opacity-80"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDkfVf-tLKmCJ_I0YlSaRk4IkNPhoKHal3RNeYHsaSo5u_6kkC9In0leInkRSInxsolp1FCtBUtczxsJKCBLQuga7-jqVMtoe_g9XT-KPmLS0Ze4fVltbZ0Ri1zBpEdfzdFKl4LiHbOuIgufZKwlwqtZtxtJs0ig4rNA54ih5NCEwJhS3OcnJW1L82lprVjDSVQ12-xYUlBtz_mD041noW3cnhRJU1n1H4_FBcvjCHDvgycDVvseQbGf07pZiAdweiLlsAzDXnA8VRe"
                        />
                    </div>

                    <div className="absolute left-0 top-0 hidden w-[80%] -translate-x-6 -translate-y-6 overflow-hidden rounded-lg border-8 border-[#fbf9fa] bg-[#f5f3f4] shadow-xl aspect-square md:block">
                        <img
                            alt="Luxury interior design"
                            className="h-full w-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-oQLhIHVn2B4Qk5wgPyzEjzDfwUoaVf0C7LS0dNbyv6hBiuI6uZIX8jX52m-klpNYQzVxeU8aUdA3ZE1DPUV9Ld62p1jStbHV5f1szLEAVFv7SY6bxSCYmT7fJPpWE9WV1NPm5zk8-8KlZasvv-Q8CeTMe2BCp5WH1StYcTFWL0R2qkkTBrokVKPbaueBxukVSP9X1cF8lS1ml-r89VU6j7pw-0ijxiArRbsq31q2Q2FMyclSGm1FUSVRnw-c5FWUnIrAe9rAcOLM"
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AboutHeroSection;