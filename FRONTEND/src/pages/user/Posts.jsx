import { useEffect, useRef, useState, useCallback } from "react";
import HeaderCard from "../../components/user/dashboard/HeaderCard";
import SearchInput from "../../components/common/SearchInput";
import PostsTable from "../../components/user/posts/dashboard/PostsTable";
import PostsFilter from "../../components/user/posts/dashboard/PostsFilter";
import { postsService } from "../../services/postsService";

export default function Posts() {
    const searchRef = useRef();

    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        keyword: "",
        status: "",
    });

    const fetchPosts = useCallback(async () => {
        try {
            setLoading(true);
            console.log("Fetching posts with params:", { ...searchParams, page });

            const res = await postsService.getMyPosts({
                ...searchParams,
                page,
                size: 6,
            });

            setPosts(res.result.data);
            setTotalPages(res.result.totalPages);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [searchParams, page]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    // search
    const handleSearch = (value) => {
        setSearchParams((prev) => ({
            ...prev,
            keyword: value,
        }));
        setPage(1);
    };

    // filter (không mất keyword)
    const handleFilter = (value) => {
        const currentKeyword = searchRef.current?.value || "";

        setSearchParams((prev) => ({
            ...prev,
            keyword: currentKeyword,
            status: value,
        }));

        setPage(1);
    };

    return (
        <div className="space-y-6">
            <HeaderCard title="Quản lý tin" />

            {/* Search + Filter cùng 1 hàng */}
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                
                <div className="w-full md:max-w-md">
                    <SearchInput ref={searchRef} onSearch={handleSearch} />
                </div>

                <div className="w-full md:w-auto">
                    <PostsFilter
                        value={searchParams.status}
                        onChange={handleFilter}
                    />
                </div>

            </div>

            <PostsTable
                data={posts}
                page={page}
                totalPages={totalPages}
                loading={loading}
                onPrev={() => setPage((p) => Math.max(1, p - 1))}
                onNext={() => setPage((p) => Math.min(totalPages, p + 1))}
                onReload={fetchPosts}
                isSavedPage={false}
            />
        </div>
    );
}