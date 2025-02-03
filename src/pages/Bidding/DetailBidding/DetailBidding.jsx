import React, { useEffect, useState } from 'react';
import './DetailBidding.scss';
import { Container } from 'react-bootstrap';
import { RightOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import instance from '../../../utils/axios-customize';
import dayjs from 'dayjs';
import { getTimeLeft } from '../../../function/getTimeLeft';
export default function DetailBidding() {
    const { id } = useParams();
    const [bidding, setBidding] = useState({});
    // API EFFECT
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/get_detail_dauthau/${id}`);
                setBidding(data[0].dauthau);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [id]);
    const isTimeBefore = getTimeLeft(bidding.TimeOfBidClosing);
    return (
        <div style={{ marginBottom: '200px' }} className="bidding-detail">
            <Container>
                <div className="bidding-detail_breadcrumb">
                    <Link to={'/bidding?page=1&limit=10'} style={{ color: 'white', textDecoration: 'none' }}>
                        Thông báo mời báo thầu
                    </Link>
                    <RightOutlined style={{ color: 'white' }} />
                    <span>Thông tin nhà thầu</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', color: 'white' }}>
                        <h5 style={{ color: 'white', fontWeight: 600 }}>Thông tin cơ bản</h5>
                        {!isTimeBefore && (
                            <span
                                style={{
                                    fontSize: '95%',
                                    backgroundColor: 'red',
                                    padding: '2px',
                                    borderRadius: '5px',
                                }}
                            >
                                Đã hết hạn đăng ký
                            </span>
                        )}
                        {isTimeBefore && (
                            <p
                                style={{
                                    fontSize: '95%',
                                    backgroundColor: '#19c719',
                                    padding: '2px',
                                    borderRadius: '5px',
                                }}
                            >
                                {`Còn ${isTimeBefore.days} ngày, ${isTimeBefore.hours} giờ, ${isTimeBefore.minutes} phút để đăng ký`}
                            </p>
                        )}
                    </div>

                <section>
                    <div style={{ marginTop: '15px' }} className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Mã TBMT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.TenderID || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Ngày đăng tải</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {dayjs.utc(bidding?.TenderDocumentsSubmissionStartFrom).format('HH:MM DD/MM/YYYY') ||
                                    'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Lĩnh vực</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.Category || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Tên dự án</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.NameOfProject || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Tên gói thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.BiddingPackageName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Bên mời thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: '#3DB700' }}>{bidding?.BidSolicitor || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Chủ đầu tư</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: '#3DB700' }}>{bidding?.Investor || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Mã KHLCNT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ContractorSelectionPlanID || 'Chưa cập nhật'} </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Trong nước/ Quốc tế</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>Trong nước</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phân loại KHLCNT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.SpendingCategory || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Chi tiết nguồn vốn</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.CapitalSourceDetails || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phạm vi</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.Range || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phương thức lựa chọn nhà thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ContractorSelectionMethod || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Loại hợp đồng</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ContractType || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời gian thực hiện hợp đồng</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>Chưa cập nhật</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức LCNT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ContractorSelectionMethods || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thực hiện tại</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: '#3DB700' }}>{bidding?.ContractExecutionLocation || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời điểm đóng thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.TimeOfBidClosing).format('HH:mm DD/MM/YYYY') || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hiệu lực hồ sơ dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ValidityOfBidDocuments || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Lĩnh vực</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.BusinessLines || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Ngành nghề kinh doanh</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.BusinessLines || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Số quyết định phê duyệt</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ApprovalID || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </section>
                {/* Tham dự thầu */}
                <section style={{ marginTop: '30px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Tham dự thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.BiddingForm || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Nhận HSDT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                Từ {dayjs.utc(bidding?.PublicationDate).format('DD/MM/YYYY')} đến{' '}
                                {dayjs.utc(bidding?.TimeOfBidClosing).format('DD/MM/YYYY')}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phí nộp E-HSDT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>Chưa cập nhật</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm nhận E-HSDT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>Chưa cập nhật</p>
                        </div>
                    </div>
                </section>
                {/* Mở thầu */}
                <section style={{ marginTop: '30px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Mở thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời điểm mở thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.BidOpeningTime).format('HH:mm DD/MM/YYYY') || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm mở thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {bidding?.BidOpeningLocation ? (
                                    <a target="_blank" href={bidding.BidOpeningLocation}>
                                        {bidding.BidOpeningLocation}
                                    </a>
                                ) : (
                                    'Chưa cập nhật'
                                )}
                            </p>
                        </div>
                    </div>
                </section>
                <section style={{ marginTop: '30px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Bảo đảm dự thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức đảm bảo</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.NoticeType || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Số tiền đảm bảo</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.BidSecurityAmount || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Số tiền bằng chữ</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.AmountInWords || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời hạn đảm bảo</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.EndOfDate || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
}
