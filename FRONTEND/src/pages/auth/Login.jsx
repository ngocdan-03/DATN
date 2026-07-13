import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authValidationSchemas, buildYupResolver } from "../../validation";
import { useAuth } from "../../contexts/AuthContext";
import AppModal from "../../components/modals/AppModal";
export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, error: authError, isAuthenticated, user} = useAuth();
  const [submitError, setSubmitError] = useState("");
  const [unverifiedMessage, setUnverifiedMessage] = useState("");


  const closeUnverifiedModal = () => setUnverifiedMessage("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: buildYupResolver(authValidationSchemas.loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const disabled = isLoading || isSubmitting;

  const onSubmit = async (values) => {
    setSubmitError("");
    setUnverifiedMessage("");
    try {
      const result = await login(values);

      const from = location.state?.from?.pathname;
      const invalidFrom = !from || from === "/login" || from === "/register";

      const roles = result?.user?.roles || [];

      console.log("kết quả login", result);
      console.log("role user", roles);
      console.log("trang đã truy cập trước khi login", from);


      if (roles.includes("ADMIN")) {
        navigate("/admin/dashboard", { replace: true });
        return;
      }

      if (!invalidFrom) {
        navigate(from, { replace: true });
        return;
      }

      if (roles.includes("USER")) {
        navigate("/user/dashboard", { replace: true });
        return;
      }

      navigate("/", { replace: true });
    } catch (err) {
      if(err?.code === 1012){
        console.log("bắt được code 1012");
        setUnverifiedMessage(err?.response?.data?.message || err.message || "Tài khoản chưa được xác minh");
        return;
      }
      setSubmitError(err?.response?.data?.message || err.message || "Đăng nhập thất bại");
    }
  };

  // hàm đóng modal đến lấy otp xác thực tài khoản
  const goToSendOtpVerify = () => {
    navigate("/send-otp-verify", {
      state: { email: getValues("email") || "" },
    });
    setUnverifiedMessage("");
  };

  // chặn người dùng đã đăng nhập truy cập lại trang login
  if (isAuthenticated) {
    console.log(isAuthenticated, user);
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
    <section className="px-6 py-12">
      <div className="mb-10">
        <span className="mb-4 inline-flex items-center rounded-full bg-yellow-200/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-900">
          Chào mừng trở lại
        </span>

        <h2 className="mb-3 text-4xl font-bold text-slate-900">Đăng nhập</h2>

        <p className="text-slate-600">
          Truy cập tài khoản để theo dõi tin đăng và trạng thái giao dịch.
        </p>
      </div>
    <AppModal
      open={Boolean(unverifiedMessage)}
      type="warning"
      title="Tài khoản chưa xác thực"
      message={unverifiedMessage}
      confirmText="xác thực ngay"
      onConfirm={goToSendOtpVerify}
      onClose={closeUnverifiedModal}
      closeOnBackdrop
      closeOnEsc
    />
      {submitError || authError ? (
        <p className="mb-4 rounded-md bg-red-100 px-4 py-3 text-sm text-red-700">
          {submitError || authError}
        </p>
      ) : null}

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Email
            </label>
            <input
              type="email"
              placeholder="name@recoland.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-yellow-600 focus:outline-none"
              {...register("email")}
            />
            {errors.email ? (
              <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>
            ) : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-yellow-600 focus:outline-none"
              {...register("password")}
            />
            {errors.password ? (
              <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
            ) : null}

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() =>
                  navigate("/forgot-password", {
                    state: { email: getValues("email") || "" },
                  })
                }
                className="text-sm font-semibold text-yellow-700 underline hover:text-yellow-800"
              >
                Quên mật khẩu?
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-yellow-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-yellow-400"
        >
          {disabled ? "Đang xử lý..." : "Đăng nhập"}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-slate-600">Chưa có tài khoản?</span>
          <Link
            to="/register"
            className="text-sm font-bold text-slate-900 underline hover:text-yellow-700"
          >
            Đăng ký
          </Link>
        </div>
      </form>
    </section>
  );
}