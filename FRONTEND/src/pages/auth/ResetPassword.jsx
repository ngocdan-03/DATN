import { useMemo, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authValidationSchemas, buildYupResolver } from "../../validation";
import { authService } from "../../services/authService";
import AppModal from "../../components/modals/AppModal";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const presetEmail = useMemo(() => location.state?.email || "", [location.state]);
  const [email, setEmail] = useState(presetEmail);
  const [isSubmittingApi, setIsSubmittingApi] = useState(false);
  const [modal, setModal] = useState({
    open: false,
    type: "info",
    title: "",
    message: "",
    confirmText: "Đóng",
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: buildYupResolver(authValidationSchemas.forgotResetSchema),
    defaultValues: {
      code: "",
      newPassword: "",
    },
  });

  if (!presetEmail) {
    return <Navigate to="/forgot-password" replace />;
  }

  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const confirmModal = () => {
    if (modal.type === "success") {
      navigate("/login", {
        replace: true,
        state: { email },
      });
      return;
    }
    closeModal();
  };

  const onSubmit = async (values) => {
    setIsSubmittingApi(true);
    try {
      const result = await authService.resetPassword({
        email: email.trim(),
        code: values.code.trim(),
        newPassword: values.newPassword,
      });

      setModal({
        open: true,
        type: "success",
        title: "Đặt lại mật khẩu thành công",
        message: result?.message || "Bạn có thể đăng nhập bằng mật khẩu mới.",
        confirmText: "Đăng nhập ngay",
      });
    } catch (err) {
      setModal({
        open: true,
        type: "error",
        title: "Đặt lại mật khẩu thất bại",
        message: err?.message || "OTP không hợp lệ hoặc đã hết hạn.",
        confirmText: "Đóng",
      });
    } finally {
      setIsSubmittingApi(false);
    }
  };

  const disabled = isSubmitting || isSubmittingApi;

  return (
    <section className="px-6 py-12">
      <div className="mb-8">
        <span className="mb-4 inline-flex items-center rounded-full bg-yellow-200/40 px-4 py-1.5 text-[10px] font-bold uppercase tracking-wider text-yellow-900">
          Reset mật khẩu
        </span>
        <h2 className="mb-3 text-4xl font-bold text-slate-900">Đặt lại mật khẩu</h2>
        <p className="text-slate-600">Nhập OTP và mật khẩu mới để hoàn tất.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 focus:border-yellow-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Mã OTP</label>
                <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="Nhập 6 chữ số"
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-yellow-600 focus:outline-none"
                {...register("code", {
                    onChange: (event) => {
                    event.target.value = event.target.value.replace(/\D/g, "").slice(0, 6);
                    },
                })}
                onPaste={(event) => {
                    event.preventDefault();
                    const pasted = event.clipboardData.getData("text");
                    event.target.value = pasted.replace(/\D/g, "").slice(0, 6);
                }}
                />
            {errors.code ? <p className="mt-1 text-xs text-red-600">{errors.code.message}</p> : null}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Mật khẩu mới</label>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Nhập mật khẩu mới"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-yellow-600 focus:outline-none"
              {...register("newPassword")}
            />
            {errors.newPassword ? (
              <p className="mt-1 text-xs text-red-600">{errors.newPassword.message}</p>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-yellow-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-yellow-400"
        >
          {disabled ? "Đang xử lý..." : "Xác nhận đặt lại mật khẩu"}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-slate-600">Gửi lại OTP?</span>
          <Link
            to="/forgot-password"
            state={{ email }}
            className="text-sm font-bold text-slate-900 underline hover:text-yellow-700"
          >
            Quay lại
          </Link>
        </div>
      </form>

      <AppModal
        open={modal.open}
        type={modal.type}
        title={modal.title}
        message={modal.message}
        confirmText={modal.confirmText}
        onClose={closeModal}
        onConfirm={confirmModal}
        closeOnBackdrop
        closeOnEsc
      />
    </section>
  );
}