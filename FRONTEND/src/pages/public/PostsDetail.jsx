import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { postsService } from "../../services/postsService";
import PostImageGallery from "../../components/user/posts/detail/PostImageGallery";
import PostContent from "../../components/user/posts/detail/PostContent";
import PostSidebar from "../../components/user/posts/detail/PostSidebar";
import BackButton from "../../components/common/BackButton";
import Grid from "../../components/common/Grid";
import PostCard from "../../components/user/home/PostCard";
import MapPanel from "../../components/common/MapPanel";

export default function PostDetail() {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [similarPosts, setSimilarPosts] = useState([]);
    const [similarLoading, setSimilarLoading] = useState(false);
    const [selectedMapPost, setSelectedMapPost] = useState(null);

    const fetchDetail = useCallback(async () => {
        try {
            setLoading(true);
            const response = await postsService.getPostDetail(id);
            if (response.code === 1000) setPost(response.result);
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết bài đăng:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    const fetchSimilarPosts = useCallback(async () => {
        try {
            setSimilarLoading(true);
            const response = await postsService.getSimilarRecommendations(id);
            if (response.code === 1000) {
                setSimilarPosts(response.result?.posts || []);
            }
        } catch (error) {
            console.error("Lỗi khi lấy bài đăng tương tự:", error);
        } finally {
            setSimilarLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetail();
        fetchSimilarPosts();
        window.scrollTo(0, 0);
    }, [fetchDetail, fetchSimilarPosts]);

    if (loading) return <div className="py-20 text-center font-black text-[#041627] animate-pulse">Đang tải dữ liệu...</div>;
    if (!post) return <div className="py-20 text-center text-gray-500">Không tìm thấy bài đăng!</div>;

    return (
        <main className="min-h-screen bg-[#f8f7f8] pb-20 pt-6">
            <div className="mx-auto max-w-7xl px-6 md:px-10">
                
                <div className="mb-6">
                    <BackButton />
                </div>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                    
                    <div className="space-y-8 lg:col-span-8">
                        <PostImageGallery images={post.imageUrls} />
                        <PostContent post={post} onAddressClick={() => setSelectedMapPost(post)} />
                    </div>

                    <div className="lg:col-span-4">
                        <div className="sticky top-10">
                            <PostSidebar owner={post.owner} favorite={post.favorite} postId={post.id} />
                        </div>
                    </div>
                </div>

                {similarPosts.length > 0 && (
                    <section className="mt-14">
                        <div className="mb-6">
                            <h2 className="text-2xl font-black text-[#041627] [font-family:Noto_Serif]">
                                Có thể bạn sẽ thích
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                Các bài đăng tương tự với bất động sản này
                            </p>
                        </div>

                        <Grid
                            items={similarPosts}
                            loading={similarLoading}
                            renderItem={(item) => (
                                <PostCard
                                    item={item}
                                    onAddressClick={() => setSelectedMapPost(item)}
                                />
                            )}
                        />
                    </section>
                )}

                {selectedMapPost && (
                    <div className="fixed inset-0 z-50 bg-black/50 p-4 flex items-center justify-center">
                        <div className="mx-auto h-full max-h-[90vh] w-full max-w-5xl">
                            <MapPanel
                                open={true}
                                onClose={() => setSelectedMapPost(null)}
                                items={[selectedMapPost]}
                            />
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}