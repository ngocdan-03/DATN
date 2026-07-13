import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { authValidationSchemas, buildYupResolver } from "../../validation";
import { authService } from "../../services/authService";
import AppModal from "../../components/modals/AppModal";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const presetEmail = useMemo(() => location.state?.email || "", [location.state]);
  const [nextEmail, setNextEmail] = useState("");
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
    resolver: buildYupResolver(authValidationSchemas.otpEmailSchema),
    defaultValues: {
      email: presetEmail,
      purpose: "forgot",
    },
  });

  const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

  const confirmModal = () => {
    if (nextEmail) {
      navigate("/reset-password", {
        replace: true,
        state: { email: nextEmail },
      });
      return;
    }
    closeModal();
  };

  const onSubmit = async (values) => {
    setIsSubmittingApi(true);
    try {
      const email = values.email.trim();
      const result = await authService.forgotPassword({ email });

      setNextEmail(email);
      setModal({
        open: true,
        type: "success",
        title: "Đã gửi OTP",
        message: result?.message || "Mã OTP đặt lại mật khẩu đã được gửi về email.",
        confirmText: "Tiếp tục",
      });
    } catch (err) {
      setNextEmail("");
      setModal({
        open: true,
        type: "error",
        title: "Gửi OTP thất bại",
        message: err?.message || "Không thể gửi OTP, vui lòng thử lại.",
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
          Quên mật khẩu
        </span>
        <h2 className="mb-3 text-4xl font-bold text-slate-900">Lấy OTP đặt lại mật khẩu</h2>
        <p className="text-slate-600">Nhập email tài khoản để nhận mã OTP.</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5 md:p-6">
          <div>
            <label className="mb-1 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              autoComplete="email"
              placeholder="name@recoland.com"
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-gray-400 focus:border-yellow-600 focus:outline-none"
              {...register("email")}
            />
            {errors.email ? <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> : null}
          </div>

          <input type="hidden" {...register("purpose")} />
        </div>

        <button
          type="submit"
          disabled={disabled}
          className="w-full rounded-lg bg-yellow-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-yellow-700 disabled:cursor-not-allowed disabled:bg-yellow-400"
        >
          {disabled ? "Đang xử lý..." : "Gửi OTP"}
        </button>

        <div className="flex items-center justify-center gap-2 pt-1">
          <span className="text-sm text-slate-600">Quay lại đăng nhập?</span>
          <Link to="/login" className="text-sm font-bold text-slate-900 underline hover:text-yellow-700">
            Đăng nhập
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