import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/dashboard/AdminSidebar";

export default function AdminLayout() {
  return (
    <section className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-12">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
        <AdminSidebar />

        <main className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <Outlet />
        </main>
      </div>
    </section>
  );
}