import { useEffect, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import SearchInput from "../../components/common/SearchInput";
import AdminNewsFilter from "../../components/admin/news/AdminNewsFilter";
import AdminNewsTable from "../../components/admin/news/AdminNewsTable";
import { adminNewsService } from "../../services/adminNewsService";
import { useNavigate } from "react-router-dom";

export default function AdminNews() {
  const searchRef = useRef();
  const navigate = useNavigate();
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    keyword: "",
    category: "",
    status: "",
  });

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const res = await adminNewsService.getAllNews({
        ...filters,
        page,
        size: 6,
      });
      setNews(res.result.data || []);
      setTotalPages(res.result.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

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
      <HeaderCard title="Quản lý tin tức" />

      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="w-full md:max-w-md">
          <SearchInput ref={searchRef} onSearch={handleSearch} />
        </div>

        <div className="flex items-center gap-3">
          <AdminNewsFilter value={filters} onApply={handleApplyFilters} />
          <button
            onClick={() => navigate("/admin/news/create")}
            className="h-11 rounded-xl bg-[#041627] px-4 text-sm font-bold text-white hover:bg-[#0a2a47]"
          >
            Thêm tin tức
          </button>
        </div>
      </div>

      <AdminNewsTable
        data={news}
        page={page}
        totalPages={totalPages}
        loading={loading}
        onPrev={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
        onReload={fetchNews}
      />
    </div>
  );
}