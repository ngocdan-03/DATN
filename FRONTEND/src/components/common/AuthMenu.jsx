import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import defaultAvatar from '../../assets/default.png';
import AppIcon from './AppIcon';
import IconTextButton from './IconTextButton';
import { createLogger } from '../../utils/logger';

const logAuthMenu = createLogger('AuthMenu');

// Menu tai khoan o navbar: hien login/register hoac dropdown user.
const AuthMenu = () => {
	const [open, setOpen] = useState(false);
	const menuRef = useRef(null);
	const { isAuthenticated, user, logout } = useAuth();

	useEffect(() => {
		// Dong dropdown khi click ra ngoai menu.
		const handleOutside = (event) => {
			if (menuRef.current && !menuRef.current.contains(event.target)) {
				logAuthMenu('Close dropdown by outside click');
				setOpen(false);
			}
		};

		// Dong dropdown khi nhan phim Escape.
		const handleEscape = (event) => {
			if (event.key === 'Escape') {
				logAuthMenu('Close dropdown by Escape key');
				setOpen(false);
			}
		};

		document.addEventListener('click', handleOutside);
		document.addEventListener('keydown', handleEscape);

		return () => {
			document.removeEventListener('click', handleOutside);
			document.removeEventListener('keydown', handleEscape);
		};
	}, []);

	const displayName = user?.fullName || user?.email || 'Tài khoản';
	const avatarUrl = user?.avatarUrl && user.avatarUrl !== 'default.png' ? user.avatarUrl : defaultAvatar;

	if (!isAuthenticated || !user) {
		logAuthMenu('Render guest menu');
		return (
			<div className="flex items-center gap-3">
				<IconTextButton
					Component={Link}
					to="/login"
					className="inline-flex items-center gap-2 rounded-md border border-[#735c00] px-4 py-2 text-sm font-semibold text-[#735c00] transition-colors hover:bg-[#f5f3f4]"
					iconName="login"
					iconClassName="h-4 w-4"
				>
					Đăng nhập
				</IconTextButton>
				<IconTextButton
					Component={Link}
					to="/register"
					className="inline-flex items-center gap-2 rounded-md bg-[#735c00] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#5f4b00]"
					iconName="userAdd"
					iconClassName="h-4 w-4"
				>
					Đăng ký
				</IconTextButton>
			</div>
		);
	}

	return (
		<div className="relative" ref={menuRef}>
			<button
				id="authmenu-trigger"
				type="button"
				className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-[#f5f3f4]"
				onClick={() => setOpen((prev) => !prev)}
				onClickCapture={() => logAuthMenu('Toggle dropdown', { from: open, to: !open })}
			>
				<span className="text-sm font-semibold text-[#1b1c1d]">{displayName}</span>
				<img
					alt={displayName}
					className="h-10 w-10 rounded-full border-2 border-[#e9e7e9] object-cover"
					src={avatarUrl}
				/>
				<span className="text-[#44474c]">▾</span>
			</button>

			<div
				id="authmenu-dropdown"
				className={`absolute right-0 top-full mt-2 w-52 rounded-lg border border-[#c4c6cd]/40 bg-white p-2 shadow-xl transition-all duration-200 ${
					open
						? 'visible translate-y-0 opacity-100 pointer-events-auto'
						: 'invisible -translate-y-1 opacity-0 pointer-events-none'
				}`}
			>
				<IconTextButton
					Component={Link}
					to="/dashboard"
					className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#1b1c1d] transition-colors hover:bg-[#f5f3f4]"
					iconName="dashboardGrid"
					iconClassName="h-4 w-4 text-[#735c00]"
					onClick={() => setOpen(false)}
				>
					Bảng điều khiển
				</IconTextButton>
				<IconTextButton
					Component={Link}
					to="/dang-tin"
					className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-[#1b1c1d] transition-colors hover:bg-[#f5f3f4]"
					iconName="plus"
					iconClassName="h-4 w-4 text-[#735c00]"
					onClick={() => setOpen(false)}
				>
					Đăng tin
				</IconTextButton>
				<IconTextButton
					className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-[#ba1a1a] transition-colors hover:bg-[#ffdad6]"
					iconName="logout"
					iconClassName="h-4 w-4"
					onClick={async () => {
						logAuthMenu('Logout clicked');
						await logout();
						logAuthMenu('Logout completed, close dropdown');
						setOpen(false);
					}}
				>
					Đăng xuất
				</IconTextButton>
			</div>
		</div>
	);
};

export default AuthMenu;
