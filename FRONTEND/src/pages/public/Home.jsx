import HomeHeader from "../../components/user/home/HomeHeader";
import PostFilter from "../../components/user/home/PostFilter";
import SearchInput from "../../components/common/SearchInput";
import Grid from "../../components/common/Grid";
import Pagination from "../../components/common/Pagination";
import PostCard from "../../components/user/home/PostCard";

import { useState, useEffect, useCallback, useRef } from "react";

import { postsService } from "../../services/postsService";
import { getAreaBoundaries, getPriceBoundaries } from "../../constants/posts";

import MapPanel from "../../components/common/MapPanel";
export default function Home() {
  const [mapOpen, setMapOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [recommendItems, setRecommendItems] = useState([]);
  const [recommendTopView, setRecommendTopView] = useState(false);
  const [recommendLoading, setRecommendLoading] = useState(false);

  const [selectedMapPost, setSelectedMapPost] = useState(null);

  const searchInputRef = useRef();

  const [searchParams, setSearchParams] = useState({
        keyword: '',
        wardId: '',
        propertyType: '',
        listingType: '',
        minPrice: null,
        maxPrice: null,
        minArea: null,
        maxArea: null,
        bedrooms: '',
        bathrooms: ''
    });

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching posts with params:", { ...searchParams, page });
      const response = await postsService.searchPosts({
        ...searchParams,
        page,
        size: 6,
      });
      if (response.code === 1000) {
        setItems(response?.result?.data || []);
        setTotalPages(response?.result?.totalPages || 1);
      }
    }catch (error) {
      console.error("Lỗi khi lấy danh sách bài đăng:", error);
    }finally {
      setLoading(false);
    }
  }, [searchParams, page]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const fetchRecommendations = useCallback(async () => {
    try {
      setRecommendLoading(true);
      const response = await postsService.getPersonalRecommendations();
      if (response.code === 1000) {
        setRecommendItems(response.result?.posts || []);
        setRecommendTopView(Boolean(response.result?.topView));
      }
    } catch (error) {
      console.error("Lỗi khi lấy gợi ý bất động sản:", error);
    } finally {
      setRecommendLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  // hàm search
  const handleSearch = (searchKeyword) => {
    setSearchParams(prev => ({
      ...prev,
      keyword: searchKeyword,
    }));
    setPage(1);
  }
  // hàm khi áp dụng bộ lọc
  const handleApplyFilters = (filters) => {
    const currentKeywordInInput = searchInputRef.current?.value || '';

    const { minPrice, maxPrice } = getPriceBoundaries(filters.priceRange);
    const { minArea, maxArea } = getAreaBoundaries(filters.areaRange);

    setSearchParams({
      keyword: currentKeywordInInput,
      wardId: filters.areaKeyword,
      propertyType: filters.propertyType,
      listingType: filters.listingType,
      legalStatus: filters.legalStatus,
      bedrooms: filters.bedrooms,
      bathrooms: filters.bathrooms,
      minPrice,
      maxPrice,
      minArea,
      maxArea,
    });
    setPage(1);
  };
  return (
    <div className="bg-[#f8f7f8] min-h-screen">
      <HomeHeader />
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        {/* Toolbar: Search & Filter */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput
          ref={searchInputRef}
          onSearch={handleSearch} />
          <PostFilter onApply={handleApplyFilters} />
          <button
            onClick={() => setMapOpen(true)}
            className="rounded-full border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            Xem trên bản đồ
          </button>
			</div>
      {/* Content: list + map */}
      <div className={`grid gap-6 ${mapOpen ? "lg:grid-cols-[minmax(0,1fr)_700px]" : "grid-cols-1"} flex-1`}>
        {/* LEFT: list post */}
        <section className="min-w-0">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#041627] [font-family:Noto_Serif]">
              Danh sách bài đăng mới nhất
            </h2>
            <p className="text-sm font-medium text-gray-500">
              Tìm thấy {items.length} kết quả
            </p>
          </div>

          <div
            className={`grid gap-6 ${
              mapOpen
                ? "grid-cols-1 sm:grid-cols-2"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            {items.map((item) => (
              <PostCard
                item={item}
                onAddressClick={() => setSelectedMapPost(item)}
              />
            ))}
          </div>

          <div className="mt-8">
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              loading={loading}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
            />
          </div>
        </section>

        {/* RIGHT: map panel */}
        {mapOpen && (
          <div className="hidden lg:block min-w-0">
            <div className="sticky top-6 h-[calc(100vh-160px)] rounded-2xl border border-slate-200 bg-white shadow-md">
              <MapPanel open={true} onClose={() => setMapOpen(false)} items={items} />
            </div>
          </div>
        )}
      </div>
        {selectedMapPost && (
          <div className="fixed inset-0 z-50 bg-black/50 p-4">
            <div className="mx-auto h-full max-h-[90vh] max-w-5xl">
              <MapPanel
                open={true}
                onClose={() => setSelectedMapPost(null)}
                items={[selectedMapPost]}
              />
            </div>
          </div>
        )}
      {/* Mobile overlay map */}
      <div className="lg:hidden">
        <MapPanel open={mapOpen} onClose={() => setMapOpen(false)} items={items} />
      </div>
      <section className="mt-12 mb-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-black text-[#041627] [font-family:Noto_Serif]">
              {recommendTopView ? "Bài đăng được xem nhiều nhất" : "Có thể bạn sẽ thích"}
            </h2>
            <p className="text-sm text-gray-500">
              {recommendTopView
                ? "Các bài đăng nổi bật đang được nhiều người quan tâm"
                : "Gợi ý được cá nhân hóa theo tài khoản của bạn"}
            </p>
          </div>
        </div>

        <Grid
          items={recommendItems}
          loading={recommendLoading}
          renderItem={(item) =>               
                <PostCard
                item={item}
                onAddressClick={() => setSelectedMapPost(item)}
                />}
        />
      </section>
      </div>
    </div>
  );
}