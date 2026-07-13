export default function AboutHeroSection() {
    return (
        <header class="relative mx-auto max-w-[1440px] overflow-hidden px-6 pb-24 pt-16 md:px-12 md:pb-32 md:pt-20">

        <div class="grid grid-cols-12 items-center gap-6">

            <div class="z-10 col-span-12 lg:col-span-5">

            <p class="mb-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#735c00]">
                Giới thiệu real estate
            </p>

            <h1 class="mb-8 text-5xl font-bold leading-[1.1] text-[#041627] md:text-7xl lg:text-8xl">
                Kiến tạo <br />
                Kiến trúc.
            </h1>

            <p class="mb-10 max-w-md text-lg leading-relaxed text-[#44474c]">
                Tại Real Estate, chúng tôi không chỉ xây dựng ngôi nhà; chúng tôi kiến tạo những không gian sống
                đậm chất nghệ thuật, nơi giá trị văn hóa và kiến trúc hiện đại giao thoa.
            </p>

            </div>

            <div class="relative col-span-12 mt-12 lg:col-span-7 lg:mt-0">

            <div class="relative w-full overflow-hidden rounded-lg bg-[#1a2b3c] shadow-2xl aspect-[4/5] md:translate-x-12 md:translate-y-12">
                <img
                src="https://res.cloudinary.com/diu2nczm5/image/upload/v1775918150/AboutHeroSection1.png"
                alt="Modern architecture"
                class="h-full w-full object-cover opacity-80"
                />
            </div>

            <div class="absolute left-0 top-0 hidden w-[80%] -translate-x-6 -translate-y-6 overflow-hidden rounded-lg border-8 border-[#fbf9fa] bg-[#f5f3f4] shadow-xl aspect-square md:block">
                <img
                src="https://res.cloudinary.com/diu2nczm5/image/upload/v1775918148/AboutHeroSection2.png"
                alt="Interior design"
                class="h-full w-full object-cover"
                />
            </div>

            </div>

        </div>
        </header>
    );
}