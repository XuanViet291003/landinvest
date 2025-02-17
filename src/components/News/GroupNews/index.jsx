import { useLayoutEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page")) || 1;

    // const handlePageClick = async (e) => {
    //     const fetchApi = async () => {
    //         try {
    //             const res = await getGroupByPage(id, e.selected + 1);
    //             setArticles(res.data);
    //         } catch {
    //             message.error('Đã có lỗi xảy ra !');
    //         }
    //     };
    //     fetchApi();
    // };

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
            const res = await getGroupByPage(id, currentPage);
            setArticles(res.data);
            setTotalPage(parseInt(Math.ceil(res.total_page)));
        };
        fetchApi();
    }, []);
    // console.log(dataUser);

  // Hàm xử lý chuyển trang (dựa trên URL query)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPage) {
      setSearchParams({ page: page.toString() });
    }
  };

  // Hàm render số trang (1, ... , n)
  const renderPaginationNumbers = () => {
      let pages = [];
      if (totalPage <= 5) {
        for (let i = 1; i <= totalPage; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPage - 1, currentPage + 1);

        if (startPage > 2) {
          pages.push("...");
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }

        if (endPage < totalPage - 1) {
          pages.push("...");
        }
        pages.push(totalPage);
      }
      return pages;
    };

    return (
        <div className="group-news">
            <ul className="pagination">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  «
                </button>
              </li>
              {renderPaginationNumbers().map((page, index) =>
                page === "..." ? (
                  <li key={index} className="dots">
                    ...
                  </li>
                ) : (
                  <li key={index}>
                    <button
                      className={currentPage === page ? "active" : ""}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </button>
                  </li>
                )
              )}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPage}
                >
                  »
                </button>
              </li>
            </ul>
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
