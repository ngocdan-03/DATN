import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ allowedRoles = [] }){
    const auth = useAuth();
    const location = useLocation();
    const isLoading = auth?.isLoading ?? false;
    const isAuthenticated = auth?.isAuthenticated ?? false;
    const roles = auth?.user?.roles || [];
    if (isLoading) {
        return <div>Loading...</div>;
    }
    if (!isAuthenticated) {
        console.log("không có isAuthenticated, chuyển hướng về login");
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (allowedRoles.length > 0){
        const hasRole = allowedRoles.some((role) => roles.includes(role));
        if (!hasRole) {
            return <Navigate to="/unauthorized" replace />;
        }
    }
    return <Outlet />;
}