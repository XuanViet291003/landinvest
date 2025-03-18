// import axios from 'axios';
// import { fetchDistrictsByProvinces, fetchProvinces } from '../services/api';
// import { API_KEYS_MAP, BASE_URL_API_MAP } from '../configs/apiKeyMap';
// import { getRandomIntegerBelow } from '../utils/getRandomIntegerBelow';

// const fetchProvinceName = async (lat, lon) => {
//     // console.log("Latitude",lat);
//     // console.log("Longitude",lon);
//     try {
//         if (lat && lon) {
//             const response = await axios.get(BASE_URL_API_MAP + '/geocode/reverse?lang=vi', {
//                 params: {
//                     apiKey: API_KEYS_MAP[getRandomIntegerBelow(API_KEYS_MAP.length)],
//                     lat,
//                     lon,
//                     type: 'city',
//                 },
//             });

//             const address = response.data.features[0]?.properties;
//             let provinceName = address.state || address.province || address.city;
//             let districtName =
//                 address.county ||
//                 address.district ||
//                 address.city_district ||
//                 address.suburb ||
//                 address.town ||
//                 address.village ||
//                 address.formatted.split(',')[0];

//             if (districtName) {
//                 districtName = districtName?.replace(/district/i, '').trim();
//             }

//             if (provinceName) {
//                 provinceName = provinceName?.replace(/province/i, '').trim();
//             }
//             return { provinceName, districtName } || 'Unknown';
//         }
//     } catch (error) {
//         console.error('Error fetching province name:', error);
//         return 'Unknown';
//     }
// };

// export const getProvince = async (provinceName) => {
//     const provincesList = await fetchProvinces();
//     const province = provincesList.find(
//         (province) => province.TenTinhThanhPho?.toLowerCase() === provinceName?.toLowerCase(),
//     );
//     return province || null;
// };

// export const getDistrict = async (provinceId) => {
//     const districtsList = await fetchDistrictsByProvinces(provinceId);
//     return districtsList || null;
// };

// export default fetchProvinceName;

let provincesCache = null; // Lưu danh sách tỉnh để chỉ fetch một lần
let districtsCache = {}; // Cache danh sách quận/huyện theo provinceFile

// Fetch danh sách tỉnh chỉ một lần
const loadProvinces = async () => {
    if (!provincesCache) {
        const response = await fetch('/tinh.json');
        provincesCache = await response.json();
    }
    return provincesCache;
};

// Fetch danh sách quận/huyện theo provinceFile và cache lại
const loadDistricts = async (provinceFile) => {
    if (!provinceFile) return null;
    
    if (!districtsCache[provinceFile]) {
        const response = await fetch(`/polygon/${provinceFile}`);
        const districtData = await response.json();
        districtsCache[provinceFile] = districtData.list_tinh || null;
    }
    
    return districtsCache[provinceFile];
};

// Hàm chính để lấy tên tỉnh và quận/huyện theo tọa độ
const fetchProvinceName = async (lat, lon) => {
    try {
        if (!lat || !lon) return { provinceName: 'Unknown', districtName: 'Unknown', provinceId: 0 };

        const provincesList = await loadProvinces();

        // Tìm tỉnh chứa tọa độ trong bbox
        let matchedProvince = provincesList.find(province => {
            let bbox = JSON.parse(province.bbox.replace(/'/g, '"')); // Fix định dạng JSON lỗi
            return lat >= bbox.south && lat <= bbox.north && lon >= bbox.west && lon <= bbox.east;
        });

        if (!matchedProvince) return { provinceName: 'Unknown', districtName: 'Unknown', provinceId: 0 };

        let provinceName = matchedProvince.name_province;
        let provinceId = matchedProvince.province__id;
        let provinceFile = matchedProvince.file;

        // Fetch danh sách quận/huyện khi provinceFile thay đổi
        const districtsList = await loadDistricts(provinceFile);

        // Tìm quận/huyện chứa tọa độ trong bbox của nó
        let matchedDistrict = districtsList?.find(district => {
            let bbox = JSON.parse(district.bbox.replace(/'/g, '"'));
            return lat >= bbox.south && lat <= bbox.north && lon >= bbox.west && lon <= bbox.east;
        });

        let districtName = matchedDistrict ? matchedDistrict.name_District : 'Unknown';

        return { provinceName, districtName, provinceId };
    } catch (error) {
        console.error('Error fetching province/district:', error);
        return { provinceName: 'Unknown', districtName: 'Unknown', provinceId: 0 };
    }
};

// Hàm lấy thông tin tỉnh theo tên (không fetch lại nếu đã có trong cache)
export const getProvince = async (provinceName) => {
    const provincesList = await loadProvinces();
    return provincesList.find(province => province.name_province.toLowerCase() === provinceName.toLowerCase()) || null;
};

// Hàm lấy danh sách quận/huyện từ file provinceFile (sử dụng cache)
export const getDistrict = async (provinceFile) => {
    return await loadDistricts(provinceFile);
};

export default fetchProvinceName;