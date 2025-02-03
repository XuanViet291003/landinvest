import { useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getGroupByPage } from '../../../services/api';
import ReactPaginate from 'react-paginate';
import { FaEye } from 'react-icons/fa';
import './GroupNews.scss';
import ModalNotification from '../../Auth/ModalNotification';
import { useSelector } from 'react-redux';
import ModalCreateNew from '../ModalCreateNew';
import ModalEditNew from '../ModalEditNew';
import { message } from 'antd';
import parse from 'html-react-parser';
function GroupNews() {
    const [articles, setArticles] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const { id } = useParams();
    const navigate = useNavigate();
    const dataUser = useSelector((state) => state.account.dataUser);
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [isShowModalCreate, setIsShowModalCreate] = useState(false);
    const [isShowModalEdit, setIsShowModalEdit] = useState(false);
    const [news, setNews] = useState({});
    const handlePageClick = async (e) => {
        const fetchApi = async () => {
            try {
                const res = await getGroupByPage(id, e.selected + 1);
                setArticles(res.data);
            } catch {
                message.error('Đã có lỗi xảy ra !');
            }
        };
        fetchApi();
    };
    const handleCreate = () => {
        if (!isAuthenticated) {
            setIsShowModalLogin(true);
        } else {
            setIsShowModalCreate(true);
        }
    };
    const handleNavigate = (id) => {
        navigate(`/news/group/post/${id}`);
    };
    useLayoutEffect(() => {
        const fetchApi = async () => {
            const res = await getGroupByPage(id, 1);
            setArticles(res.data);
            setTotalPage(parseInt(Math.ceil(res.total_page)));
        };
        fetchApi();
    }, []);
    console.log(dataUser);
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
                activeClassName="pagination--active"
            />
            <button className=" button-create" onClick={handleCreate}>
                Tạo bài viết
            </button>
            <h4 className="text-white title">Các bài viết</h4>
            <div className="list-articles">
                {articles.map((item, index) => (
                    <div
                        style={{ cursor: 'pointer' }}
                        className="d-flex flex-column justify-content-center align-items-center "
                        onClick={() => handleNavigate(item.PostID)}
                    >
                        <div key={index} className="list-articles__item">
                            <div className="avatar">
                                <img src={item.Images[0]?.link_image} alt="avatar" />
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
                            {dataUser.UserID === item.UserID && (
                                <div className="action">
                                    <button
                                        className="button-edit"
                                        onClick={() => {
                                            setIsShowModalEdit(true);
                                            setNews({
                                                title: item.Title,
                                                content: item.Content,
                                                id: item.PostID,
                                                images: item.Images,
                                            });
                                        }}
                                    >
                                        Sửa
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="line"></div>
                    </div>
                ))}
            </div>
            <ModalNotification
                show={isShowModalLogin}
                handleClose={() => {
                    setIsShowModalLogin(false);
                }}
            />
            <ModalCreateNew
                isShowModalCreate={isShowModalCreate}
                setIsShowModalCreate={setIsShowModalCreate}
                groupId={id}
                setArticles={setArticles}
            />
            <ModalEditNew
                isShowModalEdit={isShowModalEdit}
                setIsShowModalEdit={setIsShowModalEdit}
                news={news}
                setArticles={setArticles}
            />
        </div>
    );
}

export default GroupNews;
