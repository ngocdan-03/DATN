import { NavLink } from 'react-router-dom';
import AuthMenu from '../common/AuthMenu';
import AppIcon from '../common/AppIcon';

const navItems = [
	{
		label: 'Trang chủ',
		to: '/home',
		iconName: 'homeWork',
	},
	{
		label: 'Giới thiệu',
		to: '/about',
		iconName: 'infoCircle',
	},
	{
		label: 'Thuê',
		to: '/rent',
		iconName: 'rentHouse',
	},
	{
		label: 'Mua',
		to: '/sale',
		iconName: 'saleHouse',
	},
	{
		label: 'Tin tức',
		to: '/news',
		iconName: 'newsDoc',
	},
];

// Thanh dieu huong chinh cua website.
const Navbar = () => {
	return (
		<nav className="sticky top-0 left-0 z-50 w-full border-none bg-[#fbf9fa] shadow-[0_40px_40px_-15px_rgba(4,22,39,0.06)]">
			<div className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12 md:py-6">
				<div className="cursor-pointer text-2xl font-bold text-[#041627] [font-family:Noto_Serif]">RecoLand</div>

				<div className="hidden items-center gap-8 font-medium tracking-tight [font-family:Noto_Serif] md:flex">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								isActive
									? 'border-b-2 border-[#735c00] pb-1 text-[#735c00]'
									: 'text-[#1b1c1d] opacity-80 transition-colors duration-300 hover:text-[#735c00]'
							}
						>
							<span className="flex items-center gap-2">
								<AppIcon name={item.iconName} className="h-4 w-4" strokeWidth={1.9} />
								{item.label}
							</span>
						</NavLink>
					))}
				</div>

				<AuthMenu />
			</div>
		</nav>
	);
};

export default Navbar;
