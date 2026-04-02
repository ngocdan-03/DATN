import { Navigate, Route, Routes } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AuthLayout from '../layouts/AuthLayout';
import AboutPage from '../pages/user/AboutPage';
import Home from '../pages/user/Home';
import Rent from '../pages/user/Rent';
import Sale from '../pages/user/Sale';
import News from '../pages/user/News';
import NewsDetail from '../pages/user/NewsDetail';
import PostDetail from '../pages/user/PostDetail';
import Payment from '../pages/user/Payment';
import PaymentResult from '../pages/user/PaymentResult';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import NotFound from '../pages/NotFound';
import Dashboard from '../pages/admin/Dashboard';
import PostCreate from '../pages/user/PostCreate';
import ProtectedRoute from './ProtectedRoute';

// Khai bao toan bo route hien tai cua ung dung.
const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<UserLayout />}>
				<Route path="/" element={<Navigate to="/home" replace />} />
				<Route element={<AuthLayout />}>
					<Route path="/login" element={<Login />} />
					<Route path="/register" element={<Register />} />
				</Route>
				<Route path="/home" element={<Home />} />
				<Route path="/about" element={<AboutPage />} />
				<Route path="/rent" element={<Rent />} />
				<Route path="/sale" element={<Sale />} />
				<Route path="/news" element={<News />} />
				<Route path="/news/:id" element={<NewsDetail />} />
				<Route path="/posts/:id" element={<PostDetail />} />
				<Route path="/payment/result" element={<PaymentResult />} />
				<Route
					path="/payment"
					element={
						<ProtectedRoute>
							<Payment />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dashboard"
					element={
						<ProtectedRoute>
							<Dashboard />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/dang-tin"
					element={
						<ProtectedRoute>
							<PostCreate />
						</ProtectedRoute>
					}
				/>
			</Route>

			<Route path="*" element={<NotFound />} />
		</Routes>
	);
};

export default AppRoutes;
