import { useEffect, useState } from 'react';
import { FaEye } from 'react-icons/fa';
import parse from 'html-react-parser';
import ReactPaginate from 'react-paginate';
import { getLatestNew } from '../../../services/api';
import img from '../../../assets/default-thumbnail.jpg';
import { message } from 'antd';
import { useNavigate, useSearchParams } from 'react-router-dom';
function HotNews() {
    const [articles, setArticles] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const navigate = useNavigate();
    const [searchParam, setSearchParam] = useSearchParams();
    const handlePageClick = async (e) => {
        const fetchApi = async () => {
            try {
                searchParam.set('page', e.selected + 1);
                setSearchParam(searchParam);
                const res = await getLatestNew(e.selected + 1);
                setArticles(res.data);
            } catch {
                message.error('Đã có lỗi xảy ra !');
            }
        };
        fetchApi();
    };
    useEffect(() => {
        const fetchApi = async () => {
            const page = searchParam.get('page');
            const res = await getLatestNew(page || 1);
            setArticles(res.data);
            setTotalPage(parseInt(Math.ceil(res.tong_page)));
        };
        fetchApi();
    }, []);
    const handleNavigate = (id) => {
        navigate(`/news/group/post/${id}`);
    };
    return (
        <div className="group-news">
            <ReactPaginate
                containerClassName="pagination-news"
                previousLabel="< Trước"
                nextLabel="Sau >"
                breakLabel="..."
                pageCount={totalPage}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                onPageChange={handlePageClick}
                activeClassName="pagination-news--active"
                initialPage={parseInt(searchParam.get('page') || 1) - 1}
            />
            <h4 className="text-white title">Các tin mới nhất</h4>
            <div className="list-articles">
                {articles.map((item, index) => (
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
                                    {parse(item.Content)}
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

export default HotNews;
