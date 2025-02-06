import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Notification.scss';
const ListItem = (props) => {
    let { listItems, visibleItems } = props;
    return (
        <>
            {listItems &&
                listItems.length > 0 &&
                listItems.map((item) => {
                    let badgeName = item.trangThai === 'Đã bàn giao' ? 'bg-success' : 'bg-primary';
                    return (
                        <div className="container my-3 mt-4" style={{ backgroundColor: '#343a40' }} key={item.id}>
                            <div className="card mb-2r project-card shadow rounded" style={{ border: 'none' }}>
                                <div className="row" style={{ backgroundColor: '#343a40' }}>
                                    <div className="col-md-3 overflow-hidden img-list">
                                        <Link
                                            to={`/detail_du_an/${item.id}`}
                                            state={{ image: item.image }}
                                            style={{ textDecoration: 'none', color: '#000' }}
                                        >
                                            <img
                                                src={item.image}
                                                className="image-card"
                                                loading="lazy"
                                                alt={item.tenDuAn}
                                            />
                                        </Link>
                                    </div>

                                    <div className="col-md-9">
                                        <div className="card-body card-body-container">
                                            <span className={`badge ${badgeName} ms-auto bd-highlight fw-500 mb-2`}>
                                                {item.trangThai}
                                            </span>
                                            <Link
                                                to={`/detail_du_an/${item.id}`}
                                                style={{ textDecoration: 'none', color: '#000' }}
                                            >
                                                <h2 className="card-title">{item.tenDuAn}</h2>
                                            </Link>
                                            <p className="card-text mt-1">
                                                <small className="">
                                                    <span>Chủ đầu tư: </span>
                                                    {item.chuDauTu}
                                                </small>
                                            </p>
                                            <p className="card-text mt-1">
                                                <small className="">
                                                    <span> Công ty thiết kế: </span>
                                                    {item.congTyThietKe}
                                                </small>
                                            </p>
                                            <p className="card-text mt-1">
                                                <small className="">
                                                    <span>Loại hình: </span>
                                                    {item.loaiHinh}
                                                </small>
                                            </p>
                                            {/* <p className="card-text mt-1">
                                                <small className="">
                                                    <span>Diện tích: </span>
                                                    {item.dienTich}
                                                </small>
                                            </p> */}
                                            {/* <p className="card-text mt-1">
                                                <small className="fw-bold">Mật độ xây dựng: {item.matDoXayDung}</small>
                                            </p>
                                            <p className="card-text mt-1">
                                                <small className="fw-bold">Khởi công: {item.khoiCong}</small>
                                            </p>
                                            <p className="card-text mt-1">
                                                <small className="fw-bold">
                                                    Bàn giao dự kiến: {item.banGiaoDuKien}
                                                </small>
                                            </p> */}
                                            <p className="card-text mt-2">
                                                <small className="fw-bold color-1 card-format">
                                                    <FaMapMarkerAlt className="card-icon-marker" />
                                                    <span>
                                                        Xã: {item.xaPhuong || 'Chưa cập nhật'}, {item.viTri}
                                                    </span>
                                                </small>
                                            </p>
                                            <p className="card-text">
                                                <Link
                                                    to={{ pathname: `/detail_du_an/${item.id}` }}
                                                    className="small text-danger text-decoration-underline"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

            {/* {listItems.length > visibleItems && (
                <div className="text-center mt-3">
                    <button onClick={props.loadMoreItems} className="btn btn-primary">
                        Xem thêm...
                    </button>
                </div>
            )} */}
        </>
    );
};
export default ListItem;
