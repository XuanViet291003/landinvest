import { Link, useParams, useSearchParams } from 'react-router-dom';
import './PostNews.scss';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { getCommentsByIdPost, getDetaitPostById, postComment } from '../../../services/api';
import { Button, Image, message, Upload } from 'antd';
import img from '../../../assets/default-image-user.png';
import Editor from '../ModalCreateNew/Editor';
import { useSelector } from 'react-redux';
import { UploadOutlined } from '@ant-design/icons';
import parse from 'html-react-parser';
import { FaReplyAll } from 'react-icons/fa6';
import { comment } from 'postcss';
const props = {
    multiple: true,
    accept: 'image/*',
    beforeUpload: (file) => {
        return false;
    },
    onRemove: (file) => {},
};
const hanleCovert = (string) => {
    const temp = string
        .replaceAll('[img]', '<img src="')
        .replaceAll('[/img]', '"/>')
        .replaceAll('[', '<')
        .replaceAll(']', '>');
    return temp;
};
function PostNews() {
    const [loading, setLoading] = useState(false);
    const { id } = useParams();
    const [totalPage, setTotalPage] = useState(0);
    const [listComments, setListComments] = useState([]);
    const [content, setContent] = useState('');
    const dataUser = useSelector((state) => state.account.dataUser.userData);
    const [fileList, setFileList] = useState([]);
    const userId = localStorage.getItem('user_id');
    const elementMove = useRef();
    const [searchParam, setSearchParam] = useSearchParams();
    const [detail, setDetail] = useState({ Content: '' });
    const handleChangePage = async (e) => {
        try {
            searchParam.set('page', e.selected + 1);
            setSearchParam(searchParam);
            const res = await getCommentsByIdPost(id, e.selected + 1);
            console.log(res);
            const newData = res.data.map((item) => {
                const content = item.content.split('[/QUOTE]');
                const time = item.actionAt;
                const date = new Date(time);
                const dateString = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
                    date.getMonth() + 1
                }/${date.getFullYear()}`;
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
            setListComments(newData);
        } catch {
            message.error('Đã có lỗi xảy ra !');
        }
    };
    const handleSubmit = async () => {
        setLoading(true);
        if (content == '') {
            message.error('Vui lòng nội dung !');
            setLoading(false);
            return;
        }
        const data = new FormData();
        fileList.forEach((file) => {
            data.append('Images', file.originFileObj);
        });
        data.append('content', content);
        const res = await postComment(userId, id, data);
        if (res) {
            message.success('Đăng lên thành công !');
            const date = new Date();
            const dateString = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
                date.getMonth() + 1
            }/${date.getFullYear()}`;
            const newData = [
                {
                    avatar: dataUser.avatarLink,
                    username: dataUser.Username,
                    idComment: res.CommentID,
                    idUser: userId,
                    content: content,
                    image: res.comment.map((image) => ({
                        CommentID: image.CommentID,
                        PhotoURL: image.PhotoURL.replace('comment', 'post'),
                    })),
                    actionAt: dateString,
                },
                ...(listComments.length >= 10 ? listComments.slice(0, -1) : listComments),
            ].map((item) => {
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
                };
            });
            setListComments(newData);
            setContent('');
            setFileList([]);
        } else {
            message.error('Đã có lỗi xảy ra !');
        }
        setLoading(false);
    };
    const handleReply = (comment) => {
        elementMove.current.scrollIntoView({ behavior: 'smooth' });
        const content = `[QUOTE="${comment.username}"]${comment.content}[/QUOTE]`;
        setContent(content);
    };
    useEffect(() => {
        (async () => {
            try {
                const page = searchParam.get('page');
                const pageOne = await getCommentsByIdPost(id, page || 1);
                if (pageOne.message !== 'No comment') {
                    setTotalPage(Math.ceil(pageOne.tongsotrang));
                    const newData = pageOne.data.map((item) => {
                        const content = item.content.split('[/QUOTE]');
                        const time = item.actionAt;
                        const date = new Date(time);
                        const dateString = `${date.getHours()}:${date.getMinutes()}  ${date.getDate()}/${
                            date.getMonth() + 1
                        }/${date.getFullYear()}`;
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
                    setListComments(newData);
                }
            } catch {
                message.error('Đã xảy ra lỗi !');
            }
        })();
    }, []);
    useEffect(() => {
        (async () => {
            const res = await getDetaitPostById(id);
            setDetail(res[0]);
        })();
    }, [id]);
    console.log('detail', detail);
    return (
        <div className="post-news">
            <h4 className="post-news__title">{detail?.Title}</h4>
            <p className="post-news__content">{parse(hanleCovert(detail?.Content || ''))}</p>
            {totalPage > 0 && (
                <ReactPaginate
                    containerClassName="pagination-news"
                    previousLabel="< Trước"
                    nextLabel="Sau >"
                    breakLabel="..."
                    pageCount={totalPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handleChangePage}
                    activeClassName="pagination-news--active"
                    initialPage={parseInt(searchParam.get('page') || 1) - 1}
                />
            )}
            {totalPage > 0 ? (
                <div className="list-comment">
                    {listComments.map((comment) => (
                        <div className="list-comment__item" key={'comment-' + comment.idComment}>
                            <img className="avatar-username" src={comment.avatar || img} />
                            <div className="comment-content">
                                <div className="comment-content__info">
                                    <h4 className="comment-content__username">
                                        <Link to={`/news/list-post/${comment.idUser}/${comment.username}`}>
                                            {comment.username}
                                        </Link>
                                    </h4>
                                    <p className="comment-content__time">{comment.actionAt}</p>
                                </div>
                                {comment.reply && (
                                    <div className="comment-reply">
                                        <div className="comment-reply__header">
                                            <FaReplyAll style={{ color: 'white' }} />
                                            <p>{comment.userNameReply} nói :</p>
                                        </div>
                                        <div className="comment-reply__content">{parse(comment.reply)}</div>
                                    </div>
                                )}
                                <div className="comment-content__text">{parse(hanleCovert(comment.content))}</div>
                                <div className="comment-content__image">
                                    <Image.PreviewGroup>
                                        {comment.image.map((item, index) => (
                                            <Image key={index} className="image-view" src={item.PhotoURL} height={50} />
                                        ))}
                                    </Image.PreviewGroup>
                                </div>
                                <Button
                                    onClick={() => handleReply(comment)}
                                    style={{ float: 'right', margin: '10px' }}
                                    icon={<FaReplyAll />}
                                >
                                    Trả lời
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-white mt-2 mb-5 text-center">Chưa có comment nào hết !</div>
            )}
            {dataUser && (
                <div className="add-post" ref={elementMove}>
                    <img className="avatar-username m-3" src={dataUser.avatarLink || img} />
                    <div className="content-post">
                        <h5 className="content-post__username">{dataUser.Username}</h5>
                        <Editor content={content} setContent={setContent} className="custom" />
                        <Upload
                            {...props}
                            listType="picture-card"
                            onPreview={() => {}}
                            fileList={fileList}
                            onChange={(newFiles) => setFileList(newFiles.fileList)}
                            className="custom-upload"
                        >
                            <UploadOutlined style={{ fontSize: '30px', opacity: '0.7', color: 'white' }} />
                        </Upload>
                        <Button
                            type="primary"
                            className="custom-button"
                            onClick={handleSubmit}
                            loading={loading}
                            disabled={loading}
                        >
                            Đăng
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PostNews;
