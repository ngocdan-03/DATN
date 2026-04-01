import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { registerAuth } from '../../services/authService';
import AppIcon from '../../components/common/AppIcon';
import FormFieldLabel from '../../components/common/FormFieldLabel';
import IconTextButton from '../../components/common/IconTextButton';
import { createLogger } from '../../utils/logger';
import { authValidationSchemas, buildYupResolver } from '../../validation';

const logRegister = createLogger('Register');

// Trang dang ky tai khoan moi.
const Register = () => {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const [message, setMessage] = useState('');
	const [loading, setLoading] = useState(false);
	const {
		register: registerField,
		handleSubmit: handleFormSubmit,
		formState: { errors },
	} = useForm({
		resolver: buildYupResolver(authValidationSchemas.registerSchema),
		defaultValues: {
			fullName: '',
			email: '',
			phone: '',
			password: '',
		},
	});

	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	// Gui thong tin dang ky len backend va dieu huong sang login khi thanh cong.
	const handleRegisterSubmit = async (formValues) => {
		setMessage('');
		setLoading(true);
		logRegister('Submit register form', {
			fullName: formValues.fullName.trim(),
			email: formValues.email.trim(),
			phone: formValues.phone.trim(),
			passwordLength: formValues.password.length,
		});

		try {
			const response = await registerAuth(formValues);
			logRegister('Received register response', {
				code: response.data?.code,
				message: response.data?.message,
			});

			if (response.data?.code === 1000) {
				const normalizedEmail = formValues.email.trim();
				logRegister('Register success, redirect to login and open verify OTP modal', {
					email: normalizedEmail,
				});
				navigate('/login', {
					replace: true,
					state: {
						verifyEmail: normalizedEmail,
						verifyMessage:
							response.data?.message || 'Đăng ký thành công. Vui lòng nhập OTP để xác thực tài khoản.',
					},
				});
				return;
			}

			setMessage(response.data?.message || 'Đăng ký thất bại.');
		} catch (error) {
			logRegister('Register request failed', {
				httpStatus: error.response?.status,
				code: error.response?.data?.code,
				message: error.response?.data?.message || error.message,
			});
			setMessage(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
		} finally {
			setLoading(false);
		}
	};

	return (
		<section>
			<div className="mb-10">
				<span className="mb-4 inline-flex items-center rounded-full bg-[#cca830]/25 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#4f3e00] [font-family:Manrope]">
					<AppIcon name="userAdd" className="mr-2 h-3.5 w-3.5" />
					Khởi tạo thành viên
				</span>
				<h2 className="mb-3 text-4xl font-bold tracking-[-0.01em] text-[#041627] [font-family:Noto_Serif]">RecoLand</h2>
				<p className="font-medium text-[#44474c]">Đăng ký để nhận đề xuất bất động sản phù hợp và cập nhật thị trường.</p>
			</div>

			{message && <p className="mb-4 rounded-md bg-[#ffdad6] px-4 py-3 text-sm text-[#ba1a1a]">{message}</p>}

			<form className="space-y-7" onSubmit={handleFormSubmit(handleRegisterSubmit)}>
				<div className="space-y-5 rounded-xl border border-[#c4c6cd]/40 bg-[#f5f3f4] p-5 md:p-6">
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="col-span-2">
							<FormFieldLabel iconName="user" text="Họ và tên" />
							<input
								type="text"
								{...registerField('fullName')}
								className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
								placeholder="Nguyễn Văn A"
							/>
							{errors.fullName?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.fullName.message}</p>}
						</div>

						<div>
							<FormFieldLabel iconName="mail" text="Email" />
							<input
								type="email"
								{...registerField('email')}
								className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
								placeholder="name@recoland.com"
							/>
							{errors.email?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.email.message}</p>}
						</div>

						<div>
							<FormFieldLabel iconName="call" text="Số điện thoại" />
							<input
								type="tel"
								{...registerField('phone')}
								className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
								placeholder="+84 000 000 000"
							/>
							{errors.phone?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.phone.message}</p>}
						</div>

						<div className="col-span-2">
							<FormFieldLabel iconName="lock" text="Mật khẩu" />
							<input
								type="password"
								{...registerField('password')}
								className="w-full rounded-lg border border-[#c4c6cd]/50 bg-white px-4 py-3 font-medium text-[#1b1c1d] placeholder:text-[#74777d]/55 focus:border-[#735c00] focus:ring-0"
								placeholder="Tối thiểu 8 ký tự"
							/>
							{errors.password?.message && <p className="mt-1 text-xs text-[#ba1a1a]">{errors.password.message}</p>}
						</div>
					</div>
				</div>

				<IconTextButton
					type="submit"
					disabled={loading}
					className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#cca830] to-[#735c00] px-8 py-4 text-sm font-bold uppercase tracking-[0.12em] text-white shadow-xl shadow-[#cca830]/25 transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
					iconName="userAdd"
					iconClassName="h-4 w-4"
				>
					{loading ? 'Đang xử lý...' : 'Đăng ký tài khoản'}
				</IconTextButton>

				<div className="flex items-center justify-center gap-2 pt-1">
					<span className="text-sm text-[#44474c]">Đã có tài khoản?</span>
					<Link to="/login" className="text-sm font-bold text-[#041627] underline decoration-[#735c00]/40 hover:decoration-[#735c00]">
						Đăng nhập
					</Link>
				</div>
			</form>


		</section>
	);
};

export default Register;
