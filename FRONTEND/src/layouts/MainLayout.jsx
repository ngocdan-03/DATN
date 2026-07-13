import { Outlet } from 'react-router-dom';
import Navbar from '../components/layouts/Navbar';
import Footer from '../components/layouts/Footer';

const MainLayout = () => {
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
export default MainLayout;