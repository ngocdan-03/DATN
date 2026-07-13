import * as yup from 'yup';

export const createPostSchema = yup.object({
    title: yup
        .string()
        .trim()
        .required('Tiêu đề là bắt buộc.')
        .min(10, 'Tiêu đề phải có ít nhất 10 ký tự.')
        .max(150, 'Tiêu đề không được vượt quá 150 ký tự.'),

    description: yup
        .string()
        .trim()
        .required('Mô tả là bắt buộc.')
        .min(20, 'Mô tả phải có ít nhất 20 ký tự.'),

    propertyType: yup
        .string()
        .required('Loại bất động sản là bắt buộc.'),

    listingType: yup
        .string()
        .required('Hình thức là bắt buộc.'),

    legalStatus: yup
        .string()
        .required('Tình trạng pháp lý là bắt buộc.'),

    price: yup
        .number()
        .typeError('Giá phải là số.')
        .required('Giá là bắt buộc.')
        .min(10000000, 'Giá tối thiểu là 10 triệu đồng.')
        .max(999999999999999, 'Giá vượt quá giới hạn cho phép.'),

    area: yup
        .number()
        .typeError('Diện tích phải là số.')
        .required('Diện tích là bắt buộc.')
        .min(10, 'Diện tích tối thiểu là 10 m².'),

    wardId: yup
        .string()
        .required('Phường/Xã là bắt buộc.'),

    streetAddress: yup
        .string()
        .trim()
        .required('Địa chỉ là bắt buộc.'),

    latitude: yup
        .number()
        .typeError('Vĩ độ phải là số.')
        .min(-90, 'Vĩ độ không hợp lệ.')
        .max(90, 'Vĩ độ không hợp lệ.')
        .nullable()
        .transform((val, orig) => (orig === '' ? null : val)),

    longitude: yup
        .number()
        .typeError('Kinh độ phải là số.')
        .min(-180, 'Kinh độ không hợp lệ.')
        .max(180, 'Kinh độ không hợp lệ.')
        .nullable()
        .transform((val, orig) => (orig === '' ? null : val)),

    bedrooms: yup
        .number()
        .typeError('Số phòng ngủ phải là số.')
        .min(0, 'Số phòng ngủ không hợp lệ.')
        .nullable()
        .transform((val, orig) => (orig === '' ? null : val)),

    bathrooms: yup
        .number()
        .typeError('Số phòng tắm phải là số.')
        .min(0, 'Số phòng tắm không hợp lệ.')
        .nullable()
        .transform((val, orig) => (orig === '' ? null : val)),

    thumbnailUrl: yup
        .mixed()
        .required('Ảnh đại diện là bắt buộc.'),

    imageUrls: yup
        .array()
        .min(1, 'Cần ít nhất 1 ảnh chi tiết.')
        .required('Ảnh chi tiết là bắt buộc.'),
});