import { useEffect, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import SearchInput from "../../components/common/SearchInput";
import AdminUsersFilter from "../../components/admin/users/AdminUsersFilter";
import AdminUsersTable from "../../components/admin/users/AdminUsersTable";
import { adminUsersService } from "../../services/adminUsersService";

export default function AdminUsers() {
  const searchRef = useRef();

  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    isVerified: "",
    isLocked: "",
  });

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminUsersService.getUsers({
        ...filters,
        page,
        size: 6,
      });
      setUsers(res.result.data || []);
      setTotalPages(res.result.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (value) => {
    setFilters((prev) => ({ ...prev, keyword: value }));
    setPage(1);
  };

  const handleApplyFilters = (nextFilters) => {
    const currentKeyword = searchRef.current?.value || "";
    setFilters((prev) => ({
      ...prev,
      keyword: currentKeyword,
      ...nextFilters,
    }));
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <HeaderCard title="Quản lý người dùng" />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <SearchInput ref={searchRef} onSearch={handleSearch} />
        </div>

        <AdminUsersFilter value={filters} onApply={handleApplyFilters} />
      </div>

      <AdminUsersTable
        data={users}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onReload={fetchUsers}
      />
    </div>
  );
}