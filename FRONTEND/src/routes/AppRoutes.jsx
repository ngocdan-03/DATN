import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';

import Home from '../pages/public/Home';
import PostsDetail from '../pages/public/PostsDetail';
import News from '../pages/public/News';
import NewsDetail from '../pages/public/NewsDetail';
import About from '../pages/public/About';
import Guide from '../pages/public/Guide';
import TermsOfService from '../pages/public/TermsOfService';
import Chatbot from '../pages/public/Chatbot';

import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';
import SendOtpVerify from '../pages/auth/SendOtpVerify';
import VerifyAccount from '../pages/auth/VerifyAccount';
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';

import UserDashBoard from '../pages/user/DashBoard';
import Posts from '../pages/user/Posts';
import Finance from '../pages/user/Finance';
import Engagement from '../pages/user/Engagement';
import Setting from '../pages/user/Setting';
import Payment from '../pages/user/Payment';
import PaymentResult from '../pages/user/PaymentResult';
import PostCreate from '../pages/user/PostCreate';
import PostEdit from '../pages/user/PostEdit';

import AdminDashBoard from '../pages/admin/DashBoard';
import AdminPosts from '../pages/admin/Posts';
import AdminUsers from '../pages/admin/Users';
import AdminNews from '../pages/admin/News';
import AdminFinance from '../pages/admin/Finance';
import NewsForm from "../pages/admin/NewsForm";

import NotFound from '../pages/NotFound';
import Unauthorized from '../pages/Unauthorized';

import { useAuth } from "../contexts/AuthContext";

function IndexRedirect() {
  const { isAuthenticated, user } = useAuth();
  const roles = user?.roles || [];

  if (isAuthenticated && roles.includes("ADMIN")) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <Home />;
}

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public routes cho main layout */}
                <Route element={<MainLayout />}>
                    <Route index element={<IndexRedirect />} />
                    <Route path="posts/:id" element={<PostsDetail />} />
                    <Route path="news" element={<News />} />
                    <Route path="news/:id" element={<NewsDetail />} />
                    <Route path="about" element={<About />} />
                    <Route path="guide" element={<Guide />} />
                    <Route path="terms-of-service" element={<TermsOfService />} />
                    <Route path="chatbot" element={<Chatbot />} />

                    {/* public routes cho auth layout */}
                    <Route element={<AuthLayout />}>
                        <Route path="login" element={<Login />} />
                        <Route path="register" element={<Register />} />
                        <Route path="send-otp-verify" element={<SendOtpVerify />} />
                        <Route path="verify-account" element={<VerifyAccount />} />
                        <Route path="forgot-password" element={<ForgotPassword />} />
                        <Route path="reset-password" element={<ResetPassword />} />
                    </Route>
                </Route>
                

                {/* protected routes cho user layout và user co role USER */}
                <Route element={<ProtectedRoute allowedRoles={['USER']} />}>
                    <Route element={<MainLayout />}>
                        <Route element={<UserLayout />}>
                            <Route path="user/dashboard" element={<UserDashBoard />} />
                            <Route path="user/posts" element={<Posts />} />
                             <Route path="user/finance" element={<Finance />} />
                             <Route path="user/engagement" element={<Engagement />} />
                             <Route path="user/settings" element={<Setting />} />
                        </Route>
                        <Route path="user/payment" element={<Payment />} />
                        <Route path="user/payment-result" element={<PaymentResult />} />
                        <Route path="user/post-create" element={<PostCreate />} />
                        <Route path="user/post-edit/:postId" element={<PostEdit />} />
                    </Route>
                </Route>

                {/* protected routes cho admin layout và user co role ADMIN */}
                <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
                    <Route element={<AdminLayout />}>
                        <Route path="admin/dashboard" element={<AdminDashBoard />} />
                        <Route path="admin/posts" element={<AdminPosts />} />
                        <Route path="admin/users" element={<AdminUsers />} />
                        <Route path="admin/news" element={<AdminNews />} />
                        <Route path="admin/news/create" element={<NewsForm />} />
                        <Route path="admin/news/:newsId/edit" element={<NewsForm />} />
                        <Route path="admin/finance" element={<AdminFinance />} />
                    </Route>
                </Route>

                {/* route cho trang unauthorized, not found */}
                <Route path="unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}