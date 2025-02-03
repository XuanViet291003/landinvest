import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { searchPost } from '../../../services/api';
import { message } from 'antd';
import { FaEye, FaReplyAll } from 'react-icons/fa';
import parse from 'html-react-parser';
import ReactPaginate from 'react-paginate';
import './SearchNews.scss';
const hanleCovert = (string) => {
    const temp = string
        .replaceAll('[img]', '<img src="')
        .replaceAll('[/img]', '"/>')
        .replaceAll('[', '<')
        .replaceAll(']', '>');
    return temp;
};
function SearchNews() {
    const { key } = useParams();
    const [listComment, setListComment] = useState([]);
    const [listPost, setListPost] = useState([]);
    const [totalPage, setTotalPage] = useState({});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handlePageClick = async (e) => {
        setLoading(true);
        try {
            const data = await searchPost(key, e.selected + 1);
            setTotalPage(Math.ceil(data.post.so_page_post));
            const newData = data.comment.list_comment.map((item) => {
                const time = item.actionAt;
                const date = new Date(time);
                const dateString = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
                    date.getMonth() + 1
                }/${date.getFullYear()}`;
                const content = item.content.split('[/QUOTE]');
                let reply = '',
                    userNameReply = '';
                if (content.length >= 2) {
                    reply = content[0].split('"]')[1];
                    userNameReply = content[0].split('"]')[0].split('[QUOTE="')[1];
                }
                return {
                    ...item,
                    content: content.length >= 2 ? content[1] : content[0],
                    reply,
                    userNameReply,
                    actionAt: dateString,
                };
            });
            setListComment(newData);
            setListPost(data.post.list_post);
        } catch (e) {
            message.error('Đã xảy ra lỗi !');
        }
        setLoading(false);
    };
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const data = await searchPost(key);
                setTotalPage(Math.ceil(data.post.so_page_post));
                const newData = data.comment.list_comment.map((item) => {
                    const time = item.actionAt;
                    const date = new Date(time);
                    const dateString = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
                        date.getMonth() + 1
                    }/${date.getFullYear()}`;
                    const content = item.content.split('[/QUOTE]');
                    let reply = '',
                        userNameReply = '';
                    if (content.length >= 2) {
                        reply = content[0].split('"]')[1];
                        userNameReply = content[0].split('"]')[0].split('[QUOTE="')[1];
                    }
                    return {
                        ...item,
                        content: content.length >= 2 ? content[1] : content[0],
                        reply,
                        userNameReply,
                        actionAt: dateString,
                    };
                });
                setListComment(newData);
                setListPost(data.post.list_post);
                setLoading(false);
            } catch (e) {
                message.error('Đã xảy ra lỗi !');
            }
        })();
    }, []);
    return (
        <>
            <div className="search-news">
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
                {!loading ? (
                    <>
                        <div className="group-news" style={{ paddingBottom: '10px' }}>
                            <h4 className="text-white title">Các bài viết</h4>
                            <div className="list-articles">
                                {listPost.map((item, index) => (
                                    <div
                                        key={'post-search--' + item.PostID}
                                        style={{ cursor: 'pointer' }}
                                        className="d-flex flex-column justify-content-center align-items-center "
                                        onClick={() => {
                                            navigate(`/news/group/post/${item.PostID}`);
                                        }}
                                    >
                                        <div key={index} className="list-articles__item">
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
                                                {item.view}
                                            </div>
                                        </div>
                                        <div className="line"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="list-comment">
                            <h4 className="text-white title">Các bình luật liên quan</h4>
                            {listComment.map((comment) => (
                                <div
                                    className="list-comment__item"
                                    style={{ cursor: 'pointer' }}
                                    key={`commet-search--${comment.id}`}
                                    onClick={() => {
                                        navigate(`/news/group/post/${comment.idPost}`);
                                    }}
                                >
                                    <div className="comment-content">
                                        <div className="comment-content__info" style={{ margin: '10px' }}>
                                            <p className="comment-content__time">{comment.actionAt}</p>
                                        </div>
                                        {comment.reply && (
                                            <div className="comment-reply">
                                                <div className="comment-reply__header">
                                                    <FaReplyAll style={{ color: 'white' }} />
                                                    <p>{comment.userNameReply} nói :</p>
                                                </div>
                                                <div className="comment-reply__content">
                                                    {parse(hanleCovert(comment.reply))}
                                                </div>
                                            </div>
                                        )}
                                        <div className="comment-content__text">
                                            {parse(hanleCovert(comment.content))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <p className="text-loading">Đang tải ....</p>
                )}
            </div>
        </>
    );
}

export default SearchNews;
