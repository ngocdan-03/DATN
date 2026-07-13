import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { IMAGES } from "../../../constants/system";

export default function AdminAccountMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
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

  const displayName = user?.fullName || "Admin";
  const avatar = user?.avatarUrl || IMAGES.DEFAULT_AVATAR;

  return (
    <div className="relative mb-5" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 hover:bg-slate-100"
      >
        <img
          src={avatar}
          alt={displayName}
          className="h-10 w-10 rounded-full border object-cover"
          onError={(e) => {
            e.currentTarget.src = IMAGES.DEFAULT_AVATAR;
          }}
        />
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-semibold text-slate-800">{displayName}</p>
          <p className="text-xs text-slate-500">Quản trị viên</p>
        </div>
        <svg
          className={`h-4 w-4 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-52 rounded-lg border bg-white p-2 shadow-lg">
          <NavLink
            to="/admin/dashboard"
            onClick={() => setOpen(false)}
            className="block rounded-md px-3 py-2 text-sm hover:bg-slate-100"
          >
            Bảng điều khiển
          </NavLink>
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