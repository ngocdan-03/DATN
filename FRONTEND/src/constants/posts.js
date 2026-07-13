// cho overview status của bài đăng
export const POST_STATUS = {
  PENDING: { value: "PENDING", label: "Chờ duyệt", color: "#f59e0b" },
  APPROVED: { value: "APPROVED", label: "Đã duyệt", color: "#10b981" },
  DELETED: { value: "DELETED", label: "Đã xóa", color: "#64748b" },
  REJECTED: { value: "REJECTED", label: "Từ chối", color: "#ef4444" },
};

// cho bộ lọc
export const PROPERTY_TYPES = [
  { value: "", label: "Tất cả" },
	{ value: 'LAND', label: 'Đất' },
	{ value: 'HOUSE', label: 'Nhà' },
	{ value: 'APARTMENT', label: 'Căn hộ' },
];

export const LISTING_TYPES = [
  { value: "", label: "Tất cả" },
  { value: 'SALE', label: 'Bán' },
  { value: 'RENT', label: 'Cho thuê' },
];

//---------------------------------------------//
// giá trị cho diện tích và giá
const PRICE_MASTER = [
    { id: "", label: "Tất cả", min: null, max: null },
    { id: 'UNDER_2_BILLION', label: 'Dưới 2 tỷ', min: 0, max: 1999999999 },
    { id: '2_TO_3_5_BILLION', label: '2 tỷ - 3.5 tỷ', min: 2000000000, max: 3499999999 },
    { id: '3_5_TO_5_BILLION', label: '3.5 tỷ - 5 tỷ', min: 3500000000, max: 4999999999 },
    { id: '5_TO_10_BILLION', label: '5 tỷ - 10 tỷ', min: 5000000000, max: 10000000000 },
    { id: 'OVER_10_BILLION', label: 'Trên 10 tỷ', min: 10000000001, max: null },
];

const AREA_MASTER = [
    { id: "", label: "Tất cả", min: null, max: null },
    { id: 'UNDER_50', label: 'Dưới 50 m²', min: 0, max: 49.99 },
    { id: '50_TO_80', label: '50 - 80 m²', min: 50, max: 79.99 },
    { id: '80_TO_120', label: '80 - 120 m²', min: 80, max: 120 },
    { id: '120_TO_200', label: '120 - 200 m²', min: 120, max: 200 },
    { id: 'OVER_200', label: 'Trên 200 m²', min: 200.01, max: null },
];
// export cho ui
export const PRICE_RANGES = PRICE_MASTER.map(item => ({ 
    value: item.id, 
    label: item.label 
}));

export const AREA_RANGES = AREA_MASTER.map(item => ({ 
    value: item.id, 
    label: item.label 
}));
// hàm lấy giá trị min max từ id
export const getPriceBoundaries = (value) => {
    const found = PRICE_MASTER.find(item => item.id === value);
    return found ? { minPrice: found.min, maxPrice: found.max } : { minPrice: null, maxPrice: null };
};

export const getAreaBoundaries = (value) => {
    const found = AREA_MASTER.find(item => item.id === value);
    return found ? { minArea: found.min, maxArea: found.max } : { minArea: null, maxArea: null };
};
//---------------------------------------------//


export const LEGAL_STATUSES = [
  { value: "", label: "Tất cả" },
  { value: 'SO_DO', label: 'Sổ đỏ' },
	{ value: 'SO_HONG', label: 'Sổ hồng' },
	{ value: 'HD_MUA_BAN', label: 'HĐ mua bán' },
	{ value: 'GIAY_TAY', label: 'Giấy tay' },
	{ value: 'DANG_CHO_SO', label: 'Đang chờ sổ' },
];

export const ROOMCOUNTS = [
	{ value: '', label: 'Không giới hạn' },
	{ value: '1', label: 'Từ 1 phòng' },
	{ value: '2', label: 'Từ 2 phòng' },
	{ value: '3', label: 'Từ 3 phòng' },
	{ value: '4', label: 'Từ 4 phòng' },
	{ value: '5', label: 'Từ 5 phòng' },
];

export const BATHCOUNTS = [
	{ value: '', label: 'Không giới hạn' },
	{ value: '1', label: 'Từ 1 phòng' },
	{ value: '2', label: 'Từ 2 phòng' },
	{ value: '3', label: 'Từ 3 phòng' },
	{ value: '4', label: 'Từ 4 phòng' },
	{ value: '5', label: 'Từ 5 phòng' },
];

