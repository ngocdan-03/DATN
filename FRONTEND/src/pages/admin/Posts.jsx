import { useEffect, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import SearchInput from "../../components/common/SearchInput";
import AdminPostsFilter from "../../components/admin/posts/AdminPostsFilter";
import AdminPostsTable from "../../components/admin/posts/AdminPostsTable";
import { adminPostsService } from "../../services/adminPostsService";

export default function AdminPosts() {
  const searchRef = useRef();

  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    status: "",
    wardId: "",
    propertyType: "",
    listingType: "",
  });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminPostsService.getAllPosts({
        ...filters,
        page,
        size: 6,
      });
      setPosts(res.result.data || []);
      setTotalPages(res.result.totalPages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

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
      <HeaderCard title="Quản lý bài đăng" />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <SearchInput ref={searchRef} onSearch={handleSearch} />
        </div>

        <AdminPostsFilter value={filters} onApply={handleApplyFilters} />
      </div>

      <AdminPostsTable
        data={posts}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onReload={fetchPosts}
      />
    </div>
  );
}