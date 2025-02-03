import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPostByUserId } from '../../../services/api';
import './ListPostUser.scss';
import ReactPaginate from 'react-paginate';
import { Image } from 'antd';
const convertDatetoString = (date) => {
    const dateTime = new Date(date);
    return `${dateTime.getHours()}:${dateTime.getMinutes()} ${dateTime.getDate()}/${
        dateTime.getMonth() + 1
    }/${dateTime.getFullYear()}`;
};
function ListPostUser() {
    const { id, username } = useParams();
    const [listPost, setListPost] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const handleChangePage = (e) => {
        (async () => {
            const res = await getPostByUserId(id, e.selected + 1);
            setListPost(res.data);
        })();
    };
    useEffect(() => {
        (async () => {
            console.log(id);
            const res = await getPostByUserId(id, 1);
            setListPost(res.data);
            setTotalPage(Math.ceil(res.numberPage));
        })();
    }, []);
    return (
        <div className="main-post">
            <h4 className="main-post__title">Các bài viết của {username} : </h4>
            {totalPage > 0 && (
                <ReactPaginate
                    containerClassName="pagination"
                    previousLabel="<"
                    nextLabel=">"
                    breakLabel="..."
                    pageCount={totalPage}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={3}
                    onPageChange={handleChangePage}
                    activeClassName="pagination--active"
                    selected={1}
                />
            )}
            {totalPage ? <></> : <h5 className="text-notify">Chưa có bài viết nào !</h5>}
            {totalPage ? (
                <div className="list-post">
                    {listPost.map((item, index) => (
                        <div className="post--item" key={`list-post__${index}`}>
                            <div className="post--item__time">Ngày đăng : {convertDatetoString(item.PostTime)}</div>
                            <div className="post--item__title">Tiêu đề : {item.Title}</div>
                            <div className="post--item__content">{item.Content}</div>
                            <div className="post--item__hastag">
                                Hastag :{' '}
                                {item.Hastag.map((item) => (
                                    <Link>{item}</Link>
                                ))}
                            </div>
                            <div style={{ marginLeft: '10px', paddingBottom: '15px' }}>
                                <Image.PreviewGroup>
                                    {item.Images.map((item) => (
                                        <Image className="custom-show-image" src={item}></Image>
                                    ))}
                                </Image.PreviewGroup>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}

export default ListPostUser;
