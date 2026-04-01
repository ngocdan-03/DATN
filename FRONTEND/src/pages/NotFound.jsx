import { useNavigate } from "react-router-dom";
import IconTextButton from "../components/common/IconTextButton";

// Trang 404 cho cac duong dan khong ton tai.
export default function NotFound() {
  const navigate = useNavigate();

  // Quay lai trang truoc do trong lich su dieu huong.
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-gradient-to-tr from-purple-600 via-pink-500 to-red-500 min-h-screen flex items-center justify-center px-4">
      <main className="bg-white bg-opacity-90 rounded-3xl shadow-2xl max-w-4xl w-full p-10 md:p-16 flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-9xl font-extrabold text-purple-700 leading-none select-none">
            404
          </h1>
          <h2 className="mt-4 text-3xl font-bold text-gray-800">
            Oops! Không tìm thấy trang
          </h2>
          <p className="mt-4 text-gray-600 max-w-md">
            Trang bạn tìm có thể đã bị xóa, đổi đường dẫn hoặc tạm thời không khả dụng.
          </p>
          <IconTextButton
            className="mt-8 inline-flex items-center bg-purple-700 hover:bg-purple-800 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition-colors duration-300 uppercase"
            onClick={handleGoBack}
            iconName="chevronLeft"
            iconClassName="mr-3 h-5 w-5"
          >
            QUAY LẠI
          </IconTextButton>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0 flex justify-center">
          <img
            alt="A modern flat style illustration of a confused person standing next to a large 404 error sign with abstract shapes and bright colors"
            className="w-72 h-72 md:w-80 md:h-80 object-contain"
            height="400"
            src="https://storage.googleapis.com/a1aa/image/1d7e321c-9eb7-49ee-5991-14eba4d1fdb9.jpg"
            width="400"
          />
        </div>
      </main>
    </div>
  );
}