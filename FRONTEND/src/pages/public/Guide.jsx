import React, { useMemo, useState } from "react";
import BackButton from "../../components/common/BackButton";
import { GUIDE_CATEGORIES, GUIDE_CONTACT_EMAIL } from "../../constants/guide";
import GuidePostSection from "../../components/user/guide/GuidePostSecion";
import GuidePaymentSection from "../../components/user/guide/GuidePaymentSection";

export default function Guide() {
  const [activeCategory, setActiveCategory] = useState("post");

  const activeContent = useMemo(() => {
    if (activeCategory === "payment") {
      return <GuidePaymentSection />;
    }

    return <GuidePostSection />;
  }, [activeCategory]);

  return (
    <main className="min-h-screen bg-[#f8f7f8] pb-20 pt-6">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <div className="mb-8">
          <BackButton />
          <div className="mt-6">
            <h1 className="text-3xl font-black text-[#041627] [font-family:Noto_Serif]">
              Trung tâm hướng dẫn
            </h1>
            <p className="mt-2 text-gray-500">
              Tìm kiếm mọi thông tin để bắt đầu hành trình của bạn tại Đà Nẵng Real
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <aside className="space-y-4 lg:col-span-4 lg:sticky lg:top-6 lg:self-start lg:max-h-[calc(100vh-3rem)] lg:overflow-y-auto">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
              <h3 className="mb-6 text-sm font-bold uppercase tracking-widest text-gray-400">
                Chủ đề hỗ trợ
              </h3>
              <div className="space-y-2">
                {GUIDE_CATEGORIES.map((cat) => {
                  const isActive = cat.id === activeCategory;

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`flex w-full items-center gap-3 rounded-2xl p-4 text-left text-sm font-bold transition-all ${
                        isActive
                          ? "bg-[#041627] text-white shadow-lg shadow-blue-900/20"
                          : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <span className="text-xl">{cat.icon}</span>
                      {cat.title}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl bg-[#cca830] p-6 text-white shadow-lg shadow-yellow-600/20">
              <p className="mb-2 font-bold">Cần hỗ trợ trực tiếp?</p>
              <p className="mb-4 text-xs opacity-90">
                Đội ngũ kỹ thuật luôn sẵn sàng giúp đỡ bạn 24/7.
              </p>
              <a
                href={`mailto:${GUIDE_CONTACT_EMAIL}`}
                className="block w-full rounded-xl bg-white py-3 text-center text-sm font-bold text-[#cca830] transition-colors hover:bg-gray-50"
              >
                Liên hệ qua Email
              </a>
            </div>
          </aside>

          <div className="lg:col-span-8">{activeContent}</div>
        </div>
      </div>
    </main>
  );
}