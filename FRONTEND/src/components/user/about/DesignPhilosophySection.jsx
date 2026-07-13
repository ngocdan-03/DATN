export default function DesignPhilosophySection() {
    return (
        <section class="bg-[#f5f3f4] px-6 py-24 md:px-12 md:py-32">
  <div class="mx-auto max-w-[1440px]">

    <div class="mb-16 md:mb-20">
      <h2 class="mb-4 inline-flex items-center gap-3 text-4xl text-[#041627]">

        Triết lý thiết kế
      </h2>
      <div class="h-1 w-24 bg-[#735c00]"></div>
    </div>

    <div class="grid grid-cols-1 gap-8 md:grid-cols-3">

      <div class="flex flex-col justify-between rounded-xl bg-white p-10 transition hover:-translate-y-1 hover:shadow-2xl md:col-span-2 md:p-12">
        <div>
          <h3 class="mb-6 text-3xl">
            <span class="inline-flex items-center gap-2">
              Sự giao thoa của Truyền thống và Hiện đại
            </span>
          </h3>
          <p class="max-w-xl text-[#44474c]">
            Mỗi dự án của Real Estate là một tác phẩm nghệ thuật. Chúng tôi tôn trọng giá trị văn hóa bản
            địa, kết hợp khéo léo với ngôn ngữ kiến trúc đương đại để tạo nên không gian bền vững.
          </p>
        </div>
      </div>

      <div class="relative overflow-hidden rounded-xl bg-[#1a2b3c] group">
        <img
          src="https://res.cloudinary.com/diu2nczm5/image/upload/v1775918334/DesignPhilosophySection1.png"
          class="h-full w-full object-cover opacity-60 transition duration-700 group-hover:scale-110"
          alt=""
        />
        <div class="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-[#041627]/80 to-transparent p-8 md:p-10">
          <h3 class="mb-2 text-2xl text-white">Bền vững</h3>
          <p class="text-sm text-[#c4d0de]">
            Kiến trúc xanh, tối ưu hóa năng lượng tự nhiên.
          </p>
        </div>
      </div>

      <div class="rounded-xl bg-[#e4e2e3] p-10">
        <h4 class="mb-4 inline-flex items-center gap-2 text-xl">
          Dịch vụ thượng lưu
        </h4>
        <p class="text-sm text-[#44474c]">
          Trải nghiệm cá nhân hóa từ tư vấn, thiết kế đến quản lý vận hành theo tiêu chuẩn 5 sao.
        </p>
      </div>

      <div class="relative flex items-center overflow-hidden rounded-xl bg-[#735c00] p-10 text-white md:col-span-2 md:p-12">
        <div>
          <p class="text-2xl italic leading-relaxed md:text-3xl">
            "Bất động sản không chỉ là những mét vuông, đó là nơi lưu giữ khoảnh khắc hạnh phúc của đời người."
          </p>
          <p class="mt-6 text-sm uppercase tracking-widest opacity-80">
            CEO Real Estate
          </p>
        </div>
      </div>

    </div>
  </div>
</section>
    );
}