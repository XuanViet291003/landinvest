import { Modal } from 'antd';
import React, { memo, useState } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';
import { getTimeLeft } from '../../function/getTimeLeft';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { RightOutlined } from '@ant-design/icons';
import { IoTimeOutline } from 'react-icons/io5';
import { formatToVND } from '../../function/formatToVND';

const LandAuctionDetail = ({ item }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const countdown = getTimeLeft(item?.RegistrationEndTime);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };


    return (
        <div className="land-cost-description-container">
            <p className="land-cost-detail-stt" onClick={showModal}>
                {item.STT}
            </p>
            {/* <span className="land-cost-detail" ></span> */}
            <Modal
                zIndex={9999}
                closable={false}
                footer={<></>}
                open={isModalOpen}
                width={'90vw'}
                centered
                onOk={handleOk}
                onCancel={handleCancel}
                className="land-cost-description-modal"
            >
                <div className="land-const-detail__wrapper">
                    <div className="lant-cost-detail__header">
                        <span></span>
                        <span className="lant-cost-detail__header--title">Chi tiết</span>
                        <FaCircleMinus
                            color="#fff"
                            fontSize={24}
                            className="lant-cost-detail__header--icon"
                            onClick={handleCancel}
                        />
                    </div>
                    <div className="auction-detail">
                        <Container>
                            <div className="auction-detail_title">
                                <p className="auction-detail_title_text">Thông tin đấu giá</p>
                            </div>
                            <h1 className="auction-detail_title-h1">{item?.Title}</h1>
                            <div className="auction-detail-time-remaining">
                                <div>
                                    <IoTimeOutline size={20} className="auction-detail-time-remaining--icon" />
                                    {countdown &&
                                        `Còn ${countdown.days} ngày, ${countdown.hours} giờ, ${countdown.minutes} phút để đăng ký`}
                                    {!countdown && `Đã hết hạn đăng ký`}
                                </div>
                            </div>
                            <section>
                                <h5
                                    style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}
                                >
                                    Thông tin người có tài sản
                                </h5>
                                <div style={{ marginTop: '15px' }} className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Tên người có tài sản</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>{item?.NamePropertyOwner}</p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Địa chỉ</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p style={{ color: '#3DB700' }}></p>
                                    </div>
                                </div>
                            </section>
                            <section style={{ marginTop: '30px', marginBottom: '0px' }} className="auction-table">
                                <h5
                                    style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}
                                >
                                    Thông tin đơn vị tổ chức đấu giá
                                </h5>
                                <div style={{ marginTop: '15px' }} className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Bên tổ chức</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p style={{ color: '#3DB700' }}>{item?.NameAuctionHouse}</p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Địa chỉ</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p></p>
                                    </div>
                                </div>
                            </section>
                            <section style={{ marginTop: '30px', marginBottom: '0px' }} className="auction-table">
                                <h5
                                    style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}
                                >
                                    Thông tin việc đấu giá
                                </h5>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Ngày công bố</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.CreateAt).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Ngày đấu giá</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.EventSchedule).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Địa điểm tổ chức đấu giá</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>{item?.AuctionAddress}</p>
                                    </div>
                                </div>
                            </section>
                            <section style={{ marginTop: '30px', marginBottom: '150px' }} className="auction-table">
                                <table className="auction-table_data" border="1">
                                    <thead>
                                        <tr style={{ height: '80px' }}>
                                            <th className="auction-table_th">STT</th>
                                            <th>Tên tài sản</th>
                                            <th>Nơi có tài sản</th>
                                            <th>Giá khởi điểm</th>
                                            <th>Giá đặt trước</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr style={{ cursor: 'pointer', height: '100px' }}>
                                            <td>1</td>
                                            <td>{item?.NameProperty}</td>
                                            <td style={{ textTransform: 'uppercase' }}>{item?.NamePropertyOwner}</td>
                                            <td>{formatToVND(item?.OpenPrice)}</td>
                                            <td>{item?.DepositPrice}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="auction-detail_box" style={{ marginTop: '20px' }}>
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Mô tả chi tiết</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>{item?.Description}</p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Ngày bắt đầu đăng ký</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.RegistrationStartTime).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Ngày kết thúc đăng ký</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.RegistrationEndTime).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Thời gian bắt đầu nộp tiền đặt trước</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.DepositPaymentStartTime).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                                <div className="auction-detail_box">
                                    <div className="auction-detail_box_title">
                                        <span style={{ color: 'white' }}>Thời gian kết thúc nộp tiền đặt trước</span>
                                    </div>
                                    <div className="auction-detail_box_content">
                                        <p>
                                            {new Date(item?.DepositPaymentEndTime).toLocaleString('vi-VN', {
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour12: false,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </section>
                        </Container>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default memo(LandAuctionDetail);
