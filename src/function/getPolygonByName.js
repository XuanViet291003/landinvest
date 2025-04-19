import axios from 'axios';
import instance from '../utils/axios-customize'; // Import the configured instance

export const getPolygonsByNames = async (names) => {
    const promises = names.map((name, i) => {
        if (i === 1) {
            return null;
        }
        return axios.get(`https://nominatim.openstreetmap.org/search`, {
            params: {
                city: name.TenTinhThanhPho,
                format: 'json',
                polygon_geojson: 1,
            },
        });
    });

    const res = await Promise.all(promises);
    console.log(res, 'res');
    console.log('object');
};

export const getPolygonsQuanHuyen = async (id) => {
    try {
        // Sử dụng instance thay vì axios.get để tận dụng cấu hình proxy và interceptors
        const response = await instance.get(`/get_polygon_district/${id}`);
        return response.data?.duongdan?.[0]; // Sử dụng optional chaining để tránh lỗi nếu không có dữ liệu
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu polygon quận/huyện:', error);
        throw error;
    }
};

export const getPolygonsTinh = async (id) => {
    try {
        // Sử dụng instance thay vì axios.get
        const response = await instance.get(`/get_polygon_provinces/${id}`);
        return response.data?.duongdan?.[0]; // Sử dụng optional chaining
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu polygon tỉnh:', error);
        throw error;
    }
};