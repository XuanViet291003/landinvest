import { CloseOutlined, EnvironmentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Checkbox, Drawer, Image, Select, Spin, Switch, message } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp, MdFileUpload } from 'react-icons/md';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getUrlMapLayer } from '../../services/api';
import ListGetDistrictProvinces from '../ListGetDistrictProvinces/ListGetDistrictProvinces.jsx';
import './LocationInfoSidebar.css';
import { IoIosMore } from 'react-icons/io';
import { FaWikipediaW } from 'react-icons/fa';

const LocationInfoSidebar = ({
    inforArea,
    onCloseLocationInfo,
    isLocationInfoOpen,
    locationData,
    handleShareLocationNow,
    handleShareLogoLocation,
    location,
    setIsShowModalUpload,
    RegulationsImagesList,
    handleItemClick,
    handleWikiClick,
    onShowHistoryChart,
    handleHeatMapClick,
    handleHeatMapSwitch,
    heatMapLoading,
    handleInfraMutationClick,
    handleRegionSearchClick,
    handleEstatePriceClick,
    estateLoading
}) => {
    const map = useMap();
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
    const [fullAddress, setFullAddress] = useState('');
    const [addressDetails, setAddressDetails] = useState({});
    const [provincePlansId, setProvincePlansId] = useState(0);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchUrlParams = new URLSearchParams(searchParams);
    const provinceId = searchParams.get('plans-by-province');
    const quyhoachByProvince = useSelector((state) => state.plansSelected.quyhoachByProvince);
    const quyhoach = useSelector((state) => state.plansSelected.quyhoach);
    const mapZoom = map.getZoom();
    const [messageApi, contextHolder] = message.useMessage();
    const [layerUrl, setLayerUrl] = useState('');
    const [isLayerUrlLoading, setIsLayerUrlLoading] = useState(false);
    const landCostprovinceId = useSelector((state) => state.landCost.provinceId);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [isLandAuction, setIsLandAuction] = useState(true);
    const [isShowMore, setIsShowMore] = useState(false);
    const [heatType, setHeatType] = useState(searchParams.get('heat-type'));

    const historyCost = useSelector((state) => state.historyCost.value);
    const dispatch = useDispatch();

    const tileLayer = `/api/landinvest/get_quyhoach_theo_tinh/${provincePlansId}/${mapZoom}/${coordinates.x}/${coordinates.y}`;

    // Lấy tọa độ tile x, y từ bản đồ
    useEffect(() => {
        if (location.length > 0) {
            const point = map.project(location, mapZoom);
            const tileSize = 256;
            const tileX = Math.floor(point.x / tileSize);
            const tileY = Math.floor(point.y / tileSize);
            setCoordinates({ x: tileX, y: tileY });
        }
    }, [location, map, mapZoom]);

    useEffect(() => {
        if (location && location.length > 0) {
            const fetchReverseGeocode = async (lat, lon) => {
                const url = `https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lon}&zoom=18&format=jsonv2&addressdetails=1`;
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data && data.address) {
                        setFullAddress(data.display_name || 'Không tìm thấy thông tin');
                        setAddressDetails(data.address);
                    } else {
                        setFullAddress('Không thể lấy thông tin địa chỉ');
                    }
                } catch (error) {
                    console.error('Lỗi khi gọi API Nominatim:', error);
                    setFullAddress('Không thể lấy thông tin địa chỉ');
                }
            };
            fetchReverseGeocode(location[0], location[1]);

            (async () => {
                setIsLayerUrlLoading(true);
                try {
                    const { duongdan } = await getUrlMapLayer(mapZoom, coordinates.x, coordinates.y);
                    setLayerUrl(duongdan);
                } catch (error) {
                    console.error(error);
                }
                setIsLayerUrlLoading(false);
            })();
        }
    }, [location]);

    // useEffect(() => {
    //     const formData = new FormData();

    //     if (landCostprovinceId && districtId) {
    //         formData.append('idDistrict', districtId);
    //         formData.append('idProvince', landCostprovinceId);
    //         dispatch(searchLandAuctionsInfoApi({ page: landAuctionListCurrentPage, formData: formData }));
    //     }
    //     console.log(landAuctionsListTotalPage);
    //     return () => {
    //         dispatch(setCurrentPage(1));
    //     };
    // }, [landAuctionListCurrentPage, landCostprovinceId, districtId, location]);

    const { Option } = Select;

    const handleHeatTypeChange = (value) => {
        searchParams.set('heat-type', value);
        setSearchParams(searchParams);
        setHeatType(value);
    };

    useEffect(() => {
        if (heatType) {
            handleHeatMapClick();
        }
    }, [heatType]);

    useEffect(() => {
        if (!searchParams.get('heat-view')) {
            searchParams.set('heat-view', 'map');
            setSearchParams(searchParams);
        }
    }, []);

    const handleViewChange = (key) => {
        let currentView = searchParams.get('heat-view') || '';

        if (currentView === key) {
            searchParams.delete('heat-view');
        } else {
            searchParams.set('heat-view', key);
        }

        setSearchParams(searchParams);
    };

    const currentViews = searchParams.get('heat-view')?.split(',') || [];

    return (
        <>
            {contextHolder}
            <Drawer
                placement={window.innerWidth < 768 ? 'bottom' : 'left'}
                mask={false}
                closeIcon={<CloseOutlined style={{ fontSize: 18 }} />}
                onClose={onCloseLocationInfo}
                open={isLocationInfoOpen}
                key={'bottom'}
                width={window.innerWidth < 768 ? '100%' : 300}
                height={window.innerWidth < 768 ? 'auto' : '100%'}
                className={`overflow-y-hidden ${window.innerWidth > 768 && 'desktop'}`}
            >
                {' '}
                <div style={{ padding: '10px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}
                    >
                        <div>
                            <span style={{ fontSize: '16px', fontWeight: '500', marginRight: '10px' }}>
                                Bật/tắt bản đồ nhiệt
                            </span>
                            <Switch checked={searchParams.get('heat-map') !== 'off'} onChange={handleHeatMapSwitch} />
                        </div>

                        <Select
                            defaultValue={searchParams.get('heat-type') || 'tho_cu'}
                            className="custom-select"
                            style={{ width: 170 }}
                            dropdownStyle={{
                                backgroundColor: 'black',
                                color: 'white',
                            }}
                            onChange={handleHeatTypeChange}
                        >
                            <Option value="tho_cu" style={{ color: 'white' }}>
                                Thổ Cư
                            </Option>
                            <Option value="biet_thu" style={{ color: 'white' }}>
                                Biệt Thự
                            </Option>
                            <Option value="chungcu" style={{ color: 'white' }}>
                                Chung Cư
                            </Option>
                            <Option value="shophouse" style={{ color: 'white' }}>
                                ShopHouse
                            </Option>
                        </Select>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Checkbox
                            checked={searchParams.get('heat-view') === 'map'}
                            onChange={() => handleViewChange('map')}
                            style={{ color: 'white' }}
                        >
                            Xem bản đồ
                        </Checkbox>
                        <Checkbox
                            checked={searchParams.get('heat-view') === 'chart'}
                            onChange={() => handleViewChange('chart')}
                            style={{ color: 'white' }}
                        >
                            Xem biểu đồ
                        </Checkbox>
                    </div>
                </div>
                <div className="ant-drawer-body-wrapper">
                    <div
                        style={{
                            margin: '20px auto',
                            marginTop: '0',
                            width: '90%',
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: '10px',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <button style={{ width: 'calc(50% - 32px)' }} onClick={onShowHistoryChart}>
                            Xem lịch sử giá đất
                        </button>
                        <button
                            style={{ width: 'calc(50% - 32px)' }}
                            onClick={handleHeatMapClick}
                            disabled={heatMapLoading}
                        >
                            {heatMapLoading ? 'Đang tải bản đồ nhiệt...' : 'Xem bản đồ nhiệt tại đây'}
                        </button>
                        <button style={{ width: 'calc(50% - 32px)'}} onClick={handleInfraMutationClick}>
                            {searchParams.get("regionPolygon") === "on" ? "Tắt đột biến hạ tầng" : "Xem đột biến hạ tầng"}
                        </button>
                        <button 
                          style={{ width: 'calc(50% - 32px)'}} 
                          onClick={handleEstatePriceClick}
                          disabled={estateLoading}
                        >
                            {estateLoading? 'Đang tải dữ liệu giá đât...' : 'Xem giá đất đang bán'}
                        </button>
                    </div>

                    {isShowMore && (
                        <>
                            <div>{tileLayer && <Image src={tileLayer} style={{ width: '100%' }} />}</div>

                            <div className="bg-white ant-drawer-body-title-wrapper">
                                <span className="ant-drawer-body-title">
                                    {mapZoom}/{coordinates.x}/{coordinates.y}
                                </span>
                                {isLayerUrlLoading && (
                                    <Spin
                                        spinning
                                        size="small"
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                        }}
                                    />
                                )}
                                {!isLayerUrlLoading && <span className="ant-drawer-body-title">{layerUrl}</span>}
                            </div>
                        </>
                    )}

                    <div>
                        <div className="ant-drawer-body-function">
                            {(quyhoachByProvince.length > 0 || quyhoach.length > 0) && (
                                <div
                                    className="ant-drawer-body-function-item-wrapper"
                                    onClick={() =>
                                        handleShareLogoLocation(`${mapZoom}/${coordinates.x}/${coordinates.y}`)
                                    }
                                >
                                    <div className="ant-drawer-body-function-item">
                                        <EnvironmentOutlined className="ant-drawer-body-function-item-icon" />
                                    </div>
                                    <span className="ant-drawer-body-function-item-text">Lấy z x y</span>
                                </div>
                            )}

                            <div
                                className="ant-drawer-body-function-item-wrapper"
                                onClick={() => handleShareLocationNow(location)}
                            >
                                <div className="ant-drawer-body-function-item">
                                    <ShareAltOutlined className="ant-drawer-body-function-item-icon" />
                                </div>
                                <span className="ant-drawer-body-function-item-text">Chia sẻ</span>
                            </div>

                            <div
                                className="ant-drawer-body-function-item-wrapper"
                                onClick={() => {
                                    setIsShowModalUpload({
                                        show: true,
                                        location,
                                    });
                                }}
                            >
                                <div className="ant-drawer-body-function-item">
                                    <MdFileUpload size={16} color="#1d4ed8" />
                                </div>
                                <span className="ant-drawer-body-function-item-text">Upload ảnh</span>
                            </div>

                            <div
                                className="ant-drawer-body-function-item-wrapper"
                                onClick={() => handleWikiClick(location)}
                            >
                                <div className="ant-drawer-body-function-item">
                                    <FaWikipediaW color="#1d4ed8" />
                                </div>
                                <span className="ant-drawer-body-function-item-text">Wiki</span>
                            </div>

                            <div
                                className="ant-drawer-body-function-item-wrapper"
                                onClick={() => setIsShowMore(!isShowMore)}
                            >
                                <div className="ant-drawer-body-function-item">
                                    <IoIosMore color="#1d4ed8" />
                                </div>
                                <span className="ant-drawer-body-function-item-text">Xem thêm</span>
                            </div>
                        </div>
                        {(quyhoachByProvince.length > 0 || quyhoach.length > 0) && (
                            <div className="ant-drawer-body-tile-layer-wrapper">
                                <img src={tileLayer} alt="ảnh tile layer" className="ant-drawer-body-tile-layer-img" />
                                {/* <Button type="primary" danger onClick={showModal}>
                                    Xóa
                                </Button> */}
                            </div>
                        )}

                        <br />
                        {/* <div className="location-info">
                            <h5>Địa chỉ:</h5>
                            <p>{fullAddress}</p>

                            {fullAddress && (
                                <Tooltip title="Sao chép địa chỉ đầy đủ">
                                    <span
                                        className="ant-drawer-body-title-coppy"
                                        onClick={handleShareAddress}
                                        style={{ color: '#1890ff', cursor: 'pointer' }}
                                    >
                                        Sao chép địa chỉ
                                    </span>
                                </Tooltip>
                            )}
                        </div> */}
                        <ListGetDistrictProvinces
                            address={inforArea}
                            location={location}
                            provincePlansId={provincePlansId}
                            handleItemClick={handleItemClick}
                            RegulationsImagesList={RegulationsImagesList}
                        />
                    </div>
                </div>
                {/* <Modal title="Thông báo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <p>Bạn có muốn xóa ảnh này không</p>
                </Modal> */}
            </Drawer>
        </>
    );
};

export default memo(LocationInfoSidebar);
