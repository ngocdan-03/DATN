import { NavLink } from "react-router-dom";
import { USER_SIDEBAR_ITEMS } from "../../../constants/system";

export default function UserSidebar() {
  return (
    <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-24">
      <h2 className="mb-4 text-lg font-bold text-[#041627]">Khu vực người dùng</h2>

      <nav className="space-y-2">
        {USER_SIDEBAR_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              "block rounded-xl px-4 py-3 text-sm font-semibold transition " +
              (isActive
                ? "bg-[#005baa] text-white"
                : "text-slate-700 hover:bg-slate-100")
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}