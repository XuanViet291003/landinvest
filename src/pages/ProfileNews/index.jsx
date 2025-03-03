import { Col, Image, message, Row } from 'antd';
import { useEffect, useState } from 'react';
import { getDataUserById, getListNewsByIdUser } from '../../services/api';
import { Link, useParams } from 'react-router-dom';
import { InfoItem } from '../ProfileUser/UserProfile';
import ReactPaginate from 'react-paginate';
const formatDateHour = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}  ${day}/${month}/${year}`;
};
const convertDatetoString = (date) => {
    const dateTime = new Date(date);
    return `${dateTime.getHours()}:${dateTime.getMinutes()} ${dateTime.getDate()}/${
        dateTime.getMonth() + 1
    }/${dateTime.getFullYear()}`;
};
const iconAvatar =
    'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg';
function ProFileNews() {
    const [news, setNews] = useState([]);
    const { id } = useParams();
    const [totalPage, setTotalPage] = useState(null);
    const [dataUser, setDataUser] = useState({});
    console.log(id);
    useEffect(() => {
        try {
            (async () => {
                const response = await getListNewsByIdUser(id, 1);
                const resUser = await getDataUserById(id);
                console.log(resUser);
                setDataUser(resUser.data);
                setNews(response.data);
                setTotalPage(Math.ceil(response.numberPage));
            })();
        } catch (error) {
            message.error('Đã có lôi xảy ra !');
            console.error(error);
        }
    }, []);
    return (
        <>
            <Row style={{ paddingTop: '20px' }} gutter={[16, 16]}>
                <Col span={8} style={{ paddingLeft: '20px' }}>
                    <div className="user-profile">
                        <div className="profile-header">
                            <img src={dataUser.avatarLink || iconAvatar} alt="User Avatar" className="avatar" />
                            <h1 className="full-name">{dataUser.FullName}</h1>
                        </div>
                        <div className="profile-content">
                            <div className="bio">{dataUser.Bio}</div>
                            <div className="info-user">
                                <InfoItem label="Email" value={dataUser.Email} icon="📧" />
                                <InfoItem
                                    label="Ngày sinh"
                                    value={formatDateHour(dataUser.BirthDate || '')}
                                    icon="🎂"
                                />
                                <InfoItem label="Địa chỉ" value={dataUser.BirthPlace} icon="🏠" />
                                <InfoItem label="Giới tính" value={dataUser.Gender} icon="⚧" />
                                <InfoItem label="Điện thoại" value={dataUser.Phone} icon="📱" />
                            </div>
                        </div>
                    </div>
                </Col>
                <Col span={16} style={{ paddingRight: '20px' }}>
                    <div className="main-post">
                        <h4 className="main-post__title">Các bài viết của {dataUser.Username} : </h4>
                        {totalPage > 0 && (
                            <ReactPaginate
                                containerClassName="pagination-news"
                                previousLabel="<"
                                nextLabel=">"
                                breakLabel="..."
                                pageCount={totalPage}
                                marginPagesDisplayed={2}
                                pageRangeDisplayed={3}
                                //onPageChange={handleChangePage}
                                activeClassName="pagination--active"
                                selected={1}
                            />
                        )}
                        {totalPage ? <></> : <h5 className="text-notify">Chưa có bài viết nào !</h5>}
                        {totalPage ? (
                            <div className="list-post">
                                {news.map((item, index) => (
                                    <div className="post--item" key={`list-post__${index}`}>
                                        <div className="post--item__time">
                                            Ngày đăng : {convertDatetoString(item.PostTime)}
                                        </div>
                                        <Link to={`/news/group/post/${item.PostID}`}>
                                            <div className="post--item__title">Tiêu đề : {item.Title}</div>
                                        </Link>
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
                </Col>
            </Row>
        </>
    );
}

export default ProFileNews;
