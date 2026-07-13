import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function AuthMenu() {
  const { isAuthenticated, user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
            setOpen(false);
            }
        };

        const handleEsc = (event) => {
            if (event.key === "Escape") {
            setOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, []);


  // nếu local storage ko có thông tin người dùng return giao diện nút đăng nhập đăng ký
  if (!isAuthenticated || !user) {
  return (
    <div className="flex items-center gap-3">
      <Link
        to="/login"
        state={{ from: location }}
        className="rounded-md border border-yellow-700 px-3 py-2 text-sm font-semibold text-yellow-800 hover:bg-yellow-50"
      >
        Đăng nhập
      </Link>
      <Link
        to="/register"
        className="rounded-md bg-yellow-700 px-3 py-2 text-sm font-semibold text-white hover:bg-yellow-800"
      >
        Đăng ký
      </Link>
    </div>
  );
}

// nếu có thông tin người dùng, return giao diện avatar và menu dropdown

  // tạo dữ liệu user
  const displayName = user.fullName;
  const avatar = user.avatarUrl;
  const roles = user.roles;
  const isAdmin = roles.includes("ADMIN");

return (
  <div className="relative" ref={menuRef}>
    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100"
    >
      <img
        src={avatar}
        alt={displayName}
        className="h-14 w-14 rounded-full border-2 object-cover"
        onError={(e) => {
          e.currentTarget.src = "https://placehold.co/40x40";
        }}
      />
      <span className="text-sm font-semibold text-slate-800">{displayName}</span>
      <svg
        className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true">
        <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"/>
      </svg>
    </button>

    {open && (
      <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border bg-white p-2 shadow-lg">
        <Link
          to={isAdmin ? "/admin/dashboard" : "/user/dashboard"}
          onClick={() => setOpen(false)}
          className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
        >
          Bảng điều khiển
        </Link>

        {!isAdmin && (
          <>
            <Link
              to="/user/payment"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
            >
              Nạp tiền
            </Link>
            <Link
              to="/user/post-create"
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
            >
              Đăng tin
            </Link>
          </>
        )}

        <button
          type="button"
          className="mt-1 block w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          onClick={async () => {
            await logout();
            setOpen(false);
            navigate("/", { replace: true });
          }}
        >
          Đăng xuất
        </button>
      </div>
    )}
  </div>
);

}