import axios from 'axios';

const clientIdName = 'x-client-id';
const apiKeyName = 'x-api-key';

// --- Instance cho landinvest.thinkdiff.us (qua proxy) ---
export const instance = axios.create({
    // baseURL: '/', // Cách cũ: Phải gọi instance.get('/api/landinvest/...')
    baseURL: 'https://landinvest.thinkdiff.us', // Cách mới: Gọi instance.get('/...') là đủ
});

export const thinkDiffus= axios.create({
    // baseURL: '/', // Cách cũ: Phải gọi thinkDiffInstance.get('/api/thinkdiff/...')
    baseURL: 'https://landinvest.com.vn', // Cách mới: Gọi thinkDiffInstance.get('/...') là đủ
});
// --- Instance cho thinkdiff.us (qua proxy) ---
// Export nếu cần dùng ở nơi khác
export const thinkDiffInstance = axios.create({
    // baseURL: '/', // Cách cũ: Phải gọi thinkDiffInstance.get('/api/thinkdiff/...')
    baseURL: 'https://photo.thinkdiff.us', // Cách mới: Gọi thinkDiffInstance.get('/...') là đủ
});


// --- Instance cho PayOS (trực tiếp) ---
export const payOsInstance = axios.create({
    baseURL: 'https://api-merchant.payos.vn',
    headers: {
        [clientIdName]: process.env.REACT_APP_PAY_OS_CLIENT_ID,
        [apiKeyName]: process.env.REACT_APP_PAY_OS_API_KEY,
    },
});

// --- Logic Refresh Token ---
const handleRefreshToken = async (userId) => {
    try {
        // Sử dụng baseURL đã cấu hình, nên chỉ cần gọi '/refresh_token/...'
        // Lưu ý: Endpoint này có thể cần hoặc không cần '/api/landinvest' tùy thuộc vào backend của bạn
        // Nếu endpoint thực tế là /refresh_token/... thì baseURL '/api/landinvest' có thể không đúng cho request này.
        // --> Cần xem lại endpoint refresh token thực tế là gì. Giả sử nó thuộc landinvest:
        const res = await instance.post(`/refresh_token/${userId}`); // Đã bao gồm /api/landinvest

        if (res && res.data) {
            const new_access_token = res.data.access_token; // Giả sử API trả về access_token mới

            // **** Sửa chỗ này ****
            // localStorage.setItem('refresh_token', new_access_token); // Sai key
            localStorage.setItem('access_token', new_access_token); // Đúng key

            // Kiểm tra xem API có trả về refresh token mới không và cập nhật nếu cần
            // const new_refresh_token = res.data.refresh_token;
            // if (new_refresh_token) {
            //     localStorage.setItem('refresh_token', new_refresh_token);
            // }

            return new_access_token;
        }
        return null;
    } catch (error) {
        console.error('Token refresh failed', error);
        // Xóa token cũ nếu refresh thất bại? (tùy logic)
        // localStorage.removeItem('access_token');
        // localStorage.removeItem('refresh_token');
        return null;
    }
};

// --- Interceptors cho 'instance' (landinvest) ---

const NO_RETRY_HEADER = 'x-no-retry';

// Request Interceptor: Thêm token vào MỌI request của 'instance'
instance.interceptors.request.use(
    function (config) {
        // Lấy token mới nhất từ localStorage TRƯỚC KHI gửi request
        const current_access_token = localStorage.getItem('access_token');
        if (current_access_token) {
            config.headers['Authorization'] = `Bearer ${current_access_token}`;
        }
        // Bạn có thể thêm logic khác ở đây nếu cần
        return config;
    },
    function (error) {
        return Promise.reject(error);
    },
);

// Response Interceptor: Xử lý lỗi (đặc biệt là 401 để refresh token)
instance.interceptors.response.use(
    function (response) {
        return response; // Trả về response thành công
    },
    async function (error) {
        const originalConfig = error.config;
        const userId = localStorage.getItem('user_id'); // Đảm bảo user_id có trong localStorage

        // Xử lý lỗi 401 (Unauthorized) và chưa từng thử retry request này
        if (userId && error.response && error.response.status === 401 && !originalConfig.headers[NO_RETRY_HEADER]) {
            console.log('Attempting token refresh...');
            const new_access_token = await handleRefreshToken(userId);

            if (new_access_token) {
                console.log('Token refreshed successfully. Retrying original request...');
                originalConfig.headers[NO_RETRY_HEADER] = 'true'; // Đánh dấu đã thử retry
                originalConfig.headers['Authorization'] = `Bearer ${new_access_token}`; // Cập nhật header với token mới
                // Retry request ban đầu với config đã cập nhật
                return instance.request(originalConfig);
            } else {
                // Nếu refresh token thất bại (handleRefreshToken trả về null)
                console.error('Refresh token failed. Redirecting to login.');
                // Có thể xóa token cũ ở đây
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_id'); // Xóa luôn user_id nếu cần
                window.location.href = '/login'; // Chuyển hướng về trang login (dùng /login thường ổn định hơn ./login)
                return Promise.reject(error); // Vẫn reject lỗi gốc sau khi chuyển hướng
            }
        }

        // Xử lý lỗi khi chính request refresh token thất bại (ví dụ: refresh token hết hạn)
        // Kiểm tra URL cẩn thận, nó PHỤ THUỘC vào baseURL của bạn
        // Nếu baseURL là '/api/landinvest', thì URL đầy đủ sẽ là '/api/landinvest/refresh_token/...'
        if (error.response && error.response.status === 400 && originalConfig.url === `/refresh_token/${userId}`) {
             console.error('Refresh token request failed with 400. Redirecting to login.');
             localStorage.removeItem('access_token');
             localStorage.removeItem('refresh_token');
             localStorage.removeItem('user_id');
             window.location.href = '/login';
             // Không cần retry ở đây, chỉ reject lỗi
        }

        // Trả về lỗi cho các trường hợp khác hoặc sau khi xử lý xong
        // return Promise.reject(error.response ? error.response.data : error); // Cách cũ
        return Promise.reject(error); // Cách mới: Trả về error object đầy đủ
    },
);

export default instance; // Export instance chính