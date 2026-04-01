import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createLogger } from '../../../utils/logger';
import { authValidationSchemas, buildYupResolver } from '../../../validation';

const logOtpEmailModal = createLogger('OtpEmailModal');

// Modal nhap email de gui OTP cho dung flow (verify hoac forgot).
const OtpEmailModal = ({
	open,
	initialEmail,
	purpose,
	loading,
	message,
	onClose,
	onSubmit,
	title,
	description,
	submitLabel,
}) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		resolver: buildYupResolver(authValidationSchemas.otpEmailSchema),
		defaultValues: {
			email: initialEmail || '',
			purpose: purpose || '',
		},
	});

	const resolvedTitle = title || (purpose === 'forgot' ? 'Quên mật khẩu' : purpose === 'verify' ? 'Xác thực email' : 'Gửi mã OTP');
	const resolvedDescription =
		description ||
		(purpose === 'forgot'
			? 'Nhập email để nhận mã OTP đặt lại mật khẩu.'
			: purpose === 'verify'
				? 'Nhập email để nhận mã OTP xác thực tài khoản.'
				: 'Nhập email để nhận mã OTP.');
	const resolvedSubmitLabel = submitLabel || (purpose === 'forgot' ? 'Gửi mã' : 'Gửi OTP');

	useEffect(() => {
		if (open) {
			logOtpEmailModal('Opened', { initialEmail, purpose });
			reset({
				email: initialEmail || '',
				purpose: purpose || '',
			});
			if (purpose !== 'verify' && purpose !== 'forgot') {
				logOtpEmailModal('Missing or invalid purpose. Expected verify|forgot', { purpose });
			}
		}
	}, [open, initialEmail, purpose, reset]);

	if (!open) return null;

	// Chuyen email da validate cho callback ben ngoai xu ly API.
	const handleFormSubmit = (formValues) => {
		const normalizedEmail = formValues.email.trim();
		logOtpEmailModal('Submit', { email: normalizedEmail, purpose: formValues.purpose });
		onSubmit(normalizedEmail);
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041627]/70 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
				<div className="mb-6">
					<h3 className="text-2xl font-bold text-[#041627] [font-family:Noto_Serif]">{resolvedTitle}</h3>
					<p className="mt-2 text-sm text-[#44474c]">{resolvedDescription}</p>
				</div>

				{message && <p className="mb-4 rounded-md bg-[#f5f3f4] px-4 py-3 text-sm text-[#44474c]">{message}</p>}

				<form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
					<input
						type="email"
						{...register('email')}
						placeholder="name@recoland.com"
						className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
					/>
					<input type="hidden" {...register('purpose')} />
					{errors.email?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.email.message}</p>}
					{errors.purpose?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.purpose.message}</p>}

					<div className="flex gap-3">
						<button
							type="button"
							onClick={onClose}
							className="w-1/2 rounded-xl border border-[#c4c6cd] px-4 py-3 text-sm font-semibold text-[#44474c] transition-colors hover:bg-[#f5f3f4]"
						>
							Đóng
						</button>
						<button
							type="submit"
							disabled={loading}
							className="w-1/2 rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading ? 'Đang gửi...' : resolvedSubmitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default OtpEmailModal;
