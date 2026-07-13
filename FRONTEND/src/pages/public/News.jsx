import Grid from "../../components/common/Grid";
import Pagination from "../../components/common/Pagination";
import SearchInput from "../../components/common/SearchInput";
import NewCard from "../../components/user/news/NewCard";
import NewFilter from "../../components/user/news/NewFilter";
import NewHeader from "../../components/user/news/NewHeader";

import { newsService } from "../../services/newsService";

import { useState, useEffect, useCallback, useRef } from "react";


export default function News() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);

  const searchRef = useRef(null);

  const [query, setQuery] = useState({
    keyword: '',
    category: '',
  });

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching news with params:", { ...query, page });
      const response = await newsService.getAllNews({
        keyword: query.keyword,
        category: query.category,
        page,
        size: 6,
      });
      if (response.code === 1000) {
        setItems(response?.result?.data || []);
        setTotalPages(response?.result?.totalPages || 1);
      }
    }catch (error) {
      console.error("Lỗi khi lấy danh sách tin tức:", error);
    }finally {
      setLoading(false);
    }
  }, [query, page]);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  // search
  const handleSearch = (searchKeyword) => {
    setQuery(prev => ({
      ...prev,
      keyword: searchKeyword
    }));
    setPage(1); // reset về trang đầu khi tìm kiếm mới
  };

  // filter
  const handleFilter = (selectedCategory) => {
    const currentSearchVal = searchRef.current?.value || '';
    setQuery({
      keyword: currentSearchVal,
      category: selectedCategory,
    });
    setPage(1); // reset về trang đầu khi lọc mới
  };

  // pagination
  const handlePrev= () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };


	return (
		<main className="mx-auto max-w-[1536px] px-8 py-12">

			{/* Header */}
			<NewHeader />

			{/* Toolbar */}
			<div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
				<SearchInput
        ref={searchRef}
        onSearch={handleSearch} />
				<NewFilter onChange={handleFilter} />
			</div>
        {/* Danh sách bài đăng */}
        <div className="mt-16">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#041627] [font-family:Noto_Serif]">
              Danh sách bài đăng mới nhất
            </h2>
            <p className="text-sm text-gray-500 font-medium">Tìm thấy {items.length} kết quả</p>
          </div>
        </div>
			{/* Grid */}
			<Grid
				items={items}
				loading={loading}
				renderItem={(item) => <NewCard item={item} />}
			/>

			{/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPrev={handlePrev}
        onNext={handleNext}
      />

		</main>
	);
}