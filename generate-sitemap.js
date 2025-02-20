const { SitemapStream, streamToPromise } = require('sitemap');
const { createWriteStream } = require('fs');
const path = require('path');

const links = [
    { url: '/', changefreq: 'weekly', priority: 0.7 },
    { url: '/about-us', changefreq: 'weekly', priority: 0.7 },
    { url: '/list_all_du_an', changefreq: 'weekly', priority: 0.7 },
    { url: '/detail_du_an/', changefreq: 'weekly', priority: 0.7 },
    { url: '/news', changefreq: 'weekly', priority: 0.7 },
    { url: '/news/group/', changefreq: 'weekly', priority: 0.7 },
    { url: '/news/group/post/', changefreq: 'weekly', priority: 0.7 },
    { url: '/news/list-post//', changefreq: 'weekly', priority: 0.7 },
    { url: '/news/latest', changefreq: 'weekly', priority: 0.7 },
    { url: '/auctions', changefreq: 'weekly', priority: 0.7 },
    { url: '/landuseplan', changefreq: 'weekly', priority: 0.7 },
    { url: '/landuseplan/', changefreq: 'weekly', priority: 0.7 },
    { url: '/bidding', changefreq: 'weekly', priority: 0.7 },
    { url: '/bidding/procurement', changefreq: 'weekly', priority: 0.7 },
    { url: '/userprofile', changefreq: 'weekly', priority: 0.7 },
    { url: '/investor', changefreq: 'weekly', priority: 0.7 },
    { url: '/investor/', changefreq: 'weekly', priority: 0.7 },
    { url: '/login-user', changefreq: 'weekly', priority: 0.7 },
    { url: '/login', changefreq: 'weekly', priority: 0.7 },
    { url: '/register', changefreq: 'weekly', priority: 0.7 },
    { url: '/forgotPassword', changefreq: 'weekly', priority: 0.7 },
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
