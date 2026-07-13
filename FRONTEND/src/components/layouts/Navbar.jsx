import { NavLink } from "react-router-dom";
import AuthMenu from "../common/AuthMenu";
import { IMAGES, NAV_ITEMS } from "../../constants/system";

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-[#fbf9fa] shadow-[0_20px_30px_-20px_rgba(4,22,39,0.2)]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <NavLink to="/" className="inline-flex items-center">
            <img
                src={IMAGES.LOGO}
                alt="RecoLand Logo"
                className="h-30 w-auto object-contain"
            />
        </NavLink>

        <div className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive
                  ? "border-b-2 border-[#735c00] pb-1 font-semibold text-[#735c00]"
                  : "text-[#1b1c1d] opacity-80 transition-colors hover:text-[#735c00]"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <AuthMenu />
      </div>
    </nav>
  );
}