export const DANANG_AREAS = [
  { value: "", label: "Tất cả khu vực" },
  { value: "20194", label: "Phường Hải Vân" },
  { value: "20197", label: "Phường Liên Chiểu" },
  { value: "20200", label: "Phường Hòa Khánh" },
  { value: "20209", label: "Phường Thanh Khê" },
  { value: "20242", label: "Phường Hải Châu" },
  { value: "20257", label: "Phường Hòa Cường" },
  { value: "20260", label: "Phường Cẩm Lệ" },
  { value: "20263", label: "Phường Sơn Trà" },
  { value: "20275", label: "Phường An Hải" },
  { value: "20285", label: "Phường Ngũ Hành Sơn" },
  { value: "20305", label: "Phường An Khê" },
  { value: "20308", label: "Xã Bà Nà" },
  { value: "20314", label: "Phường Hòa Xuân" },
  { value: "20320", label: "Xã Hòa Vang" },
  { value: "20332", label: "Xã Hòa Tiến" },
  { value: "20333", label: "Đặc khu Hoàng Sa" },
  { value: "20335", label: "Phường Bàn Thạch" },
  { value: "20341", label: "Phường Tam Kỳ" },
  { value: "20350", label: "Phường Hương Trà" },
  { value: "20356", label: "Phường Quảng Phú" },
  { value: "20364", label: "Xã Chiên Đàn" },
  { value: "20380", label: "Xã Tây Hồ" },
  { value: "20392", label: "Xã Phú Ninh" },
  { value: "20401", label: "Phường Hội An Tây" },
  { value: "20410", label: "Phường Hội An" },
  { value: "20413", label: "Phường Hội An Đông" },
  { value: "20434", label: "Xã Tân Hiệp" },
  { value: "20443", label: "Xã Hùng Sơn" },
  { value: "20455", label: "Xã Tây Giang" },
  { value: "20458", label: "Xã Avương" },
  { value: "20467", label: "Xã Đông Giang" },
  { value: "20476", label: "Xã Sông Kôn" },
  { value: "20485", label: "Xã Sông Vàng" },
  { value: "20494", label: "Xã Bến Hiên" },
  { value: "20500", label: "Xã Đại Lộc" },
  { value: "20506", label: "Xã Thượng Đức" },
  { value: "20515", label: "Xã Hà Nha" },
  { value: "20539", label: "Xã Vu Gia" },
  { value: "20542", label: "Xã Phú Thuận" },
  { value: "20551", label: "Phường Điện Bàn" },
  { value: "20557", label: "Phường Điện Bàn Bắc" },
  { value: "20569", label: "Xã Điện Bàn Tây" },
  { value: "20575", label: "Phường An Thắng" },
  { value: "20579", label: "Phường Điện Bàn Đông" },
  { value: "20587", label: "Xã Gò Nổi" },
  { value: "20599", label: "Xã Nam Phước" },
  { value: "20611", label: "Xã Thu Bồn" },
  { value: "20623", label: "Xã Duy Xuyên" },
  { value: "20635", label: "Xã Duy Nghĩa" },
  { value: "20641", label: "Xã Quế Sơn" },
  { value: "20650", label: "Xã Xuân Phú" },
  { value: "20656", label: "Xã Nông Sơn" },
  { value: "20662", label: "Xã Quế Sơn Trung" },
  { value: "20669", label: "Xã Quế Phước" },
  { value: "20695", label: "Xã Thạnh Mỹ" },
  { value: "20698", label: "Xã La Êê" },
  { value: "20704", label: "Xã La Dêê" },
  { value: "20707", label: "Xã Nam Giang" },
  { value: "20710", label: "Xã Bến Giằng" },
  { value: "20716", label: "Xã Đắc Pring" },
  { value: "20722", label: "Xã Khâm Đức" },
  { value: "20728", label: "Xã Phước Hiệp" },
  { value: "20734", label: "Xã Phước Năng" },
  { value: "20740", label: "Xã Phước Chánh" },
  { value: "20752", label: "Xã Phước Thành" },
  { value: "20767", label: "Xã Việt An" },
  { value: "20770", label: "Xã Phước Trà" },
  { value: "20779", label: "Xã Hiệp Đức" },
  { value: "20791", label: "Xã Thăng Bình" },
  { value: "20794", label: "Xã Thăng An" },
  { value: "20818", label: "Xã Đồng Dương" },
  { value: "20827", label: "Xã Thăng Phú" },
  { value: "20836", label: "Xã Thăng Trường" },
  { value: "20848", label: "Xã Thăng Điền" },
  { value: "20854", label: "Xã Tiên Phước" },
  { value: "20857", label: "Xã Sơn Cẩm Hà" },
  { value: "20875", label: "Xã Lãnh Ngọc" },
  { value: "20878", label: "Xã Thạnh Bình" },
  { value: "20900", label: "Xã Trà My" },
  { value: "20908", label: "Xã Trà Liên" },
  { value: "20920", label: "Xã Trà Đốc" },
  { value: "20923", label: "Xã Trà Tân" },
  { value: "20929", label: "Xã Trà Giáp" },
  { value: "20938", label: "Xã Trà Leng" },
  { value: "20941", label: "Xã Trà Tập" },
  { value: "20944", label: "Xã Nam Trà My" },
  { value: "20950", label: "Xã Trà Linh" },
  { value: "20959", label: "Xã Trà Vân" },
  { value: "20965", label: "Xã Núi Thành" },
  { value: "20971", label: "Xã Tam Xuân" },
  { value: "20977", label: "Xã Đức Phú" },
  { value: "20984", label: "Xã Tam Anh" },
  { value: "20992", label: "Xã Tam Hải" },
  { value: "21004", label: "Xã Tam Mỹ" },
];