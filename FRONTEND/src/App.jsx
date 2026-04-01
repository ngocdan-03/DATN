import { useEffect, useState } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AppRoutes from './routes/AppRoutes';
import LoginRequiredModal from './components/common/modals/LoginRequiredModal';
import { markSessionExpiredModalHandled } from './services/api';
import { AUTH_REQUIRED_EVENT, AUTH_SESSION_EXPIRED_EVENT } from './services/authUiEvents';
import './index.css';

const GlobalAuthModalBridge = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('Yêu cầu đăng nhập');
  const [message, setMessage] = useState('Bạn cần đăng nhập để tiếp tục thao tác này.');
  const [confirmLabel, setConfirmLabel] = useState('Đăng nhập');
  const [mode, setMode] = useState('required');
  const [fromPath, setFromPath] = useState('');

  useEffect(() => {
    const handleAuthRequired = (event) => {
      setMode('required');
      setTitle(event.detail?.title || 'Yêu cầu đăng nhập');
      setMessage(event.detail?.message || 'Bạn cần đăng nhập để tiếp tục thao tác này.');
      setConfirmLabel('Đăng nhập');
      setFromPath(event.detail?.from || '');
      setOpen(true);
    };

    const handleSessionExpired = (event) => {
      setMode('expired');
      setTitle(event.detail?.title || 'Phiên đăng nhập đã hết hạn');
      setMessage(event.detail?.message || 'Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại.');
      setConfirmLabel('Đăng nhập lại');
      setFromPath('');
      setOpen(true);
    };

    window.addEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
    window.addEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    return () => {
      window.removeEventListener(AUTH_REQUIRED_EVENT, handleAuthRequired);
      window.removeEventListener(AUTH_SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  const handleClose = () => {
    setOpen(false);
    markSessionExpiredModalHandled();
  };

  const handleConfirm = () => {
    setOpen(false);
    if (mode === 'expired') {
      markSessionExpiredModalHandled();
      logout().finally(() => {
        navigate('/login', { replace: true });
      });
      return;
    }

    navigate('/login', {
      replace: false,
      state: {
        message: 'Vui lòng đăng nhập để tiếp tục.',
        from: fromPath || undefined,
      },
    });
  };

  return (
    <LoginRequiredModal
      open={open}
      title={title}
      message={message}
      onClose={handleClose}
      onConfirm={handleConfirm}
      confirmLabel={confirmLabel}
    />
  );
};

// Root component boc provider auth va router cho toan bo app.
function App() {
  return (
    <AuthProvider>
      <Router>
        <GlobalAuthModalBridge />
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;