import { message } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import { useDispatch } from 'react-redux';
import { LAND_AUCTION_KEYS, TAB_KEYS } from '../../constants/LandAuctionKey';
import { handleChangeMapByLocation } from '../../function/map/changeMapByLocation';
import { searchLandAuctionsInfoApi, setCurrentPage, setTabKey } from '../../redux/LandAuctions/landAuctions';
import { fetchDistrictsByProvinces, fetchOrganization, fetchProvinces, getLandAuctionsTypes } from '../../services/api';
import './Auction.scss';
import AuctionSearch from './AuctionSearch';
import { setDistrictId, setProvinceId } from '../../redux/landCostSlice/landCostSlice';
import { arrayBannerImage, banner } from '../../assets/banner/image';
import Banner from '../Banner';

const Auction = () => {
    const [formData, setFormData] = useState({
        text_search: '',
        to_chuc_dau_gia: '',
        chu_so_huu: '',
        idDistrict: '',
        idProvince: '',
        start_day: '',
        end_day: '',
        fromDateAnnouncement: '',
        toDateAnnouncement: '',
        gia_khoi_diem_min: '',
        gia_khoi_diem_max: '',
        sortOption: '',
        type_dau_gia: '',
    });

    //State
    const [province, setProvince] = useState([]);
    const [district, setDistrict] = useState([]);
    const [selectedProvinceId, setSelectedProvinceId] = useState(null);
    const [hanoiCoordinates, _] = useState([21.0285, 105.8542]);
    const [loading, setLoading] = useState(false);
    const [isOrganization, setIsOrganization] = useState([]);
    const [auctionTypes, setAuctionTypes] = useState([]);
    const mapRef = useRef(null);
    const dispatch = useDispatch();
    const [isTriggerBySelect, setIsTriggerBySelect] = useState(false);
    const [isFlying, setIsFlying] = useState(false);

    // Đổi định dạng theo DD/MM/YYYY
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        const adjustedValue = value;
        let formDataCoppy = { ...formData };

        if (name === 'idProvince' && adjustedValue !== '') {
            setSelectedProvinceId(Number(adjustedValue));
            setIsFlying(true);
            handleChangeMapByLocation(adjustedValue, LAND_AUCTION_KEYS.PROVINCE, mapRef, dispatch);
            formDataCoppy = {
                ...formDataCoppy,
                idProvince: adjustedValue,
                idDistrict: '',
            };
            setIsTriggerBySelect(true);
            setDistrict([]);
        } else if (name === 'idProvince' && adjustedValue === '') {
            formDataCoppy = {
                ...formDataCoppy,
                idProvince: '',
                idDistrict: '',
            };
            setDistrict([]);
        }
        if (name === 'idDistrict' && adjustedValue !== '') {
            if (isFlying) return;
            handleChangeMapByLocation(adjustedValue, LAND_AUCTION_KEYS.DISTRICT, mapRef, dispatch);
            formDataCoppy = {
                ...formDataCoppy,
                idDistrict: adjustedValue,
            };
            setIsTriggerBySelect(true);
        }
        setFormData({
            ...formDataCoppy,
            [name]: name === 'start_day' || name === 'end_day' ? formatDate(adjustedValue) : adjustedValue,
        });
    };

    const handleSubmit = async () => {
        const formDataRequest = new FormData();
        const formDataKey = Object.keys(formData);
        try {
            formDataKey.forEach((key) => {
                if (formData[key]) {
                    formDataRequest.append(key, formData[key]);
                }
            });
            dispatch(searchLandAuctionsInfoApi({ page: 1, formData: formDataRequest }));
            dispatch(setTabKey(TAB_KEYS.FILTER));
        } catch (error) {
            console.error('Error fetching filtered auctions', error);
            message.error('Đã xảy ra lỗi khi tìm kiếm đấu giá');
        } finally {
        }
    };

    // api tổ chức
    useEffect(() => {
        const fetchOrganizationData = async () => {
            const data = await fetchOrganization();
            setIsOrganization(data.message);
        };
        fetchOrganizationData();

        (async () => {
            const { type_dau_gia } = await getLandAuctionsTypes();
            setAuctionTypes(type_dau_gia);
        })();

        dispatch(setProvinceId(''));
        dispatch(setDistrictId(''));

        return () => {
            dispatch(setCurrentPage(1));
        };
    }, []);

    useEffect(() => {
        // api provinces
        const fetchProvincesData = async () => {
            const data = await fetchProvinces();
            setProvince(data);
        };
        if (!selectedProvinceId || (province && province.length < 1)) {
            fetchProvincesData();
        }
        // api district
        const fetchDistrictsData = async () => {
            if (selectedProvinceId) {
                const districtsData = await fetchDistrictsByProvinces(selectedProvinceId);
                setDistrict(districtsData);
            }
        };

        fetchDistrictsData();
    }, [selectedProvinceId]);

    return (
        <Container className="auction-container">
            <Banner />
            <div className="auction-container-form">
                <div className=" text-auction">
                    <span className="icon-auction">
                        <svg width="50" height="50" viewBox="0 0 50 56" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M3 53.3234H28.4057"
                                stroke="#B7A800"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M25.0183 53.3234V43.3234H6.38745V53.3234"
                                stroke="#B7A800"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M27.6832 4.17157L15.5391 18.5117C14.2163 20.0738 14.2163 22.6064 15.5391 24.1686L20.9045 30.5042C22.2274 32.0663 24.3722 32.0663 25.6951 30.5042L37.839 16.1641C39.1621 14.602 39.1621 12.0693 37.839 10.5072L32.4737 4.17157C31.1508 2.60948 29.006 2.60948 27.6832 4.17157Z"
                                stroke="#B7A800"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M31.7931 23.3235L47.0365 41.3234"
                                stroke="#B7A800"
                                strokeWidth="5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </span>
                    <h2>Thông báo đấu giá</h2>
                </div>
            </div>
            <AuctionSearch
                formData={formData}
                setIsFlying={setIsFlying}
                isTriggerBySelect={isTriggerBySelect}
                setIsTriggerBySelect={setIsTriggerBySelect}
                ref={mapRef}
                setFormData={setFormData}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                province={province}
                district={district}
                auctionTypes={auctionTypes}
                setProvince={setProvince}
                setDistrict={setDistrict}
                hanoiCoordinates={hanoiCoordinates}
                setSelectedProvinceId={setSelectedProvinceId}
                formatDate={formatDate}
                loading={loading}
                isOrganization={isOrganization}
            />
        </Container>
    );
};

export default Auction;
