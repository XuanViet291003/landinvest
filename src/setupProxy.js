const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {


    app.use(
        '/api/thinkdiffus',
        createProxyMiddleware({
            target: 'https://thinkdiff.us/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/thinkdiffus': '',
            },
        })
    );

    // Proxy cho API https://thinkdiff.us/dotbien-hatang/<districtId>.json
    app.use(
        '/api/thinkdiff',
        createProxyMiddleware({
            target: 'https://photo.thinkdiff.us/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/thinkdiff': '', // Loại bỏ prefix /api/thinkdiff khi gọi API
            },
        })
    );

    // Proxy cho các API sử dụng base URL https://landinvest.thinkdiff.us/
    app.use(
        '/api/landinvest',
        createProxyMiddleware({
            target: 'https://landinvest.thinkdiff.us/',
            changeOrigin: true,
            pathRewrite: {
                '^/api/landinvest': '', // Loại bỏ prefix /api/landinvest khi gọi API
            },
        })
    );

    

    app.use(
        '/api', // Đường dẫn proxy
        createProxyMiddleware({
            target: 'https://guland.vn', // Đích đến
            changeOrigin: true,
            pathRewrite: { '^/api': '' }, // Loại bỏ tiền tố /api
        })
    );
};