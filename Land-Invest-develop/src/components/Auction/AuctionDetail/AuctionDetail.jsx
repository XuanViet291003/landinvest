import { RightOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from 'react';
import { Container } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { formatToVND } from '../../../function/formatToVND';
import instance from '../../../utils/axios-customize';
import './AuctionDetail.scss';
import { getTimeLeft } from '../../../function/getTimeLeft';
import { IoTimeOutline } from 'react-icons/io5';
import { LayersControl, MapContainer, TileLayer } from 'react-leaflet';
import { getLocationByDistrict } from '../../../services/api';
import { calculateLocation } from '../../../function/calculateLocation';
import fetchProvinceName from '../../../function/findProvince';
import { useDispatch } from 'react-redux';
import { setCurrentLocation } from '../../../redux/search/searchSlice';

export default function AuctionDetail() {
    const { id } = useParams();
    const [auction, setAuction] = useState({});
    const hanoiCoordinate = [21.0285, 105.8542];
    const dispatch = useDispatch();
    const countdown = getTimeLeft(auction?.RegistrationEndTime);
    const mapRef = useRef(null);
    const { BaseLayer } = LayersControl;
    const [location, setLocation] = useState([21.0285, 105.8542]);
    const navigate = useNavigate();
    const latIndex = 0;
    const lngIndex = 1;

    const handleGotoLocation = () => {
        navigate(`/?vitri=${location[latIndex]},${location[lngIndex]}&zoom=13`);
    };

    // API EFFECT
    useEffect(() => {
        (async () => {
            try {
                const { data } = await instance.get(`/detail_info_daugia/${id}`);
                setAuction(data.data);
            } catch (error) {
                console.log(error);
            }
        })();
    }, [id]);

    useEffect(() => {
        (async () => {
            try {
                if (auction.DistrictID) {
                    const res = await getLocationByDistrict(auction.DistrictID);
                    const polygonData = res.districts_data.multipolygon?.[0];
                    const boundingBox = JSON.parse(res.districts_data.bounding_box);
                    const [lng, lat] = calculateLocation([
                        [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
                    ]);
                    const zoom = 13;
                    const info = await fetchProvinceName(lat, lng);
                    
                    mapRef.current?.setView([lat, lng], zoom);
                    setLocation([lat, lng]);
                    dispatch(
                        setCurrentLocation({
                            provinceName: info?.provinceName,
                            districtName: info?.districtName,
                            coordinates: polygonData ? polygonData : [],
                        }),
                    );
                }
            } catch (error) {
                console.log(error);
            }
        })();
    }, [auction]);

    return (
        <div className="auction-detail">
            <Container>
                <div className="auction-detail_breadcrumb">
                    <Link to={'/auctions'} style={{ color: 'white', textDecoration: 'none' }}>
                        Danh sách đấu giá
                    </Link>
                    <RightOutlined style={{ color: 'white' }} />
                    <span>Thông tin đấu giá</span>
                </div>
                <div className="auction-detail_title">
                    <p className="auction-detail_title_text">Thông tin đấu giá</p>
                </div>
                <h1 className="auction-detail_title-h1">{auction?.Title}</h1>
                <div className="auction-detail-time-remaining">
                    <div>
                        <IoTimeOutline size={20} className="auction-detail-time-remaining--icon" />
                        {`Còn ${countdown.days} ngày, ${countdown.hours} giờ, ${countdown.minutes} phút để đăng ký`}
                    </div>
                </div>
                <section>
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}>
                        Thông tin người có tài sản
                    </h5>
                    <div style={{ marginTop: '15px' }} className="auction-detail_box">
                        <div className="auction-detail_box_title">
                            <span style={{ color: 'white' }}>Tên người có tài sản</span>
                        </div>
                        <div className="auction-detail_box_content">
                            <p>{auction?.NamePropertyOwner}</p>
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
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}>
                        Thông tin đơn vị tổ chức đấu giá
                    </h5>
                    <div style={{ marginTop: '15px' }} className="auction-detail_box">
                        <div className="auction-detail_box_title">
                            <span style={{ color: 'white' }}>Bên tổ chức</span>
                        </div>
                        <div className="auction-detail_box_content">
                            <p style={{ color: '#3DB700' }}>{auction?.NameAuctionHouse}</p>
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
                    <h5 style={{ color: 'white', fontWeight: 600, marginBottom: '15px', marginTop: '15px' }}>
                        Thông tin việc đấu giá
                    </h5>
                    <div className="auction-detail_box">
                        <div className="auction-detail_box_title">
                            <span style={{ color: 'white' }}>Ngày công bố</span>
                        </div>
                        <div className="auction-detail_box_content">
                            <p>
                                {new Date(auction?.CreateAt).toLocaleString('vi-VN', {
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
                                {new Date(auction?.EventSchedule).toLocaleString('vi-VN', {
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
                            <p>{auction?.AuctionAddress}</p>
                        </div>
                    </div>
                </section>
                <section style={{ marginTop: '30px', marginBottom: '150px' }} className="auction-table">
                    <table className="auction-table_data" border="1">
                        <thead>
                            <tr style={{ height: '40px' }}>
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
                                <td>{auction?.NameProperty}</td>
                                <td style={{ textTransform: 'uppercase' }}>{auction?.NamePropertyOwner}</td>
                                <td>{formatToVND(auction?.OpenPrice)}</td>
                                <td>{auction?.DepositPrice}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div className="auction-detail_box" style={{ marginTop: '20px' }}>
                        <div className="auction-detail_box_title">
                            <span style={{ color: 'white' }}>Mô tả chi tiết</span>
                        </div>
                        <div className="auction-detail_box_content">
                            <p>{auction?.Description}</p>
                        </div>
                    </div>
                    <div className="auction-detail__time--list">
                        <div>
                            <div className="auction-detail_box">
                                <div className="auction-detail_box_title auction-time">
                                    <span style={{ color: 'white' }}>Ngày bắt đầu đăng ký</span>
                                </div>
                                <div className="auction-detail_box_content">
                                    <p>
                                        {new Date(auction?.RegistrationStartTime).toLocaleString('vi-VN', {
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
                                <div className="auction-detail_box_title auction-time">
                                    <span style={{ color: 'white' }}>Ngày kết thúc đăng ký</span>
                                </div>
                                <div className="auction-detail_box_content">
                                    <p>
                                        {new Date(auction?.RegistrationEndTime).toLocaleString('vi-VN', {
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
                                <div className="auction-detail_box_title auction-time">
                                    <span style={{ color: 'white' }}>Thời gian bắt đầu nộp tiền đặt trước</span>
                                </div>
                                <div className="auction-detail_box_content">
                                    <p>
                                        {new Date(auction?.DepositPaymentStartTime).toLocaleString('vi-VN', {
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
                                <div className="auction-detail_box_title auction-time">
                                    <span style={{ color: 'white' }}>Thời gian kết thúc nộp tiền đặt trước</span>
                                </div>
                                <div className="auction-detail_box_content">
                                    <p>
                                        {new Date(auction?.DepositPaymentEndTime).toLocaleString('vi-VN', {
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
                        </div>
                        <div className="auction-map" onClick={handleGotoLocation}>
                            <MapContainer
                                center={hanoiCoordinate}
                                zoom={13}
                                ref={mapRef}
                                style={{ height: '100%', width: '100%' }}
                            >
                                <LayersControl>
                                    <BaseLayer checked name="Map mặc định">
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                    </BaseLayer>
                                    <BaseLayer name="Map vệ tinh">
                                        <TileLayer
                                            url="http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                                            attribution='&copy; <a href="https://maps.google.com">Google Maps</a> contributors'
                                            subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                                        />
                                    </BaseLayer>
                                </LayersControl>
                            </MapContainer>
                            <span className="auction-map__notify">Nhấn để tới vị trí này</span>
                        </div>
                    </div>
                </section>
            </Container>
        </div>
    );
}
