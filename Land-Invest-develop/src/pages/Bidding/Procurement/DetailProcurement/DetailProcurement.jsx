import { RightOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import instance from '../../../../utils/axios-customize';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getTimeLeft } from '../../../../function/getTimeLeft';

dayjs.extend(utc);
export default function DetailProcurement() {
    const [bidding, setBidding] = useState({});
    const { id } = useParams();
    useEffect(() => {
        (async () => {
            const { data } = await instance.get(`/get_detail_muasamcong/${id}`);
            setBidding(data[0].dauthau);
        })();
    }, [id]);
    const isTimeBefore = getTimeLeft(bidding.bidCloseDate);
    return (
        <div className="bidding-detail">
            <Container>
                <div className="bidding-detail_breadcrumb">
                    <Link
                        to={'/bidding/procurement?page=1&limit=10'}
                        style={{ color: 'white', textDecoration: 'none' }}
                    >
                        Thông báo mời báo thầu
                    </Link>
                    <RightOutlined style={{ color: 'white' }} />
                    <span>Thông tin nhà thầu</span>
                </div>
                {/* BASIC INFORMATIOn */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between',alignItems: 'center', marginBottom: '15px', color: 'white' }}>
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

                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Mã TBMT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.notifyNo || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Ngày đăng tải</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.publicDate).format('DD/MM/YYYY HH:mm') || 'Chưa có thông tin'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phiên bản thay đổi</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <span style={{ color: 'white' }}>{bidding?.notifyVersion || 'Chưa cập nhật'}</span>
                        </div>
                    </div>
                </section>
                {/* INFORMATION  KHLCNT */}
                <section style={{ marginTop: '15px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>
                        Thông tin chung của KHLCNT
                    </h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Mã KHLCNT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.planNo || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Phân loại KHLCNT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {bidding?.planType === 'TX' ? 'Chi thường xuyên' : bidding?.planType || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Tên dự toán mua sắm</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <span style={{ color: 'white' }}>{bidding?.bidName || 'Chưa cập nhật'}</span>
                        </div>
                    </div>
                </section>
                {/* INFORMATION BIDDING */}
                <section style={{ marginTop: '15px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Thông tin gói thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Quy trình áp dụng</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {bidding?.processApply === 'LDT'
                                    ? 'Luật đấu thầu'
                                    : bidding.processApply || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Tên gói thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.bidName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Chủ đầu tư</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>{bidding?.investorName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Bên mời thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>{bidding?.investorName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Chi tiết nguồn vốn</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>{bidding?.capitalDetail || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Lĩnh vực</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.investField === 'PTV'
                                    ? 'Phí Tư Vấn'
                                    : bidding?.investField || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức lựa chọn nhà thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.bidForm === 'DTRR'
                                    ? 'Đấu thầu rộng rãi'
                                    : bidding?.bidForm || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Loại hợp đồng</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.contractType === 'DGCD'
                                    ? 'Đơn giá cố định'
                                    : bidding?.bidForm || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Trong nước/ Quốc tế</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.isDomestic ? 'Trong nước' : 'Quốc tế' || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời gian thực hiện gói thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.contractPeriod || 'Chưa cập nhật'}{' '}
                                {bidding?.contractPeriodUnit === 'D' ? 'ngày' : 'tháng' || null}
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Gói thầu có nhiều phần/lô</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p style={{ color: 'white' }}>
                                {bidding?.isMultiLot ? bidding?.isMultiLot : 'Không' || 'Chưa cập nhật'}
                            </p>
                        </div>
                    </div>
                </section>
                {/* Bidding method */}
                <section style={{ marginTop: '15px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Cách thức dự thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.isInternet ? 'Qua mạng' : 'Trực tiếp' || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm phát hành e-HSMT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.issueLocation || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm thực hiện gói thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.ProvinceName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm nhận e-HSDT</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.issueLocation || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </section>
                {/* Bidding information */}
                <section style={{ marginTop: '30px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>Thông tin dự thầu</h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời điểm đóng thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.bidOpenDate).format('DD/MM/YYYY HH:mm') || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Thời điểm mở thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.bidCloseDate).format('DD/MM/YYYY HH:mm') || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Địa điểm mở thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.issueLocation || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hiệu lực hồ sơ dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {bidding?.bidValidityPeriod || 'Chưa cập nhật'}{' '}
                                {bidding?.bidValidityPeriodUnit === 'D' ? 'ngày' : 'tháng' || null}
                            </p>
                        </div>
                    </div>

                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Số tiền bảo đảm dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(
                                    bidding?.guaranteeValue,
                                ) || 'Chưa cập nhật'}{' '}
                                (Theo Điều 18 Nghị định 24/2024/NĐ-CP, nhà thầu có tên trong danh sách không bảo đảm uy
                                tín khi tham dự thầu, khi tham dự thầu phải thực hiện biện pháp bảo đảm dự thầu với giá
                                trị gấp 03 lần giá trị yêu cầu đối với nhà thầu khác trong thời hạn 02 năm kể từ lần
                                cuối cùng thực hiện các hành vi quy định tại khoản 1 Điều này.).
                            </p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Hình thức đảm bảo dự thầu</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.guaranteeForm}</p>
                        </div>
                    </div>
                </section>
                {/* Approval decision information */}
                <section style={{ marginTop: '30px', marginBottom: '200px' }}>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px' }}>
                        Thông tin quyết định phê duyệt
                    </h5>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Số quyết định phê duyệt</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.notifyNo || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div style={{ marginTop: '15px' }} className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Ngày phê duyệt</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{dayjs.utc(bidding?.publicDate).format('DD/MM/YYYY') || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                    <div className="bidding-detail_box">
                        <div className="bidding-detail_box_title">
                            <span style={{ color: 'white' }}>Cơ quan ban hành quyết định</span>
                        </div>
                        <div className="bidding-detail_box_content">
                            <p>{bidding?.procuringEntityName || 'Chưa cập nhật'}</p>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
}
