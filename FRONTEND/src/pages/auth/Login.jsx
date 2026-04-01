import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import OtpEmailModal from '../../components/common/modals/OtpEmailModal';
import OtpCodeModal from '../../components/common/modals/OtpCodeModal';
import AppIcon from '../../components/common/AppIcon';
import FormFieldLabel from '../../components/common/FormFieldLabel';
import IconTextButton from '../../components/common/IconTextButton';
import {
	forgotPasswordAuth,
	loginAuth,
	resendOtpAuth,
	resetPasswordAuth,
	sendOtpVerifyAuth,
	verifyAccountAuth,
} from '../../services/authService';
import { createLogger } from '../../utils/logger';
import { authValidationSchemas, buildYupResolver } from '../../validation';

const logLogin = createLogger('Login');

// Trang dang nhap, kem theo flow xac thuc email va quen mat khau bang OTP.
const Login = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { isAuthenticated, login } = useAuth();
	const {
		register: registerField,
		handleSubmit: handleFormSubmit,
		watch,
		getValues,
		formState: { errors },
	} = useForm({
		resolver: buildYupResolver(authValidationSchemas.loginSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	});
	const currentEmail = watch('email') || '';
	const [message, setMessage] = useState(location.state?.message || '');
	const [loading, setLoading] = useState(false);
	const [showEmailModal, setShowEmailModal] = useState(false);
	const [showOtpModal, setShowOtpModal] = useState(false);
	const [pendingVerifyEmail, setPendingVerifyEmail] = useState('');
	const [resendMessage, setResendMessage] = useState('');
	const [otpMessage, setOtpMessage] = useState('');
	const [sendingOtp, setSendingOtp] = useState(false);
	const [verifyingOtp, setVerifyingOtp] = useState(false);
	const [resendingVerifyOtp, setResendingVerifyOtp] = useState(false);
	const [showForgotEmailModal, setShowForgotEmailModal] = useState(false);
	const [showForgotOtpModal, setShowForgotOtpModal] = useState(false);
	const [forgotEmail, setForgotEmail] = useState('');
	const [forgotNewPassword, setForgotNewPassword] = useState('');
	const [forgotMessage, setForgotMessage] = useState('');
	const [forgotOtpMessage, setForgotOtpMessage] = useState('');
	const [sendingForgotOtp, setSendingForgotOtp] = useState(false);
	const [resendingForgotOtp, setResendingForgotOtp] = useState(false);
	const [submittingForgotReset, setSubmittingForgotReset] = useState(false);

	useEffect(() => {
		const autoVerifyEmail = location.state?.verifyEmail?.trim();
		if (!autoVerifyEmail) return;

		logLogin('Auto-open verify OTP modal from register success', { email: autoVerifyEmail });
		setPendingVerifyEmail(autoVerifyEmail);
		setOtpMessage(
			location.state?.verifyMessage || 'Đăng ký thành công. Vui lòng nhập OTP để xác thực tài khoản.',
		);
		setShowOtpModal(true);
		setShowEmailModal(false);

		navigate(location.pathname, {
			replace: true,
			state: {
				message: location.state?.message || '',
			},
		});
	}, [location.pathname, location.state, navigate]);

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	// Xu ly submit dang nhap va phan nhanh sang flow verify neu backend tra ve code 1012.
	const handleLoginSubmit = async (formValues) => {
		setMessage('');
		setLoading(true);
		logLogin('Submit login form', { email: formValues.email.trim() });

		try {
			const response = await loginAuth(formValues);
			logLogin('Received login response', {
				code: response.data?.code,
				authenticated: response.data?.result?.authenticated,
			});

			if (response.data?.code === 1000 && response.data?.result?.authenticated) {
				login(response.data.result);
				logLogin('Login success, redirect to home');
				navigate('/', { replace: true });
				return;
			}

			if (response.data?.code === 1012) {
				const normalizedEmail = formValues.email.trim();
				logLogin('Login blocked by unverified account, opening verify email modal', {
					email: normalizedEmail,
				});
				setPendingVerifyEmail(normalizedEmail);
				setResendMessage(response.data?.message || 'Tài khoản chưa được xác thực email.');
				setShowEmailModal(true);
				return;
			}

			setMessage(response.data?.message || 'Đăng nhập thất bại.');
		} catch (error) {
			logLogin('Login request failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			if (error.response?.data?.code === 1012) {
				const normalizedEmail = formValues.email.trim();
				logLogin('Open verify email modal from login error branch', { email: normalizedEmail });
				setPendingVerifyEmail(normalizedEmail);
				setResendMessage(error.response?.data?.message || 'Tài khoản chưa được xác thực email.');
				setShowEmailModal(true);
			} else {
				setMessage(error.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
			}
		} finally {
			setLoading(false);
		}
	};

	// Gui yeu cau send-otp-verify cho tai khoan chua xac thuc email.
	const handleResendOtp = async (inputEmail) => {
		setSendingOtp(true);
		setResendMessage('');
		logLogin('Request send-otp-verify', { email: inputEmail.trim() });

		try {
			const normalizedEmail = inputEmail.trim();
			const response = await sendOtpVerifyAuth({ email: normalizedEmail });
			logLogin('send-otp-verify response', { code: response.data?.code, message: response.data?.message });

			if (response.data?.code && response.data.code !== 1000) {
				setResendMessage(response.data?.message || 'Gửi OTP thất bại.');
				return;
			}

			setPendingVerifyEmail(normalizedEmail);
			setShowEmailModal(false);
			setOtpMessage(response.data?.message || 'Mã OTP đã được gửi. Vui lòng nhập mã để xác thực tài khoản.');
			setShowOtpModal(true);
			logLogin('Opened OTP modal for account verification', { email: normalizedEmail });
		} catch (error) {
			logLogin('send-otp-verify failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setResendMessage(error.response?.data?.message || 'Gửi OTP thất bại. Vui lòng thử lại.');
		} finally {
			setSendingOtp(false);
		}
	};

	// Gui lai OTP verify tu code modal thong qua endpoint resend-otp.
	const handleResendVerifyOtpFromCodeModal = async () => {
		setResendingVerifyOtp(true);
		setOtpMessage('');
		logLogin('Request resend-otp for verify flow', { email: pendingVerifyEmail });

		try {
			const response = await resendOtpAuth({ email: pendingVerifyEmail, purpose: 'verify' });
			logLogin('resend-otp verify response', { code: response.data?.code, message: response.data?.message });

			if (response.data?.code && response.data.code !== 1000) {
				setOtpMessage(response.data?.message || 'Gửi lại OTP thất bại.');
				return;
			}

			setOtpMessage(response.data?.message || 'Mã OTP mới đã được gửi.');
		} catch (error) {
			logLogin('resend-otp verify failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setOtpMessage(error.response?.data?.message || 'Gửi lại OTP thất bại.');
		} finally {
			setResendingVerifyOtp(false);
		}
	};

	// Xac thuc ma OTP va dua nguoi dung ve trang dang nhap neu thanh cong.
	const handleVerifyOtp = async (code) => {
		setVerifyingOtp(true);
		setOtpMessage('');
		logLogin('Submit verify-account OTP', { email: pendingVerifyEmail, codeLength: code.trim().length });

		try {
			const response = await verifyAccountAuth({ email: pendingVerifyEmail, code });
			logLogin('verify-account response', { code: response.data?.code, message: response.data?.message });

			if (response.data?.code === 1000) {
				setShowOtpModal(false);
				navigate('/login', {
					replace: true,
					state: {
						message: 'Tài khoản đã được xác thực. Vui lòng đăng nhập lại.',
					},
				});
				return;
			}

			setOtpMessage(response.data?.message || 'Xác thực OTP thất bại.');
		} catch (error) {
			logLogin('verify-account failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setOtpMessage(error.response?.data?.message || 'Xác thực OTP thất bại. Vui lòng thử lại.');
		} finally {
			setVerifyingOtp(false);
		}
	};

	// Khoi dong flow quen mat khau: gui OTP reset ve email.
	const handleForgotEmailSubmit = async (inputEmail) => {
		setSendingForgotOtp(true);
		setForgotMessage('');
		logLogin('Start forgot-password flow', { email: inputEmail.trim() });

		try {
			const normalizedEmail = inputEmail.trim();
			const response = await forgotPasswordAuth({ email: normalizedEmail });
			logLogin('forgot-password response', { code: response.data?.code, message: response.data?.message });

			if (response.data?.code && response.data.code !== 1000) {
				setForgotMessage(response.data?.message || 'Không thể gửi OTP đặt lại mật khẩu.');
				return;
			}

			setForgotEmail(normalizedEmail);
			setShowForgotEmailModal(false);
			setForgotOtpMessage(response.data?.message || 'Mã OTP đã được gửi. Vui lòng nhập mã xác thực.');
			setShowForgotOtpModal(true);
			logLogin('Opened forgot OTP modal', { email: normalizedEmail });
		} catch (error) {
			logLogin('forgot-password failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setForgotMessage(error.response?.data?.message || 'Không thể gửi OTP đặt lại mật khẩu.');
		} finally {
			setSendingForgotOtp(false);
		}
	};

	// Submit OTP + mat khau moi ngay trong cung modal cho flow quen mat khau.
	const handleForgotOtpSubmit = async (code, newPassword) => {
		const normalizedCode = code.trim();
		const normalizedNewPassword = newPassword.trim();

		setSubmittingForgotReset(true);
		setForgotOtpMessage('');
		setForgotNewPassword(normalizedNewPassword);

		logLogin('Submit forgot flow with OTP + new password', {
			email: forgotEmail,
			codeLength: normalizedCode.length,
			newPasswordLength: normalizedNewPassword.length,
		});

		try {
			const response = await resetPasswordAuth({
				email: forgotEmail,
				code: normalizedCode,
				newPassword: normalizedNewPassword,
			});

			logLogin('forgot flow reset-password response', {
				code: response.data?.code,
				message: response.data?.message,
			});

			if (response.data?.code === 1000) {
				setShowForgotOtpModal(false);
				setForgotNewPassword('');
				navigate('/login', {
					replace: true,
					state: {
						message: response.data?.message || 'Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.',
					},
				});
				return;
			}

			setForgotOtpMessage(response.data?.message || 'Đặt lại mật khẩu thất bại.');
		} catch (error) {
			logLogin('forgot flow reset-password failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setForgotOtpMessage(error.response?.data?.message || 'Đặt lại mật khẩu thất bại.');
		} finally {
			setSubmittingForgotReset(false);
		}
	};

	// Gui lai OTP cho flow quen mat khau voi purpose=forgot.
	const handleResendForgotOtpFromCodeModal = async () => {
		setResendingForgotOtp(true);
		setForgotOtpMessage('');
		logLogin('Request resend-otp for forgot flow', { email: forgotEmail });

		try {
			const response = await resendOtpAuth({ email: forgotEmail, purpose: 'forgot' });
			logLogin('resend-otp forgot response', { code: response.data?.code, message: response.data?.message });

			if (response.data?.code && response.data.code !== 1000) {
				setForgotOtpMessage(response.data?.message || 'Gửi lại OTP thất bại.');
				return;
			}

			setForgotOtpMessage(response.data?.message || 'Mã OTP mới đã được gửi.');
		} catch (error) {
			logLogin('resend-otp forgot failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setForgotOtpMessage(error.response?.data?.message || 'Gửi lại OTP thất bại.');
		} finally {
			setResendingForgotOtp(false);
		}
	};

	return (
		<section>
			<div className="mb-10">
				<span className="mb-4 inline-flex items-center rounded-full bg-[#cca830]/25 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f3e00] [font-family:Manrope]">
					<AppIcon name="plus" className="mr-2 h-3.5 w-3.5" />
					Chào mừng trở lại
				</span>
				<h2 className="mb-3 text-4xl font-bold tracking-[-0.01em] text-[#041627] [font-family:Noto_Serif]">Đăng nhập</h2>
				<p className="font-medium text-[#44474c]">Truy cập tài khoản để theo dõi tin đăng và trạng thái giao dịch.</p>
			</div>

			{message && <p className="mb-4 rounded-md bg-[#ffdad6] px-4 py-3 text-sm text-[#ba1a1a]">{message}</p>}

			<form className="space-y-6" onSubmit={handleFormSubmit(handleLoginSubmit)}>
				<div className="space-y-4 rounded-xl border border-[#c4c6cd]/40 bg-[#f5f3f4] p-5 md:p-6">
					<div className="group">
						<FormFieldLabel iconName="mail" text="Email" />
						<input
							type="email"
							{...registerField('email')}
							placeholder="name@recoland.com"
							className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
						/>
						{errors.email?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.email.message}</p>}
					</div>

					<div className="group">
						<FormFieldLabel iconName="lock" text="Mật khẩu" />
						<input
							type="password"
							{...registerField('password')}
							placeholder="Nhập mật khẩu"
							className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
						/>
						{errors.password?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.password.message}</p>}
						<div className="pt-2 text-right">
							<IconTextButton
								onClick={() => {
									setForgotEmail((getValues('email') || '').trim());
									setForgotMessage('');
									setShowForgotEmailModal(true);
								}}
								className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#735c00] underline decoration-[#735c00]/30 transition-all hover:decoration-[#735c00]"
								iconName="helpCircle"
								iconClassName="h-4 w-4"
							>
								Quên mật khẩu?
							</IconTextButton>
						</div>
					</div>
				</div>
				<IconTextButton
					type="submit"
					disabled={loading}
					className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-xl shadow-[#cca830]/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
					iconName="login"
					iconClassName="h-4 w-4"
				>
					{loading ? 'Đang xử lý...' : 'Đăng nhập'}
				</IconTextButton>

				<div className="flex items-center justify-center gap-2 pt-1">
					<span className="text-sm text-[#44474c]">Chưa có tài khoản?</span>
					<Link to="/register" className="text-sm font-bold text-[#041627] underline decoration-[#735c00]/40 hover:decoration-[#735c00]">
						Đăng ký
					</Link>
				</div>
			</form>

			{showEmailModal && (
				<OtpEmailModal
					open={showEmailModal}
					initialEmail={pendingVerifyEmail || currentEmail}
					purpose="verify"
					loading={sendingOtp}
					message={resendMessage}
					onClose={() => {
						setShowEmailModal(false);
						setResendMessage('');
					}}
					onSubmit={handleResendOtp}
				/>
			)}

			{showOtpModal && (
				<OtpCodeModal
					open={showOtpModal}
					email={pendingVerifyEmail}
					loading={verifyingOtp}
					resendLoading={resendingVerifyOtp}
					message={otpMessage}
					onResend={handleResendVerifyOtpFromCodeModal}
					resendLabel="Gửi lại OTP"
					onClose={() => {
						setShowOtpModal(false);
						setOtpMessage('');
					}}
					onSubmit={handleVerifyOtp}
				/>
			)}

			{showForgotEmailModal && (
				<OtpEmailModal
					open={showForgotEmailModal}
					initialEmail={forgotEmail || currentEmail}
					purpose="forgot"
					loading={sendingForgotOtp}
					message={forgotMessage}
					onClose={() => {
						setShowForgotEmailModal(false);
						setForgotMessage('');
					}}
					onSubmit={handleForgotEmailSubmit}
				/>
			)}

			{showForgotOtpModal && (
				<OtpCodeModal
					open={showForgotOtpModal}
					email={forgotEmail}
					loading={submittingForgotReset}
					resendLoading={resendingForgotOtp}
					message={forgotOtpMessage}
					title="Nhập mã xác thực"
					description={`Nhập mã OTP đã gửi tới email ${forgotEmail} và đặt mật khẩu mới.`}
					submitLabel="Đặt lại mật khẩu"
					showNewPassword
					newPassword={forgotNewPassword}
					onNewPasswordChange={setForgotNewPassword}
					onResend={handleResendForgotOtpFromCodeModal}
					resendLabel="Gửi lại OTP"
					onClose={() => {
						setShowForgotOtpModal(false);
						setForgotOtpMessage('');
						setForgotNewPassword('');
					}}
					onSubmit={handleForgotOtpSubmit}
				/>
			)}
		</section>
	);
};

export default Login;
