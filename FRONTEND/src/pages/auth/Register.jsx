import { useState } from "react";
import { Link, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authValidationSchemas, buildYupResolver } from "../../validation";
import { useAuth } from "../../contexts/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    register: registerAccount,
    isLoading,
    error: authError,
    isAuthenticated,
    user,
  } = useAuth();
  const [submitError, setSubmitError] = useState("");

  // gắn validation cho form đăng ký
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: buildYupResolver(authValidationSchemas.registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      phone: "",
    },
  });
  const disabled = isLoading || isSubmitting;

  const onSubmit = async (values) => {
    setSubmitError("");
    try {
      const result = await registerAccount(values);
      navigate("/send-otp-verify", {
        replace: true,
        state: {
          email: values.email,
          flash: {
            type: "success",
            title: "Đăng ký thành công",
            message: result?.message || "Vui lòng lấy OTP để xác thực email.",
          },
        },
      });
    } catch (err) {
      setSubmitError(err?.response?.data?.message || err.message || "Đăng ký thất bại");
  }
  };

  // chặn truy cập trang đăng ký nếu đã đăng nhập
  if (isAuthenticated) {
    const from = location.state?.from?.pathname;
    const invalidFrom = !from || from === "/login" || from === "/register";
    const roles = user?.roles || [];

    if (roles.includes("ADMIN")) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (!invalidFrom) {
      return <Navigate to={from} replace />;
    }
    return <Navigate to="/user/dashboard" replace />;
  }
  return (
  <section className="px-6 py-16 bg-[#f7f9fc]">
    <div className="max-w-xl mx-auto">
      <div className="mb-10">
        <span className="mb-4 inline-flex items-center rounded-full bg-[#cca830]/25 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f3e00]">
          Khởi tạo thành viên
        </span>

        <h2 className="mb-3 text-4xl font-bold text-[#041627]">RecoLand</h2>

        <p className="text-[#44474c]">
          Đăng ký để nhận đề xuất bất động sản phù hợp và cập nhật thị trường.
        </p>
      </div>

      {submitError || authError ? (
        <p className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {submitError || authError}
        </p>
      ) : null}

      <form className="space-y-7" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-5 rounded-xl border border-[#c4c6cd]/40 bg-[#f5f3f4] p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="col-span-2">
              <label className="block mb-1 font-semibold text-sm">Họ và tên</label>
              <input
                type="text"
                placeholder="Nguyễn Văn A"
                className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] outline-none"
                {...register("fullName")}
              />
              {errors.fullName ? (
                <p className="mt-1 text-xs text-red-600">{errors.fullName.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm">Email</label>
              <input
                type="email"
                placeholder="name@recoland.com"
                className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] outline-none"
                {...register("email")}
              />
              {errors.email ? (
                <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
              ) : null}
            </div>

            <div>
              <label className="block mb-1 font-semibold text-sm">Số điện thoại</label>
              <input
                type="tel"
                placeholder="+84 000 000 000"
                className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] outline-none"
                {...register("phone")}
              />
              {errors.phone ? (
                <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
              ) : null}
            </div>

            <div className="col-span-2">
              <label className="block mb-1 font-semibold text-sm">Mật khẩu</label>
              <input
                type="password"
                placeholder="Tối thiểu 8 ký tự"
                className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] outline-none"
                {...register("password")}
              />
              {errors.password ? (
                <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
              ) : null}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-xl transition hover:brightness-105 disabled:opacity-70"
        >
          {disabled ? "Đang xử lý..." : "Đăng ký tài khoản"}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-[#44474c]">Đã có tài khoản?</span>
          <Link to="/login" className="text-sm font-bold text-[#041627] underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </div>
  </section>
);
}