import { Button, Select } from 'antd';
import React, { useEffect, useCallback } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import Banner from '../../components/Banner';
import LandCostTable from '../../components/LandCostTable/LandCostTable';
import { useState } from "react";
import axios from "axios";
import { LAND_COST_KEY, MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import {
    getAllDistrictsInProvinceApi,
    getAllLandCostApi,
    getAllLocalitiesInDistrictApi,
    getAllProvincesApi,
    resetData,
    setAllLandCost,
    setCurrentPage,
    setFilterSeletecd,
} from '../../redux/landCostSlice/landCostSlice';


const LandCost = () => {
    const [searchResults, setSearchResults] = useState([]);
    const dispatch = useDispatch();
    const allProvinces = useSelector((state) => state.landCost.allProvinces);
    const allDistricts = useSelector((state) => state.landCost.allDistricts);
    const allLocalities = useSelector((state) => state.landCost.allLocalities);
    const allLandCost = useSelector((state) => state.landCost.allLandCost);
    const provincesStatus = useSelector((state) => state.landCost.provincesStatus);
    const allDistrictsStatus = useSelector((state) => state.landCost.allDistrictsStatus);
    const allLocalitiesStatus = useSelector((state) => state.landCost.allLocalitiesStatus);
    const filterSelected = useSelector((state) => state.landCost.filterSelected);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleChangeProvinces = (id) => {
        dispatch(getAllDistrictsInProvinceApi(id));
        dispatch(getAllLandCostApi({ id, type: LAND_COST_KEY.PROVINCE }));
        dispatch(resetData({ type: LAND_COST_KEY.LOCALITY }));
        dispatch(
            setFilterSeletecd({
                province: id,
                district: null,
                locality: null,
            }),
        );
        dispatch(setCurrentPage(1));
        searchParams.set(LAND_COST_KEY.PROVINCE, id);
        searchParams.delete(LAND_COST_KEY.DISTRICT);
        setSearchParams(searchParams);
    };

    //find all district
    const handleChangeDistricts = useCallback(async (districtIds) => {
        const isAllSelected = districtIds.includes('all');
        const selectedDistrictIds = isAllSelected ? 'all' : districtIds;
        dispatch(setFilterSeletecd({
            district: selectedDistrictIds,
            locality: null,
        }));

        // Call API to get data if district is selected
        if (selectedDistrictIds) {
            try {
                const idsToFetch = isAllSelected
                    ? allDistricts?.map((item) => item.DistrictID) || []
                    : districtIds;
                if (idsToFetch.length > 0) {
                    await dispatch(getAllLocalitiesInDistrictApi(idsToFetch)).unwrap();
                    dispatch(getAllLandCostApi({ id: idsToFetch, type: LAND_COST_KEY.DISTRICT }));
                }
                if (isAllSelected) {
                    searchParams.set(LAND_COST_KEY.DISTRICT, 'all');
                } else {
                    searchParams.set(LAND_COST_KEY.DISTRICT, districtIds.join(','));
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
            }
        } else {
            dispatch(resetData({ type: LAND_COST_KEY.DISTRICT }));
            dispatch(getAllLandCostApi({ id: filterSelected.province, type: LAND_COST_KEY.PROVINCE }));
            searchParams.delete(LAND_COST_KEY.DISTRICT);
        }

        dispatch(setCurrentPage(1));
        setSearchParams(searchParams);
    }, [dispatch, searchParams, allDistricts, filterSelected.province, setSearchParams]);

    const handleChangeLocalites = (id) => {
        dispatch(getAllLandCostApi({ id, type: LAND_COST_KEY.LOCALITY }));
        dispatch(
            setFilterSeletecd({
                locality: id,
            }),
        );
    };

    const handleResetLandCost = () => {
        dispatch(getAllLandCostApi({}));
        dispatch(resetData({}));
        dispatch(
            setFilterSeletecd({
                province: null,
                district: null,
                locality: null,
            }),
        );
        searchParams.delete(LAND_COST_KEY.PROVINCE);
        searchParams.delete(LAND_COST_KEY.DISTRICT);
        setSearchParams(searchParams);
    };

    const [showTable, setShowTable] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const handleSearch = async () => {
        if (!searchTerm) {
            alert("Vui lòng nhập từ khóa tìm kiếm!");
            return;
    }

    try {
        const response = await axios.get(
            `https://api.quyhoach.xyz/search_bang_gia_dat/${encodeURIComponent(searchTerm)}`
        );
            console.log("Dữ liệu từ API:", response.data);
            setSearchResults(response.data);
            setShowTable(true);
    }catch (error) {
            console.error("Lỗi gọi API:", error);
        }
    };
    {showTable && (
        <div className="search-results-container">
            <h2>Kết quả tìm kiếm</h2>
            <LandCostTable tableType={MAP_TABLE_TYPE.ON_ROUTE} data={searchResults} />
            <Button onClick={() => setShowTable(false)}>Đóng</Button>
        </div>
    )}

    const removeVietnameseTones = (str) => {
        if (!str) return '';
        str = str.toLowerCase();
        str = str.replace(/[àáạảãâầấậẩẫăằắặẳẵ]/g, 'a');
        str = str.replace(/[èéẹẻẽêềếệểễ]/g, 'e');
        str = str.replace(/[ìíịỉĩ]/g, 'i');
        str = str.replace(/[òóọỏõôồốộổỗơờớợởỡ]/g, 'o');
        str = str.replace(/[ùúụủũưừứựửữ]/g, 'u');
        str = str.replace(/[ỳýỵỷỹ]/g, 'y');
        str = str.replace(/đ/g, 'd');
        return str;
    };

    const districtOptions = [
        { label: 'Tất cả quận huyện', value: 'all' },
        ...(allDistricts?.map((item) => ({
            label: item.DistrictName,
            value: item.DistrictID,
        })) || []),
    ];

    useEffect(() => {
        const provinceId = Number(searchParams.get(LAND_COST_KEY.PROVINCE));
        const districtId = Number(searchParams.get(LAND_COST_KEY.DISTRICT));

        if (provinceId) {
            dispatch(getAllDistrictsInProvinceApi(provinceId));
            if (districtId) {
                dispatch(getAllLandCostApi({ id: districtId, type: LAND_COST_KEY.DISTRICT }));
                dispatch(getAllLocalitiesInDistrictApi(districtId));
            } else {
                dispatch(getAllLandCostApi({ id: provinceId, type: LAND_COST_KEY.PROVINCE }));
            }
            dispatch(
                setFilterSeletecd({
                    province: provinceId,
                    district: districtId ? districtId : null,
                    locality: null,
                }),
            );
        } else {
            dispatch(getAllProvincesApi());
            dispatch(getAllLandCostApi({}));
        }
        return () => {
            dispatch(setAllLandCost([]));
        };
    }, []);

    return (
        <Container>
            <Banner />
            <div className="land-cost__container">
                <div  className='land-cost__container-search'>
                    <input
                        type="text"
                        placeholder='Nhập từ khóa tìm kiếm'
                        className='land-cost__container-search-items'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}          
                    />
                    <Button
                        htmlType="button"
                        type="primary"
                        size="large"
                        className="land-cost__container-select-btn"
                        onClick={handleSearch}
                    >
                        Tìm kiếm
                    </Button>
                </div>
                <div className="land-cost__container-select">
                    <Select
                        onChange={handleChangeProvinces}
                        placeholder="Tỉnh, thành phố"
                        loading={provincesStatus === THUNK_API_STATUS.PENDING}
                        disabled={provincesStatus === THUNK_API_STATUS.PENDING}
                        allowClear
                        size="large"
                        className="land-cost__container-select-item"
                        value={provincesStatus === THUNK_API_STATUS.PENDING ? null : filterSelected.province}
                        options={allProvinces?.map((item) => ({
                            label: item.ProvinceName,
                            value: item.ProvinceID,
                        }))}
                        showSearch
                        filterOption={(input, option) => {
                            const searchText = removeVietnameseTones(input);
                            const optionText = removeVietnameseTones(option.label);
                            return optionText.includes(searchText);
                        }}
                    />
                    <Select
                        onChange={handleChangeDistricts}
                        loading={allDistrictsStatus === THUNK_API_STATUS.PENDING}
                        disabled={allDistrictsStatus === THUNK_API_STATUS.PENDING || !filterSelected.province}
                        placeholder="Quận huyện"
                        size="large"
                        value={allDistrictsStatus === THUNK_API_STATUS.PENDING ? null : filterSelected.district}
                        allowClear
                        mode="multiple"
                        className="land-cost__container-select-item"
                        options={districtOptions}
                        showSearch
                        filterOption={(input, option) => {
                            const searchText = removeVietnameseTones(input);
                            const optionText = removeVietnameseTones(option.label);
                            return optionText.includes(searchText);
                        }}
                    />
                    <Select
                        placeholder="Thị trấn, phường, xã"
                        onChange={handleChangeLocalites}
                        loading={allLocalitiesStatus === THUNK_API_STATUS.PENDING}
                        disabled={allLocalitiesStatus === THUNK_API_STATUS.PENDING}
                        allowClear
                        size="large"
                        value={allLocalitiesStatus === THUNK_API_STATUS.PENDING ? null : filterSelected.locality}
                        className="land-cost__container-select-item"
                        options={allLocalities?.map((item) => ({
                            label: item.WandName,
                            value: item.WandID,
                        }))}
                        showSearch
                        filterOption={(input, option) => {
                            const searchText = removeVietnameseTones(input);
                            const optionText = removeVietnameseTones(option.label);
                            return optionText.includes(searchText);
                        }}
                    />
                    <Button
                        htmlType="button"
                        type="primary"
                        size="large"
                        className="land-cost__container-select-btn"
                        onClick={handleResetLandCost}
                    >
                        Đặt lại
                    </Button>
                </div>
                <h1 className="land-cost__container-title">Bảng giá đất 2024 do chính phủ ban hành</h1>
                <p className="land-cost__container--notice">
                    Chú thích: Vị trí 1 là mặt tiền đường; Ví trí 2 là hẻm rộng trên 5m; Vị trí 3 là hẻm rộng 3m - 5m;
                    Vị trí 4 là hẻm rộng dưới 3m.
                </p>
                <p className="land-cost__container--notice">Giữ shift + lăn chuột để xem các cột tiếp theo</p>
                <LandCostTable tableType={MAP_TABLE_TYPE.ON_ROUTE} data={allLandCost} />
            </div>
        </Container>
    );
};

export default LandCost;