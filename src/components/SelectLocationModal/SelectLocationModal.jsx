import { Modal, Select, Spin } from 'antd';
import React, { forwardRef, memo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { LOCATION_KEYS } from '../../constants/commonKey';
import { calculateLocation } from '../../function/calculateLocation';
import fetchProvinceName from '../../function/findProvince';
import { getPolygonsQuanHuyen, getPolygonsTinh } from '../../function/getPolygonByName';
import { doSearch } from '../../redux/search/searchSlice';
import {
    getAllDistrictInProvince,
    getAllProvinces,
    getAllWandInDistrict,
    getLocationInBoudingBox,
    getWardPolygon,
} from '../../services/api';
import '../../styles/selectLocationModal.scss';
import { setDistrictId } from '../../redux/landCostSlice/landCostSlice';
import { useSearchParams } from 'react-router-dom';

const SelectLocationModal = forwardRef(({ isOpen, handleOk, handleClose, lat, lon }, mapRef) => {
    const [allProvinces, setAllProvinces] = useState([]);
    const [allDistricts, setAllDistricts] = useState([]);
    const [allWards, setAllWards] = useState([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();
    const zoom = 15;
    const options = {
        animate: true,
    };
    const [defaultSelectProvince, setDefaultProvince] = useState(1);
    const [defaultSelectDistrict, setDefaultSelectDistrict] = useState(null);
    const [defaultSelectWard, setDefaultSelectWard] = useState(null);
    const [currentLocation, setCurrentLocation] = useState({
        locationId: null,
        locationType: '',
        location: {
            lat: 0,
            lng: 0,
        },
    });

    const onChangeProvince = async (id) => {
        setLoading(true);
        // console.log('change province');
        try {
            const province = allProvinces?.find((item, index) => index + 1 == id);
            const bboxString = province?.bbox;
            const bboxJSON = bboxString.replace(/'/g, '"');

            const boundingBox = JSON.parse(bboxJSON);

            const [lng, lat] = calculateLocation([
                [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
            ]);
            const res = await getAllDistrictInProvince(id);
            setAllDistricts(res);
            setCurrentLocation({
                locationId: id,
                locationType: LOCATION_KEYS.PROVINCE,
                location: {
                    lat,
                    lng,
                },
            });
            setDefaultProvince(id);
            setDefaultSelectDistrict(null);
            setDefaultSelectWard(null);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    };
    const onChangeDistrict = async (id) => {
        try {
            const district = allDistricts.find((item) => item.DistrictID === id);
            const boundingBox = district?.bounding_box ? JSON.parse(district.bounding_box) : [];
            const [lng, lat] = calculateLocation([
                [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
            ]);
            const res = await getAllWandInDistrict(id);
            setCurrentLocation({
                locationId: id,
                locationType: LOCATION_KEYS.DISTRICT,
                location: {
                    lat,
                    lng,
                },
            });
            setAllWards(res.all_xa);
            setDefaultSelectDistrict(id);
            setDefaultSelectWard(null);
        } catch (error) {
            console.log(error);
        }
    };

    const onChangeWard = async (id) => {
        const ward = allWards.find((item) => item.WandID === id);
        const boundingBox = ward?.bbox ? JSON.parse(ward.bbox) : [];
        const [lng, lat] = calculateLocation([boundingBox]);
        setDefaultSelectWard(id);
        setCurrentLocation({
            locationId: id,
            locationType: LOCATION_KEYS.WARD,
            location: {
                lat,
                lng,
            },
        });
    };
    const handleSearchLocation = async () => {
        let polygons = [];
        if (!currentLocation.locationId) return;

        const info = await fetchProvinceName(currentLocation.location.lat, currentLocation.location.lng);
        switch (currentLocation.locationType) {
            case LOCATION_KEYS.PROVINCE:
                polygons = await getPolygonsTinh(currentLocation.locationId);
                break;
            case LOCATION_KEYS.DISTRICT:
                polygons = await getPolygonsQuanHuyen(currentLocation.locationId);
                break;
            default:
                polygons = await getWardPolygon(currentLocation.locationId);
                break;
        }
        dispatch(
            doSearch({
                lat: currentLocation.location.lat,
                lon: currentLocation.location.lng,
                coordinates: polygons.length > 0 ? polygons : [],
                provinceName: info?.provinceName,
                districtName: info?.districtName,
            }),
        );
        mapRef.current?.setView([currentLocation.location.lat, currentLocation.location.lng], zoom, options);
        handleClose();
    };

    const handleReset = () => {
        const boundingBox = JSON.parse(
            allProvinces.filter((item) => item.ProvinceID === defaultSelectProvince)?.[0]?.bounding_box || [],
        );
        const [lng, lat] = calculateLocation([
            [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
        ]);
        setDefaultSelectDistrict(null);
        setDefaultSelectWard(null);
        setCurrentLocation({
            locationId: defaultSelectProvince,
            locationType: LOCATION_KEYS.PROVINCE,
            location: {
                lat: lat,
                lng: lng,
            },
        });
    };

    useEffect(() => {
        (async () => {
            try {
                // const res = await getAllProvinces();
                // const boundingBox = JSON.parse(res.dulieu?.[0]?.bounding_box || []);
                // const [lng, lat] = calculateLocation([
                //     [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
                // ]);
                // setAllProvinces(res.dulieu);
                const res = await fetch('/progame.json');
                const response = await res.json();
                setAllProvinces(response);
                // setCurrentLocation({
                //     locationId: defaultSelectProvince,
                //     locationType: LOCATION_KEYS.PROVINCE,
                //     location: {
                //         lat,
                //         lng,
                //     },
                // });
            } catch (error) {
                console.log(error);
            }
        })();
        // (async () => {
        //     setLoading(true);
        //     try {
        //         const districts = await getAllDistrictInProvince(defaultSelectProvince);
        //         setAllDistricts(districts);
        //     } catch (error) {
        //         console.log(error);
        //     }
        //     setLoading(false);
        // })();
    }, []);
    // useEffect(() => {
    //     (async () => {
    //         setLoading(true);
    //         try {
    //             const vitri = searchParams.get('vitri');
    //             if (!vitri) {
    //                 console.warn('Không tìm thấy "vitri" trong URL');
    //                 return;
    //             }

    //             const point = vitri.split(',');
    //             if (point.length < 2) {
    //                 console.warn('Dữ liệu vị trí không hợp lệ:', point);
    //                 return;
    //             }

    //             const location = await getLocationInBoudingBox(point[0], point[1]);
    //             console.log('Location found:', location);

    //             if (location?.provinces) await onChangeProvince(location.provinces);
    //             if (location?.district) await onChangeDistrict(location.district);
    //         } catch (e) {
    //             console.log(e);
    //         }
    //         setLoading(false);
    //     })();
    // }, [isOpen]);

    useEffect(() => {
      (async () => {
        const res = await getAllDistrictInProvince(1);
        setAllDistricts(res);
      })();
  }, []);

    const removeVietnameseTones = (str) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D');
    };

    const isVietnamese = (str) => {
        return /[àáảãạăắằẳẵặâấầẩẫậèéẻẽẹêếềểễệìíỉĩịòóỏõọôốồổỗộơớờởỡợùúủũụưứừửữựỳýỷỹỵđ]/.test(str);
    };

    const filterLocation = (input, option) => {
        if (isVietnamese(input)) {
            // Nếu người dùng nhập có dấu, so sánh trực tiếp
            return option.label.toLowerCase().includes(input.toLowerCase());
        }
        // Nếu không có dấu, so sánh với chuỗi đã loại bỏ dấu
        return removeVietnameseTones(option.label.toLowerCase()).includes(removeVietnameseTones(input.toLowerCase()));
    };

    return (
        <Modal width={600} footer={null} open={isOpen} onOk={handleOk} onCancel={handleClose}>
            <Spin spinning={loading}>
                <div className="select-location__modal">
                    {/* Chọn tỉnh / thành phố */}
                    <div className="select-location__modal--wrapper">
                        <div className="select-location__modal__label">
                            <span className="select-location__modal__label--location">Tỉnh</span>{' '}
                            <span className="select-location__modal__label--split">/</span>{' '}
                            <span className="select-location__modal__label--location">Thành phố</span>
                        </div>
                        <Select
                            showSearch
                            placeholder="Chọn tỉnh thành phố"
                            optionFilterProp="label"
                            onChange={onChangeProvince}
                            value={defaultSelectProvince}
                            className="select-location__modal--select"
                            filterOption={filterLocation}
                            options={allProvinces?.map((item, index) => ({
                                label: item.name_province,
                                value: index + 1,
                            }))}
                        />
                    </div>

                    {/* Chọn quận / huyện */}
                    <div className="select-location__modal--wrapper">
                        <div className="select-location__modal__label">
                            <span className="select-location__modal__label--location">Quận</span>{' '}
                            <span className="select-location__modal__label--split">/</span>{' '}
                            <span className="select-location__modal__label--location">Huyện</span>
                        </div>
                        <Select
                            showSearch
                            placeholder="Chọn quận huyện"
                            optionFilterProp="label"
                            onChange={onChangeDistrict}
                            value={defaultSelectDistrict}
                            className="select-location__modal--select"
                            filterOption={filterLocation}
                            options={allDistricts?.map((item) => ({
                                label: item.DistrictName,
                                value: item.DistrictID,
                            }))}
                        />
                    </div>

                    {/* Chọn xã / phường */}
                    <div className="select-location__modal--wrapper">
                        <div className="select-location__modal__label">
                            <span className="select-location__modal__label--location">Xã</span>{' '}
                            <span className="select-location__modal__label--split">/</span>{' '}
                            <span className="select-location__modal__label--location">Phường</span>
                        </div>
                        <Select
                            showSearch
                            placeholder="Chọn phường xã"
                            optionFilterProp="label"
                            onChange={onChangeWard}
                            value={defaultSelectWard}
                            className="select-location__modal--select"
                            filterOption={filterLocation}
                            options={allWards?.map((item) => ({ label: item.WandName, value: item.WandID }))}
                        />
                    </div>

                    {/* Nút hành động */}
                    <div className="select-location__modal--wrapper-btn">
                        <div className="select-location__modal--btn-warning" onClick={handleReset}>
                            Đặt lại
                        </div>
                        <div className="select-location__modal--btn" onClick={handleSearchLocation}>
                            Tìm khu vực
                        </div>
                    </div>
                </div>
            </Spin>
        </Modal>
    );
});

export default memo(SelectLocationModal);
