import { useEffect, useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { AREA_OPTIONS, LEGAL_STATUS_OPTIONS, LISTING_TYPE_OPTIONS, PROPERTY_TYPE_OPTIONS } from '../../constants/postFilters';
import AppNoticeModal from '../../components/common/modals/AppNoticeModal';
import CreatePostHeader from '../../components/user/post/create/CreatePostHeader';
import PostCreateBasicInfoSection from '../../components/user/post/create/PostCreateBasicInfoSection';
import PostCreateLocationSection from '../../components/user/post/create/PostCreateLocationSection';
import PostCreateMediaSection from '../../components/user/post/create/PostCreateMediaSection';
import PostCreatePricingAreaSection from '../../components/user/post/create/PostCreatePricingAreaSection';
import PostCreateSubmitBar from '../../components/user/post/create/PostCreateSubmitBar';
import { emitAuthRequired } from '../../services/authUiEvents';
import { createPost } from '../../services/postService';
import { createLogger } from '../../utils/logger';
import { buildYupResolver, postValidationSchemas } from '../../validation';

const logPostCreate = createLogger('PostCreatePage');
const STATIC_BASE_PATH = '/assets/posts';
const DEFAULT_FORM_VALUES = {
	title: '',
	bedrooms: 1,
	bathrooms: 1,
	streetAddress: '',
	thumbnailUrl: '',
	price: '',
	area: '',
	propertyType: 'APARTMENT',
	listingType: 'SALE',
	legalStatus: 'SO_DO',
	description: '',
	wardId: 20194,
	imageUrls: [],
};

const toAssetPath = (file) => `${STATIC_BASE_PATH}/${file.name}`;

const formatPricePreview = (price) => {
	if (price === '' || price === null || price === undefined) return '';
	const numericPrice = Number(price);
	if (!Number.isFinite(numericPrice) || numericPrice < 0) return '';
	return `${new Intl.NumberFormat('vi-VN').format(numericPrice)} VND`;
};

const formatAreaPreview = (area) => {
	if (area === '' || area === null || area === undefined) return '';
	const numericArea = Number(area);
	if (!Number.isFinite(numericArea) || numericArea < 0) return '';
	const formatted = Number.isInteger(numericArea)
		? new Intl.NumberFormat('vi-VN').format(numericArea)
		: new Intl.NumberFormat('vi-VN', { maximumFractionDigits: 2 }).format(numericArea);
	return `${formatted} m2`;
};

const parseWardOptions = () => {
	return AREA_OPTIONS.map((entry) => {
		const [id, ...nameParts] = entry.split(' - ');
		const trimmedId = (id || '').trim();
		const wardName = nameParts.join(' - ').trim();
		return {
			id: Number(trimmedId),
			label: `${wardName} (${trimmedId})`,
		};
	}).filter((option) => Number.isInteger(option.id));
};

const PostCreate = () => {
	const [thumbnailFile, setThumbnailFile] = useState(null);
	const [galleryFiles, setGalleryFiles] = useState([]);
	const [galleryIndex, setGalleryIndex] = useState(0);
	const [noticeState, setNoticeState] = useState({
		open: false,
		title: 'Thông báo',
		message: '',
		variant: 'info',
	});
	const [selectedPropertyType, setSelectedPropertyType] = useState('APARTMENT');
	const [thumbnailInputKey, setThumbnailInputKey] = useState(0);
	const [galleryInputKey, setGalleryInputKey] = useState(0);

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm({
		resolver: buildYupResolver(postValidationSchemas.createPostSchema),
		defaultValues: DEFAULT_FORM_VALUES,
	});

	const isLand = selectedPropertyType === 'LAND';
	const propertyTypeField = register('propertyType');
	const priceValue = useWatch({ control, name: 'price' });
	const areaValue = useWatch({ control, name: 'area' });

	const filteredPropertyTypeOptions = useMemo(
		() => PROPERTY_TYPE_OPTIONS.filter((option) => option.value),
		[],
	);
	const filteredListingTypeOptions = useMemo(
		() => LISTING_TYPE_OPTIONS.filter((option) => option.value),
		[],
	);
	const filteredLegalStatusOptions = useMemo(
		() => LEGAL_STATUS_OPTIONS.filter((option) => option.value),
		[],
	);
	const wardOptions = useMemo(() => parseWardOptions(), []);

	useEffect(() => {
		if (thumbnailFile) {
			setValue('thumbnailUrl', toAssetPath(thumbnailFile), { shouldValidate: true });
		} else {
			setValue('thumbnailUrl', '', { shouldValidate: true });
		}
	}, [thumbnailFile, setValue]);

	useEffect(() => {
		setValue(
			'imageUrls',
			galleryFiles.map((file) => toAssetPath(file)),
			{ shouldValidate: true },
		);
	}, [galleryFiles, setValue]);

	useEffect(() => {
		if (isLand) {
			setValue('bedrooms', undefined, { shouldValidate: true });
			setValue('bathrooms', undefined, { shouldValidate: true });
		} else {
			setValue('bedrooms', getValues('bedrooms') ?? 1, { shouldValidate: true });
			setValue('bathrooms', getValues('bathrooms') ?? 1, { shouldValidate: true });
		}
	}, [getValues, isLand, setValue]);

	const thumbnailPreview = useMemo(() => {
		if (!thumbnailFile) return '';
		return URL.createObjectURL(thumbnailFile);
	}, [thumbnailFile]);

	const galleryMainPreview = useMemo(() => {
		if (!galleryFiles.length) return '';
		const safeIndex = Math.min(galleryIndex, Math.max(galleryFiles.length - 1, 0));
		return URL.createObjectURL(galleryFiles[safeIndex]);
	}, [galleryFiles, galleryIndex]);

	const safeGalleryIndex = Math.min(galleryIndex, Math.max(galleryFiles.length - 1, 0));

	useEffect(() => {
		return () => {
			if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
			if (galleryMainPreview) URL.revokeObjectURL(galleryMainPreview);
		};
	}, [thumbnailPreview, galleryMainPreview]);

	const appendGalleryFiles = (incomingFileList) => {
		const incomingFiles = Array.from(incomingFileList || []).filter((file) => (file.type || '').startsWith('image/'));
		if (!incomingFiles.length) return;

		setGalleryFiles((previous) => {
			const existing = new Set(previous.map((file) => `${file.name}::${file.size}::${file.lastModified}`));
			const nextFiles = [...previous];
			incomingFiles.forEach((file) => {
				const signature = `${file.name}::${file.size}::${file.lastModified}`;
				if (!existing.has(signature)) {
					nextFiles.push(file);
					existing.add(signature);
				}
			});
			return nextFiles;
		});
	};

	const removeGalleryFile = (indexToRemove) => {
		setGalleryFiles((previous) => previous.filter((_, index) => index !== indexToRemove));
		setGalleryIndex((previous) => {
			if (previous > indexToRemove) return previous - 1;
			return previous;
		});
	};

	const handleCreatePost = async (formValues) => {
		setNoticeState((previous) => ({ ...previous, open: false, message: '' }));
		const token = localStorage.getItem('accessToken') || '';
		if (!token) {
			emitAuthRequired({
				message: 'Bạn cần đăng nhập để đăng tin bất động sản.',
				from: '/dang-tin',
			});
			return;
		}

		const payload = {
			title: formValues.title.trim(),
			streetAddress: formValues.streetAddress.trim(),
			thumbnailUrl: formValues.thumbnailUrl,
			price: Number(formValues.price),
			area: Number(formValues.area),
			propertyType: formValues.propertyType,
			listingType: formValues.listingType,
			legalStatus: formValues.legalStatus,
			description: formValues.description.trim(),
			wardId: Number(formValues.wardId),
			imageUrls: formValues.imageUrls,
			...(formValues.propertyType !== 'LAND'
				? {
					bedrooms: Number(formValues.bedrooms || 0),
					bathrooms: Number(formValues.bathrooms || 0),
				}
				: {}),
		};

		logPostCreate('Submit create post', {
			propertyType: payload.propertyType,
			listingType: payload.listingType,
			wardId: payload.wardId,
			hasRooms: payload.propertyType !== 'LAND',
			galleryCount: payload.imageUrls.length,
		});

		try {
			const response = await createPost(payload, token);
			if (response.data?.code === 1000) {
				reset(DEFAULT_FORM_VALUES);
				setSelectedPropertyType('APARTMENT');
				setThumbnailFile(null);
				setGalleryFiles([]);
				setGalleryIndex(0);
				setThumbnailInputKey((previous) => previous + 1);
				setGalleryInputKey((previous) => previous + 1);
				setNoticeState({
					open: true,
					title: 'Đăng tin thành công',
					message: response.data?.message || 'Đăng tin thành công, vui lòng chờ admin duyệt.',
					variant: 'success',
				});
				return;
			}

			setNoticeState({
				open: true,
				title: 'Không thể đăng tin',
				message: response.data?.message || 'Không thể đăng tin.',
				variant: 'error',
			});
		} catch (error) {
			setNoticeState({
				open: true,
				title: 'Không thể đăng tin',
				message: error.response?.data?.message || 'Không thể đăng tin. Vui lòng thử lại.',
				variant: 'error',
			});
		}
	};

	return (
		<main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-10">
			<AppNoticeModal
				open={noticeState.open}
				title={noticeState.title}
				message={noticeState.message}
				variant={noticeState.variant}
				onConfirm={() => setNoticeState((previous) => ({ ...previous, open: false }))}
			/>

			<CreatePostHeader />

			<form className="space-y-8" onSubmit={handleSubmit(handleCreatePost)}>
				<PostCreateMediaSection
					thumbnailInputKey={thumbnailInputKey}
					galleryInputKey={galleryInputKey}
					thumbnailPreview={thumbnailPreview}
					galleryMainPreview={galleryMainPreview}
					galleryFiles={galleryFiles}
					safeGalleryIndex={safeGalleryIndex}
					errors={errors}
					onThumbnailChange={(event) => setThumbnailFile(event.target.files?.[0] || null)}
					onGalleryChange={(event) => {
						appendGalleryFiles(event.target.files);
						event.target.value = '';
					}}
					onClearGallery={() => {
						setGalleryFiles([]);
						setGalleryIndex(0);
					}}
					onPrev={() => setGalleryIndex((previous) => (previous - 1 + galleryFiles.length) % galleryFiles.length)}
					onNext={() => setGalleryIndex((previous) => (previous + 1) % galleryFiles.length)}
					onSelectGalleryIndex={setGalleryIndex}
					onRemoveGalleryFile={removeGalleryFile}
				/>

				<PostCreateBasicInfoSection
					register={register}
					errors={errors}
					propertyTypeField={propertyTypeField}
					onPropertyTypeChange={(event) => {
						propertyTypeField.onChange(event);
						setSelectedPropertyType(event.target.value);
					}}
					propertyTypeOptions={filteredPropertyTypeOptions}
					listingTypeOptions={filteredListingTypeOptions}
				/>

				<PostCreatePricingAreaSection
					register={register}
					errors={errors}
					pricePreview={formatPricePreview(priceValue)}
					areaPreview={formatAreaPreview(areaValue)}
					legalStatusOptions={filteredLegalStatusOptions}
				/>

				<PostCreateLocationSection register={register} errors={errors} wardOptions={wardOptions} isLand={isLand} />

				<PostCreateSubmitBar isSubmitting={isSubmitting} />
			</form>
		</main>
	);
};

export default PostCreate;
