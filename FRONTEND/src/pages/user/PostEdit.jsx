import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { postValidationSchemas } from '../../validation';
import { postsService } from '../../services/postsService';

import AppModal from '../../components/modals/AppModal';
import BackButton from '../../components/common/BackButton';
import PostCreateMediaSection from '../../components/user/posts/create/PostCreateMediaSection';
import PostCreateBasicInfoSection from '../../components/user/posts/create/PostCreateBasicInfoSection';
import PostCreatePricingAreaSection from '../../components/user/posts/create/PostCreatePricingAreaSection';
import PostCreateLocationSection from '../../components/user/posts/create/PostCreateLocationSection';
import PostCreateSubmitBar from '../../components/user/posts/create/PostCreateSubmitBar';
import CreatePostHeader from '../../components/user/posts/create/CreatePostHeader';

export default function PostEdit() {
    const { postId } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [modal, setModal] = useState({ open: false, type: 'info', title: '', message: '' });

    const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

    const methods = useForm({
        resolver: yupResolver(postValidationSchemas.createPostSchema),
        defaultValues: {
            propertyType: 'HOUSE',
            listingType: 'SALE',
            legalStatus: 'SO_DO',
            thumbnailUrl: null,
            imageUrls: [],
            latitude: '',
            longitude: '',
        },
    });

    const { handleSubmit, reset } = methods;

    const fetchEditData = useCallback(async () => {
        try {
            setLoading(true);
            const response = await postsService.getPostDetailsForEdit(postId);
            if (response.code === 1000) {
                const p = response.result;
                reset({
                    title: p.title,
                    description: p.description,
                    propertyType: p.propertyType,
                    listingType: p.listingType,
                    legalStatus: p.legalStatus,
                    price: p.price,
                    area: p.area,
                    wardId: String(p.wardId),
                    streetAddress: p.streetAddress,
                    latitude: p.latitude ?? '',
                    longitude: p.longitude ?? '',
                    bedrooms: p.bedrooms ?? '',
                    bathrooms: p.bathrooms ?? '',
                    thumbnailUrl: p.thumbnailUrl,
                    imageUrls: p.imageUrls,
                });
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu chỉnh sửa:', error);
            setModal({
                open: true,
                type: 'error',
                title: 'Lỗi',
                message: error.message || 'Không thể tải dữ liệu bài đăng.',
            });
        } finally {
            setLoading(false);
        }
    }, [postId, reset]);

    useEffect(() => {
        fetchEditData();
        window.scrollTo(0, 0);
    }, [fetchEditData]);

    const onSubmit = async (data) => {
        try {
            const formData = new FormData();
            const normalizedLatitude = data.latitude === '' || data.latitude == null ? null : Number(data.latitude);
            const normalizedLongitude = data.longitude === '' || data.longitude == null ? null : Number(data.longitude);

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

            formData.append('data', new Blob([JSON.stringify(postDataObj)], { type: 'application/json' }));

            if (data.thumbnailUrl instanceof File) {
                formData.append('thumbnail', data.thumbnailUrl);
            } else {
                formData.append('thumbnailUrl', data.thumbnailUrl);
            }

            const oldUrls = data.imageUrls.filter((item) => typeof item === 'string');
            const newFiles = data.imageUrls.filter((item) => item instanceof File);
            oldUrls.forEach((url) => formData.append('imageUrls', url));
            newFiles.forEach((file) => formData.append('images', file));

            const result = await postsService.updatePost(postId, formData);
            console.log("id gửi lên là:", postId);
            console.log("data gửi lên là:", postDataObj);
            console.log("chỉnh sửa ảnh đại diện?:", data.thumbnailUrl instanceof File);
            console.log("chỉnh sửa các ảnh phụ?", newFiles.length > 0);

            console.log('=== imageUrls (old) gửi lên:', oldUrls);
            console.log('=== images (new files) gửi lên:', newFiles);
            // Log toàn bộ formData
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }

            setModal({
                open: true,
                type: 'success',
                title: 'Cập nhật thành công!',
                message: result.message || 'Bài đăng của bạn đã được cập nhật(mes default FE).',
            });
        } catch (error) {
            setModal({
                open: true,
                type: 'error',
                title: 'Cập nhật thất bại',
                message: error.message || 'Có lỗi xảy ra, vui lòng thử lại sau.',
            });
        }
    };

    const handleModalClose = () => {
        closeModal();
        if (modal.type === 'success') {
            navigate('/user/posts');
        }
    };

    if (loading) return (
        <div className="py-20 text-center font-black text-[#041627] animate-pulse">
            Đang tải dữ liệu...
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 py-10">
            <div className="mx-auto max-w-4xl px-4 md:px-0">
                <div className="mb-6">
                    <BackButton />
                </div>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 relative">
                        <CreatePostHeader isEdit />
                        <PostCreateMediaSection />
                        <PostCreateBasicInfoSection />
                        <PostCreatePricingAreaSection />
                        <PostCreateLocationSection />
                        <PostCreateSubmitBar isEdit/>
                    </form>
                </FormProvider>

                <AppModal
                    open={modal.open}
                    type={modal.type}
                    title={modal.title}
                    message={modal.message}
                    onClose={handleModalClose}
                    onConfirm={handleModalClose}
                />
            </div>
        </div>
    );
}