import { ABOUT_MISSION_ITEMS } from "../../../constants/system";

export default function VisionMissionSection() {
  return (
    <section className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:gap-24 md:px-12 md:py-32">
      {/* IMAGE */}
      <div className="relative order-2 md:order-1">
        <div className="aspect-[3/4] overflow-hidden rounded-lg bg-[#efedef]">
          <img
            src="https://res.cloudinary.com/diu2nczm5/image/upload/v1775919299/VisionMissionSection1.png"
            alt="Vision"
            className="h-full w-full object-cover"
          />
        </div>

        {/* QUOTE BOX */}
        <div className="absolute -bottom-8 right-0 max-w-xs rounded-xl border-l-4 border-[#735c00] bg-white p-6 shadow-2xl md:-bottom-12 md:-right-12 md:p-8">
          <p className="text-sm italic leading-relaxed text-[#44474c]">
            "Tầm nhìn của chúng tôi là trở thành biểu tượng cho sự tinh tế và uy tín
            trong ngành bất động sản cao cấp tại Việt Nam."
          </p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="order-1 md:order-2">
        <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[#735c00]">
          Tầm nhìn và Sứ mệnh
        </span>

        <h2 className="mb-10 text-4xl leading-tight text-[#041627] md:text-5xl">
          Hướng tới sự <br />
          hoàn mỹ tuyệt đối.
        </h2>

        <div className="space-y-8">
          {ABOUT_MISSION_ITEMS.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[44px_1fr] items-start gap-4 border-b border-[#e7e7ea] pb-6 last:border-b-0 last:pb-0"
            >
              <span className="pt-0.5 text-sm font-bold tracking-wide text-[#735c00]">
                {item.id}.
              </span>

              <div>
                <h4 className="mb-2 text-lg font-bold text-[#041627]">{item.title}</h4>
                <p className="leading-relaxed text-[#44474c]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}