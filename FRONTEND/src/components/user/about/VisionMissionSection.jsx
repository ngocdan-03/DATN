import AppIcon from '../../common/AppIcon';

// Section tam nhin, su menh va cam ket phat trien cua RecoLand.
const VisionMissionSection = () => {
    const missionItems = [
        {
            index: '01',
            title: 'Chất lượng Di sản',
            description: 'Xây dựng công trình có giá trị vượt thời gian, không bị lỗi thời.',
            iconName: 'buildingLegacy',
        },
        {
            index: '02',
            title: 'Cộng đồng tinh hoa',
            description: 'Kết nối chủ nhân xứng tầm trong hệ sinh thái sống đẳng cấp.',
            iconName: 'group',
        },
        {
            index: '03',
            title: 'Trách nhiệm xã hội',
            description: 'Phát triển đi đôi với bảo tồn môi trường và đóng góp cho đô thị.',
            iconName: 'responsibility',
        },
    ];

    return (
        <section className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-16 px-6 py-24 md:grid-cols-2 md:gap-24 md:px-12 md:py-32">
            <div className="relative order-2 md:order-1">
                <div className="overflow-hidden rounded-lg bg-[#efedef] aspect-[3/4]">
                    <img
                        alt="Visionary Architecture"
                        className="h-full w-full object-cover"
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfscvSyNSLD6x7JklwXoIWJQT7T63nvwbwlWacQDXQoIvHf4x2uQRjVi9wOn6UBPm2Miam3iFcO63oYIG21UbB-J8viXbV2wCDJ2b6BPzpe5XDbMVlsN9zF2KCzk0TFp513P2Ox-3qSPip_KocuGII-65donpWoldGk28Ra0EHbVm99CaOlr01FPBrP45MFPh62ycD_J5ZmaRapdCbm46e0_GXbadm7wuh2wh7wtN5H0sJ2NXjrELjRknjJtlHmPZ69qh2qd8ojJ13"
                    />
                </div>

                <div className="absolute -bottom-8 right-0 max-w-xs rounded-xl border-l-4 border-[#735c00] bg-white p-6 shadow-2xl md:-bottom-12 md:-right-12 md:p-8">
                    <p className="text-sm italic text-[#44474c] [font-family:Manrope]">
                        "Tầm nhìn của chúng tôi là trở thành biểu tượng cho sự tinh tế và uy tín trong ngành bất động sản
                        cao cấp tại Việt Nam."
                    </p>
                </div>
            </div>

            <div className="order-1 md:order-2">
                <span className="mb-4 block text-xs font-bold uppercase tracking-[0.2em] text-[#735c00] [font-family:Manrope]">
                    Tầm nhìn và Sứ mệnh
                </span>
                <h2 className="mb-8 text-4xl leading-tight text-[#041627] [font-family:Noto_Serif] md:text-5xl">
                    Hướng tới sự
                    <br />
                    hoàn mỹ tuyệt đối.
                </h2>

                <div className="space-y-8 [font-family:Manrope]">
                    {missionItems.map((item) => (
                        <div key={item.index} className="flex gap-5">
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#cca830]/40 bg-[#cca830]/15 text-[#735c00]">
                                    <AppIcon name={item.iconName} className="h-5 w-5" strokeWidth={1.8} />
                                </div>
                                <span className="text-sm font-bold text-[#735c00] [font-family:Noto_Serif]">{item.index}.</span>
                            </div>
                            <div>
                                <h4 className="mb-2 text-lg font-bold">{item.title}</h4>
                                <p className="text-[#44474c]">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default VisionMissionSection;