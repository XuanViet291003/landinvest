import { CloseOutlined, EnvironmentOutlined, ShareAltOutlined } from '@ant-design/icons';
import { Drawer, Image, Spin, message } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { MdArrowDropDown, MdArrowDropUp, MdFileUpload } from 'react-icons/md';
import { useMap } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { getUrlMapLayer } from '../../services/api';
import ListGetDistrictProvinces from '../ListGetDistrictProvinces/ListGetDistrictProvinces.jsx';
import './LocationInfoSidebar.css';
import { IoIosMore } from 'react-icons/io';
import { FaWikipediaW } from "react-icons/fa";

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
    handleWikiClick
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

    const tileLayer = `https://api.quyhoach.xyz/get_quyhoach_theo_tinh/${provincePlansId}/${mapZoom}/${coordinates.x}/${coordinates.y}`;

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
                <div className="ant-drawer-body-wrapper">
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
