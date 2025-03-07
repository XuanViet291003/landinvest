import { useState, useEffect } from 'react';
import { getBoxNews } from '../../../services/api';
import BoxNewsItem from '../BoxNewsItem';
function BoxNews() {
    const [boxNews, setBoxNews] = useState([]);
    useEffect(() => {
        const fetchApi = async () => {
            const res = await getBoxNews();
            setBoxNews(res);
        };
        fetchApi();
    }, []);
    return (
        <>
            {boxNews.map((item, index) => (
                <BoxNewsItem data={item} key={index} />
            ))}
        </>
    );
}

export default BoxNews;
