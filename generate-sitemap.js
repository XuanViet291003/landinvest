const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/about-us', changefreq: 'weekly', priority: 0.8 },
    { url: '/list_all_du_an', changefreq: 'weekly', priority: 0.7 },
    { url: '/detail_du_an/:projectId', changefreq: 'monthly', priority: 0.6 },
    { url: '/news', changefreq: 'daily', priority: 0.9 },
    { url: '/auctions', changefreq: 'weekly', priority: 0.8 },
    { url: '/landuseplan', changefreq: 'weekly', priority: 0.7 },
    { url: '/landuseplan/:id', changefreq: 'monthly', priority: 0.6 },
    { url: '/bidding', changefreq: 'weekly', priority: 0.8 },
    { url: '/bidding/procurement', changefreq: 'monthly', priority: 0.7 },
    { url: '/userprofile', changefreq: 'monthly', priority: 0.6 },
    { url: '/vipupgrade', changefreq: 'monthly', priority: 0.7 },
    { url: '/instruction', changefreq: 'monthly', priority: 0.6 },
    { url: '/test', changefreq: 'monthly', priority: 0.6 },
    { url: '/checkout', changefreq: 'monthly', priority: 0.6 },
    { url: '/order-success', changefreq: 'monthly', priority: 0.6 },
    { url: '/order-canceled', changefreq: 'monthly', priority: 0.6 },
    { url: '/land-cost', changefreq: 'monthly', priority: 0.6 },
    { url: '/administrative-maps', changefreq: 'weekly', priority: 0.7 },
    { url: '/administrative-maps/:id', changefreq: 'monthly', priority: 0.6 },
    { url: '/investor', changefreq: 'weekly', priority: 0.7 },
    { url: '/login', changefreq: 'yearly', priority: 0.5 },
    { url: '/register', changefreq: 'yearly', priority: 0.5 },
    { url: '/forgotPassword', changefreq: 'yearly', priority: 0.5 },
];

const generateSitemap = async () => {
    const sitemapStream = new SitemapStream({ hostname: 'https://quyhoach.xyz/' });
    const writeStream = createWriteStream(path.resolve(__dirname, 'public/sitemap.xml'));

    try {
        sitemapStream.pipe(writeStream);

        links.forEach((link) => sitemapStream.write(link));
        sitemapStream.end();

        await streamToPromise(sitemapStream);
        console.log('Sitemap created successfully!');
    } catch (error) {
        console.error('Failed to create sitemap:', error);
    }
};

generateSitemap();
