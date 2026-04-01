import { Outlet } from 'react-router-dom';

// Layout chung cho cac trang auth (login/register) voi hero background.
const AuthLayout = () => {
	return (
		<section className="relative mx-auto max-w-[1440px] px-6 py-16 text-[#1b1c1d] selection:bg-[#cca830] selection:text-[#4f3e00] md:px-12 md:py-20">
			<div className="absolute inset-0 -z-10 overflow-hidden rounded-3xl bg-[radial-gradient(circle_at_top_right,_rgba(204,168,48,0.2),_rgba(4,22,39,0.05)_40%,_rgba(251,249,250,1)_75%)]"></div>
			<div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
				<div className="hidden lg:block">
					<span className="mb-4 inline-flex items-center rounded-full border border-[#cca830]/45 bg-white/75 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[#735c00]">
						Tuyển tập tinh tuyển
					</span>
					<h2 className="mb-4 text-5xl leading-tight text-[#041627] [font-family:Noto_Serif]">
						Khai mở những không gian
						<br />
						kiến trúc kiệt tác.
					</h2>
					<p className="max-w-xl text-[#44474c] [font-family:Manrope]">
						Đăng nhập hoặc đăng ký để theo dõi tin đăng, nhận đề xuất phù hợp và quản lý giao dịch thuận tiện.
					</p>
				</div>

				<div className="rounded-2xl border border-[#c4c6cd]/40 bg-white/95 p-8 shadow-xl md:p-12">
					<Outlet />
				</div>
			</div>
		</section>
	);
};

export default AuthLayout;
