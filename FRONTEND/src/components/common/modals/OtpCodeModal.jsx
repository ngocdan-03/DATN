import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { createLogger } from '../../../utils/logger';
import { authValidationSchemas, buildYupResolver } from '../../../validation';

const logOtpCodeModal = createLogger('OtpCodeModal');

// Modal nhap ma OTP, co the kem nut gui lai OTP theo tung flow.
const OtpCodeModal = ({
	open,
	email,
	loading,
	message,
	onClose,
	onSubmit,
	onResend,
	resendLoading = false,
	resendLabel = 'Gửi lại OTP',
	title = 'Nhập mã OTP',
	description,
	submitLabel = 'Xác thực',
	showNewPassword = false,
	newPassword = '',
	onNewPasswordChange,
	newPasswordPlaceholder = 'Nhập mật khẩu mới',
}) => {
	const resolverSchema = showNewPassword ? authValidationSchemas.forgotResetSchema : authValidationSchemas.otpCodeSchema;
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isValid },
	} = useForm({
		resolver: buildYupResolver(resolverSchema),
		mode: 'onChange',
		defaultValues: {
			code: '',
			newPassword: newPassword || '',
		},
	});
	const codeField = register('code');
	const newPasswordField = register('newPassword');

	useEffect(() => {
		if (open) {
			logOtpCodeModal('Opened', { email });
			reset({
				code: '',
				newPassword: newPassword || '',
			});
		}
	}, [open, email, newPassword, reset]);

	if (!open) return null;

	// Tra du lieu da validate ve component cha de thuc hien verify/reset.
	const handleFormSubmit = (formValues) => {
		const normalizedCode = formValues.code.trim();
		const normalizedNewPassword = formValues.newPassword?.trim() || '';
		logOtpCodeModal('Submit', {
			codeLength: normalizedCode.length,
			email,
			hasNewPassword: showNewPassword,
			newPasswordLength: normalizedNewPassword.length,
		});
		onSubmit(normalizedCode, normalizedNewPassword);
	};

	const canSubmit = isValid;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-[#041627]/70 p-4">
			<div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl md:p-8">
				<div className="mb-6">
					<h3 className="text-2xl font-bold text-[#041627] [font-family:Noto_Serif]">{title}</h3>
					<p className="mt-2 text-sm text-[#44474c]">
						{description || `Nhập mã OTP 6 số đã gửi tới email ${email}.`}
					</p>
				</div>

				{message && <p className="mb-4 rounded-md bg-[#f5f3f4] px-4 py-3 text-sm text-[#44474c]">{message}</p>}

				<form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
					<input
						type="text"
						{...codeField}
						onChange={(event) => {
							const normalizedCode = event.target.value.replace(/\D/g, '').slice(0, 6);
							event.target.value = normalizedCode;
							codeField.onChange(event);
						}}
						inputMode="numeric"
						pattern="[0-9]{6}"
						placeholder="Nhập 6 số OTP"
						className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 text-center text-lg font-semibold tracking-[0.3em] text-[#1b1c1d] focus:border-[#735c00] focus:ring-0"
					/>
					{errors.code?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.code.message}</p>}

					{showNewPassword && (
						<input
							type="password"
							{...newPasswordField}
							onChange={(event) => {
								newPasswordField.onChange(event);
								onNewPasswordChange?.(event.target.value);
							}}
							placeholder={newPasswordPlaceholder}
							className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
						/>
					)}
					{showNewPassword && errors.newPassword?.message && (
						<p className="mt-1 text-xs text-[#ba1a1a]">{errors.newPassword.message}</p>
					)}

					{onResend && (
						<div className="text-right">
							<button
								type="button"
								onClick={onResend}
								disabled={resendLoading}
								className="text-sm font-semibold text-[#735c00] underline decoration-[#735c00]/30 transition-all hover:decoration-[#735c00] disabled:cursor-not-allowed disabled:opacity-70"
							>
								{resendLoading ? 'Đang gửi lại...' : resendLabel}
							</button>
						</div>
					)}

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
							disabled={loading || !canSubmit}
							className="w-1/2 rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-4 py-3 text-sm font-bold text-white transition-all hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{loading ? 'Đang xác thực...' : submitLabel}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default OtpCodeModal;
