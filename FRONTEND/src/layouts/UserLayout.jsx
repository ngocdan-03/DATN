import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

// Layout mac dinh cho khu vuc public/user voi navbar va footer.
const UserLayout = () => {
	return (
		<div className="min-h-screen bg-[#fbf9fa] text-[#1b1c1d]">
			<Navbar />
			<main>
				<Outlet />
			</main>
			<Footer />
		</div>
	);
};

export default UserLayout;
