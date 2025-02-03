import _ from 'lodash';
import React, { forwardRef, memo, useCallback, useMemo, useState } from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { LayersControl, MapContainer, TileLayer, useMapEvents } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { TAB_KEYS } from '../../constants/LandAuctionKey.js';
import { getLandAuctionsInfoApi, setCurrentPage, setTabKey } from '../../redux/LandAuctions/landAuctions.js';
import { getDistrictIdApi } from '../../redux/landCostSlice/landCostSlice.js';
import { fetchDistrictsByProvinces } from '../../services/api.js';
import './Auction.scss';
import AuctionsList from './AuctionsList.jsx';

const AuctionSearch = forwardRef(
    (
        {
            formData,
            handleChange,
            handleSubmit,
            province,
            district,
            hanoiCoordinates,
            setSelectedProvinceId,
            loading,
            isOrganization,
            setFormData,
            setDistrict,
            auctionTypes,
            IsTriggerBySelect,
            setIsTriggerBySelect,
            setIsFlying,
        },
        mapRef,
    ) => {
        const { BaseLayer } = LayersControl;
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const currentPage = useSelector((state) => state.landAuctions.page);
        const provinceId = useSelector((state) => state.landCost.provinceId);
        const districtId = useSelector((state) => state.landCost.districtId);

        const handleGetDistrict = useCallback(async (lat, lng, provinceId, districtId, district, formData) => {
            try {
                let districtsData = district && district.length > 0 ? district : [];

                dispatch(getDistrictIdApi({ lat, lng }));

                if (provinceId && districtsData.length === 0) {
                    districtsData = await fetchDistrictsByProvinces(provinceId);
                    setDistrict(districtsData);
                }

                if (provinceId && districtsData && districtsData.length > 0 && districtId) {
                    setFormData({
                        ...formData,
                        idProvince: provinceId,
                        idDistrict: districtId,
                    });
                }
                setSelectedProvinceId(provinceId);
            } catch (error) {
                console.log(error);
            }
        }, []);

        const debouncedHandleGetDistrict = useMemo(() => _.debounce(handleGetDistrict, 400), []);

        const MapEvents = ({ provinceId, districtId, district, formData, isTriggerBySelect }) => {
            useMapEvents({
                moveend(e) {
                    const zoom = e.target.getZoom();
                    const { lat, lng } = e.target.getCenter();
                    const formDataCoppy = { ...formData, idProvince: provinceId, idDistrict: districtId };
                    
                    if (zoom >= 10 && !isTriggerBySelect) {
                        debouncedHandleGetDistrict(lat, lng, provinceId, districtId, district, formDataCoppy);
                    } else {
                        setIsTriggerBySelect(false);
                    }
                    setIsFlying(false);
                },
            });
            return null;
        };

        // Hàm tìm kiếm
        const handleSearch = (e) => {
            e.preventDefault();
            handleSubmit();
        };
        const handleReset = () => {
            dispatch(getLandAuctionsInfoApi({ page: currentPage, type: '1' }));
            dispatch(setTabKey(TAB_KEYS.ALL));
            dispatch(setCurrentPage(1));
            setFormData({
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
            navigate('/auctions');
        };

        return (
            <Container className="m-0 p-0">
                <div className="auction-content">
                    {/* Auction Map */}
                    <div className="auction-map">
                        <MapContainer
                            center={hanoiCoordinates}
                            zoom={13}
                            ref={mapRef}
                            style={{ height: '100%', width: '100%' }}
                        >
                            <MapEvents
                                provinceId={provinceId}
                                districtId={districtId}
                                district={district}
                                formData={formData}
                                triggerBySelect={IsTriggerBySelect}
                            />
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
                    </div>

                    {/* Auction Form */}
                    <div className="auction-form">
                        <Form onSubmit={handleSearch}>
                            <Row>
                                <Col xs={12} sm={12}>
                                    <Form.Group as={Row} className="mb-2" controlId="formAssetName">
                                        <Form.Label column sm={2}>
                                            Tên tài sản
                                        </Form.Label>
                                        <Col sm={10}>
                                            <Form.Control
                                                type="text"
                                                name="text_search"
                                                value={formData.assetName}
                                                onChange={handleChange}
                                                placeholder="Tên tài sản"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                {/* Left Side */}
                                <Col sm={6}>
                                    <Form.Group as={Row} className="mb-2" controlId="formOrganization">
                                        <Form.Label column sm={4}>
                                            Tổ chức ĐGTS
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="to_chuc_dau_gia"
                                                value={formData.to_chuc_dau_gia}
                                                onChange={handleChange}
                                            >
                                                <option value={''}>Tất cả</option>
                                                {isOrganization.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.name}>
                                                            {item.name}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formFromDateAuction">
                                        <Form.Label column sm={4}>
                                            Từ ngày
                                        </Form.Label>
                                        <Col sm={8}>
                                            <DatePicker
                                                selected={formData.start_day ? new Date(formData.start_day) : null}
                                                onChange={(date) =>
                                                    handleChange({ target: { name: 'start_day', value: date } })
                                                }
                                                placeholderText="Thời gian tổ chức việc đấu giá"
                                                className="form-control"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formToDateAuction">
                                        <Form.Label column sm={4}>
                                            Đến ngày
                                        </Form.Label>
                                        <Col sm={8}>
                                            <DatePicker
                                                selected={formData.end_day ? new Date(formData.end_day) : null}
                                                onChange={(date) =>
                                                    handleChange({ target: { name: 'end_day', value: date } })
                                                }
                                                placeholderText="Thời gian tổ chức việc đấu giá"
                                                className="form-control"
                                                dateFormat="dd/MM/yyyy"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formFromPrice">
                                        <Form.Label column sm={4}>
                                            Giá khởi điểm từ
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="number"
                                                name="gia_khoi_diem_min"
                                                min={1}
                                                value={formData.fromPrice}
                                                onChange={handleChange}
                                                placeholder="Giá khởi điểm từ"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formToPrice">
                                        <Form.Label column sm={4}>
                                            Giá khởi điểm đến
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="number"
                                                name="gia_khoi_diem_max"
                                                value={formData.toPrice}
                                                onChange={handleChange}
                                                placeholder="Giá khởi điểm đến"
                                            />
                                        </Col>
                                    </Form.Group>
                                </Col>

                                {/* Right Side */}
                                <Col sm={6}>
                                    <Form.Group as={Row} className="mb-2" controlId="formOwnerName">
                                        <Form.Label column sm={4}>
                                            Người có tài sản
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                type="text"
                                                name="chu_so_huu"
                                                value={formData.chu_so_huu}
                                                onChange={handleChange}
                                                placeholder="Họ và tên người có tài sản"
                                            />
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formProvince">
                                        <Form.Label column sm={4}>
                                            Tỉnh thành
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="idProvince"
                                                value={formData.idProvince}
                                                onChange={(e) => {
                                                    // const selectedProvinceId = Number(e.target.value);
                                                    // setSelectedProvinceId(
                                                    //     province.find((p) => p.TinhThanhPhoID === selectedProvinceId)
                                                    //         ?.TinhThanhPhoID || '',
                                                    // );
                                                    handleChange(e);
                                                }}
                                            >
                                                <option value={''}>Tất cả</option>
                                                {province.map((province, index) => (
                                                    <option key={index} value={province.TinhThanhPhoID}>
                                                        {province.TenTinhThanhPho}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>

                                    <Form.Group as={Row} className="mb-2" controlId="formDistrict">
                                        <Form.Label column sm={4}>
                                            Quận/huyện
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="idDistrict"
                                                value={formData.idDistrict}
                                                onChange={handleChange}
                                                disabled={!formData.idProvince}
                                            >
                                                <option value={''}>Tất cả</option>
                                                {district.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item.DistrictID}>
                                                            {item.DistrictName}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                    <Form.Group as={Row} className="mb-2" controlId="formTypeDauGia">
                                        <Form.Label column sm={4}>
                                            Loại đấu giá
                                        </Form.Label>
                                        <Col sm={8}>
                                            <Form.Control
                                                as="select"
                                                name="type_dau_gia"
                                                value={formData.type_dau_gia}
                                                onChange={handleChange}
                                            >
                                                <option value={''}>Tất cả</option>
                                                {auctionTypes?.map((item, index) => {
                                                    return (
                                                        <option key={index} value={item}>
                                                            {item}
                                                        </option>
                                                    );
                                                })}
                                            </Form.Control>
                                        </Col>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {/* Button */}
                            <div className="btn-search">
                                <Button variant="primary" type="submit" disabled={loading}>
                                    {loading ? 'Loading...' : 'Tìm kiếm'}
                                </Button>
                                <Button
                                    variant="primary"
                                    type="button"
                                    className="btn-search__reset"
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>

                {/* Kết quả tìm kiếm */}
                <div className="search-results">
                    <AuctionsList formData={formData} />
                </div>
            </Container>
        );
    },
);

export default memo(AuctionSearch);
