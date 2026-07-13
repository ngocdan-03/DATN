import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "404 - Không tìm thấy trang";
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen flex items-center justify-center px-4">
      <main className="max-w-4xl w-full flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2 text-center md:text-left">
          <h1 className="text-9xl font-black text-blue-600">404</h1>
          <h2 className="mt-4 text-3xl font-bold text-slate-800">
            Oops! Trang này biến mất rồi
          </h2>
          <p className="mt-4 text-slate-500 text-lg leading-relaxed">
            Có vẻ như đường dẫn này không còn tồn tại hoặc đã được chuyển sang khu vực nhà đất khác tại Đà Nẵng.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4 justify-center md:justify-start">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all active:scale-95"
              onClick={() => navigate("/")}
            >
              VỀ TRANG CHỦ
            </button>
            <button
              className="border-2 border-slate-200 hover:bg-slate-100 text-slate-600 font-bold px-8 py-3 rounded-xl transition-all"
              onClick={() => navigate(-1)}
            >
              QUAY LẠI
            </button>
          </div>
        </div>

        <div className="md:w-1/2">
          <img
            alt="404 Illustration"
            className="w-full h-auto drop-shadow-2xl"
            src="https://storage.googleapis.com/a1aa/image/1d7e321c-9eb7-49ee-5991-14eba4d1fdb9.jpg"
          />
        </div>
      </main>
    </div>
  );
}