import { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { postValidationSchemas } from "../../validation";
import { postsService } from "../../services/postsService";

import CreatePostHeader from "../../components/user/posts/create/CreatePostHeader";
import PostCreateBasicInfoSection from "../../components/user/posts/create/PostCreateBasicInfoSection";
import PostCreateLocationSection from "../../components/user/posts/create/PostCreateLocationSection";
import PostCreateMediaSection from "../../components/user/posts/create/PostCreateMediaSection";
import PostCreatePricingAreaSection from "../../components/user/posts/create/PostCreatePricingAreaSection";
import PostCreateSubmitBar from "../../components/user/posts/create/PostCreateSubmitBar";
import AppModal from "../../components/modals/AppModal";

export default function PostCreate() {
    const methods = useForm({
        resolver: yupResolver(postValidationSchemas.createPostSchema),
        defaultValues: {
            propertyType: "HOUSE",
            listingType: "SALE",
            legalStatus: "SO_DO",
            imageUrls: [],
            thumbnailUrl: null,
            latitude: "",
            longitude: "",
        },
    });

    const { handleSubmit, reset } = methods;
    const [resetKey, setResetKey] = useState(0);
    const [modal, setModal] = useState({ open: false, type: "info", title: "", message: "" });
    const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const normalizedLatitude = data.latitude === "" || data.latitude == null ? null : Number(data.latitude);
            const normalizedLongitude = data.longitude === "" || data.longitude == null ? null : Number(data.longitude);

            const postDataObj = {
                title: data.title,
                description: data.description,
                propertyType: data.propertyType,
                listingType: data.listingType,
                legalStatus: data.legalStatus,
                price: Number(data.price),
                area: Number(data.area),
                bedrooms: data.bedrooms ? Number(data.bedrooms) : null,
                bathrooms: data.bathrooms ? Number(data.bathrooms) : null,
                wardId: Number(data.wardId),
                streetAddress: data.streetAddress,
                latitude: Number.isNaN(normalizedLatitude) ? null : normalizedLatitude,
                longitude: Number.isNaN(normalizedLongitude) ? null : normalizedLongitude,
            };

            formData.append("data", new Blob([JSON.stringify(postDataObj)], { type: "application/json" }));
            formData.append("thumbnail", data.thumbnailUrl);
            data.imageUrls.forEach((file) => formData.append("images", file));

            const res = await postsService.createPost(formData);

            setModal({
                open: true,
                type: "success",
                title: "Thành công!",
                message: res.message || "Tin của bạn đã được đăng và đang chờ duyệt.",
            });

            reset();
            setResetKey((prev) => prev + 1);
        } catch (error) {
            setModal({
                open: true,
                type: "error",
                title: "Đăng tin thất bại",
                message: error.message || "Có lỗi xảy ra, vui lòng thử lại sau.",
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="mx-auto max-w-4xl px-4 md:px-0">
                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
                        <CreatePostHeader />
                        <PostCreateMediaSection key={`media-section-${resetKey}`} />
                        <PostCreateBasicInfoSection />
                        <PostCreatePricingAreaSection />
                        <PostCreateLocationSection />
                        <PostCreateSubmitBar />
                    </form>
                </FormProvider>

                <AppModal
                    open={modal.open}
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    onClose={closeModal}
                    onConfirm={closeModal}
                />
            </div>
        </div>
    );
}