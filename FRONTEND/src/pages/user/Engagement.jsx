import React, { useEffect, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import SearchInput from "../../components/common/SearchInput";
import PostsTable from "../../components/user/posts/dashboard/PostsTable";
import { postsService } from "../../services/postsService";

export default function Engagement() {
    const searchRef = useRef();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        keyword: "",
    });

    const fetchSavedPosts = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Fetching saved posts with params:", { ...searchParams, page });

            const res = await postsService.getSavedPosts({
                ...searchParams,
                page,
                size: 5, // Số lượng tin mỗi trang
            });

            if (res.code === 1000) {
                setPosts(res.result.data);
                setTotalPages(res.result.totalPages);
            }
        } catch (err) {
            console.error("Lỗi fetch tin đã lưu:", err);
        } finally {
            setLoading(false);
        }
    }, [searchParams, page]);

    useEffect(() => {
        fetchSavedPosts();
    }, [fetchSavedPosts]);

    const handleSearch = (value) => {
        setSearchParams({
            keyword: value,
        });
        setPage(1); // Reset về trang 1 khi tìm kiếm
    };

    return (
        <div className="space-y-6 pb-10">
            <HeaderCard title="Tương tác và cá nhân hóa" />

            {/* Chỉ có SearchInput, dàn hàng ngang hoặc theo layout Dashboard */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="w-full md:max-w-md">
                    <SearchInput 
                        ref={searchRef} 
                        onSearch={handleSearch} 
                        placeholder="Tìm tiêu đề tin đã lưu..."
                    />
                </div>
                
                <div className="text-xs text-slate-400 font-medium italic">
                    Danh sách các tin đăng bạn đã lưu lại
                </div>
            </div>

            <PostsTable
                data={posts}
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onReload={fetchSavedPosts}
                isSavedPage={true}
            />
        </div>
    );
}