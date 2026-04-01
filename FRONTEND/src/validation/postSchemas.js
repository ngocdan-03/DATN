import * as yup from 'yup';

const PROPERTY_TYPES = ['LAND', 'HOUSE', 'APARTMENT'];
const LISTING_TYPES = ['SALE', 'RENT'];
const LEGAL_STATUSES = ['SO_DO', 'SO_HONG', 'HD_MUA_BAN', 'GIAY_TAY', 'DANG_CHO_SO'];

const IMAGE_URL_REGEX = /^(https?:\/\/.*|\/.*|[a-zA-Z0-9._-]+\.(jpg|jpeg|png|gif|webp))$/;

export const createPostSchema = yup
	.object({
		title: yup.string().trim().required('Tiêu đề là bắt buộc.').min(10, 'Tiêu đề tối thiểu 10 ký tự.').max(150, 'Tiêu đề tối đa 150 ký tự.'),
		bedrooms: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' || originalValue === null || Number.isNaN(value) ? undefined : value))
			.min(0, 'Số phòng ngủ không hợp lệ.')
			.integer('Số phòng ngủ phải là số nguyên.')
			.notRequired(),
		bathrooms: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' || originalValue === null || Number.isNaN(value) ? undefined : value))
			.min(0, 'Số phòng tắm không hợp lệ.')
			.integer('Số phòng tắm phải là số nguyên.')
			.notRequired(),
		streetAddress: yup.string().trim().required('Địa chỉ là bắt buộc.'),
		thumbnailUrl: yup
			.string()
			.trim()
			.required('Ảnh đại diện là bắt buộc.')
			.matches(IMAGE_URL_REGEX, 'Đường dẫn ảnh đại diện không hợp lệ.'),
		price: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' || originalValue === null || Number.isNaN(value) ? undefined : value))
			.required('Giá là bắt buộc.')
			.min(10000000, 'Giá tối thiểu là 10.000.000 VNĐ.')
			.max(999999999999999, 'Giá tối đa là 999.999.999.999.999 VNĐ.'),
		area: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' || originalValue === null || Number.isNaN(value) ? undefined : value))
			.required('Diện tích là bắt buộc.')
			.min(10, 'Diện tích tối thiểu là 10m2.'),
		propertyType: yup.string().required('Loại bất động sản là bắt buộc.').oneOf(PROPERTY_TYPES, 'Loại bất động sản không hợp lệ.'),
		listingType: yup.string().required('Hình thức là bắt buộc.').oneOf(LISTING_TYPES, 'Hình thức không hợp lệ.'),
		legalStatus: yup.string().required('Tình trạng pháp lý là bắt buộc.').oneOf(LEGAL_STATUSES, 'Tình trạng pháp lý không hợp lệ.'),
		description: yup.string().trim().required('Mô tả là bắt buộc.').min(20, 'Mô tả tối thiểu 20 ký tự.'),
		wardId: yup
			.number()
			.transform((value, originalValue) => (originalValue === '' || originalValue === null || Number.isNaN(value) ? undefined : value))
			.required('Phường/Xã là bắt buộc.')
			.integer('Phường/Xã không hợp lệ.'),
		imageUrls: yup.array().of(yup.string().trim().matches(IMAGE_URL_REGEX, 'Đường dẫn ảnh không hợp lệ.')).min(1, 'Phải có ít nhất 1 ảnh chi tiết.').required('Ảnh chi tiết là bắt buộc.'),
	})
	.test('land-has-no-rooms', 'Loại đất không nhận bedrooms hoặc bathrooms.', (value) => {
		if (!value || value.propertyType !== 'LAND') return true;
		return value.bedrooms === undefined && value.bathrooms === undefined;
	});
