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

const fetchProvinceName = async (lat, lon) => {
    try {
        // Bước 1: Fetch danh sách tỉnh từ file tinh.json
        const response = await fetch('/tinh.json');
        const provincesList = await response.json();

        if (!lat || !lon) return 'Unknown';

        // Bước 2: Tìm tỉnh chứa tọa độ trong bbox
        let matchedProvince = provincesList.find(province => {
            let bbox = JSON.parse(province.bbox.replace(/'/g, '"')); // Fix định dạng JSON lỗi
            return lat >= bbox.south && lat <= bbox.north && lon >= bbox.west && lon <= bbox.east;
        });

        if (!matchedProvince) return 'Unknown';

        let provinceName = matchedProvince.name_province;

        // Bước 3: Fetch danh sách quận/huyện từ file trong polygon
        const districtResponse = await fetch(`/polygon/${matchedProvince.file}`);
        const districtData = await districtResponse.json();

        const districtsList = districtData.list_tinh; // Đây là danh sách quận/huyện

        // Bước 4: Tìm quận/huyện chứa tọa độ trong bbox của nó
        let matchedDistrict = districtsList.find(district => {
            let bbox = JSON.parse(district.bbox.replace(/'/g, '"')); // Fix định dạng JSON lỗi
            return lat >= bbox.south && lat <= bbox.north && lon >= bbox.west && lon <= bbox.east        });

        let districtName = matchedDistrict ? matchedDistrict.name_District : 'Unknown';

        const provinceId = matchedProvince ? matchedProvince.province__id : 0;

        return { provinceName, districtName, provinceId };
    } catch (error) {
        console.error('Error fetching province/district:', error);
        return 'Unknown';
    }
};

export const getProvince = async (provinceName) => {
    const response = await fetch('/tinh.json');
    const provincesList = await response.json();
    return provincesList.find(province => province.name_provice.toLowerCase() === provinceName.toLowerCase()) || null;
};

export const getDistrict = async (provinceFile) => {
    const response = await fetch(`/polygon/${provinceFile}`);
    const districtData = await response.json();
    return districtData.list_tinh || null;
};

export default fetchProvinceName;