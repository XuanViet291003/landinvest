import { useEffect, useState } from 'react';
import { getLatestPost } from '../../../services/api';
import { FaEye } from 'react-icons/fa';
import parse from 'html-react-parser';
import { useNavigate } from 'react-router-dom';
import img from '../../../assets/default-thumbnail.jpg';
const hanleCovert = (string) => {
    const temp = string
        .replaceAll('[img]', '<img src="')
        .replaceAll('[/img]', '"/>')
        .replaceAll('[', '<')
        .replaceAll(']', '>');
    return temp;
};
function LastNews() {
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        (async () => {
            const res = await getLatestPost();
            setPosts(res.data);
        })();
    }, []);
    const handleNavigate = (id) => {
        navigate(`/news/group/post/${id}`);
    };
    return (
        <div className="group-news">
            <h4 className="text-white title">Các bài viết mới nhất</h4>
            <div className="list-articles">
                {posts.map((item, index) => (
                    <div
                        style={{ cursor: 'pointer' }}
                        className="d-flex flex-column justify-content-center align-items-center "
                        onClick={() => handleNavigate(item.PostID)}
                    >
                        <div key={index} className="list-articles__item">
                            <div className="avatar">
                                <img src={item.Images[0]?.link_image || img} alt="avatar" />
                            </div>
                            <div className="content">
                                <h5 className="text-white" style={{ fontSize: '16px' }}>
                                    {item.Title}
                                </h5>
                                <p className="text-secondary" style={{ fontSize: '12px' }}>
                                    {parse(hanleCovert(item.Content))}
                                </p>
                            </div>
                            <div className="view text-white">
                                <FaEye size={24} />
                                {item.timeView}
                            </div>
                        </div>
                        <div className="line"></div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default LastNews;
