import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Bao ve route yeu cau dang nhap; guest se duoc dieu huong den trang login.
const ProtectedRoute = ({ children }) => {
	const location = useLocation();
	const { isAuthenticated } = useAuth();

	if (!isAuthenticated) {
		return <Navigate to="/login" replace state={{ from: location.pathname }} />;
	}

	return children;
};

export default ProtectedRoute;
