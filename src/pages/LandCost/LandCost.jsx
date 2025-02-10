import { Button, Select } from 'antd';
import React, { useEffect } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { arrayBannerImage } from '../../assets/banner/image';
import LandCostTable from '../../components/LandCostTable/LandCostTable';
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
import Banner from '../../components/Banner';

const LandCost = () => {
    const dispatch = useDispatch();
    const allProvinces = useSelector((state) => state.landCost.allProvinces);
    const allDistricts = useSelector((state) => state.landCost.allDistricts);
    const allLocalities = useSelector((state) => state.landCost.allLocalities);
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

    const handleChangeDistricts = (id) => {
        dispatch(getAllLocalitiesInDistrictApi(id));
        dispatch(getAllLandCostApi({ id, type: LAND_COST_KEY.DISTRICT }));
        dispatch(
            setFilterSeletecd({
                district: id,
                locality: null,
            }),
        );
        searchParams.set(LAND_COST_KEY.DISTRICT, id);
        setSearchParams(searchParams);
    };
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

    useEffect(() => {
        const provinceId = Number(searchParams.get(LAND_COST_KEY.PROVINCE));
        const districtId = Number(searchParams.get(LAND_COST_KEY.DISTRICT));

        // if province id query param exists
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
            // if is not exists query params
            dispatch(getAllProvincesApi());
            dispatch(getAllLandCostApi({}));
            // if (filterSelected.locality) {
            //     dispatch(getAllLandCostApi({ id: filterSelected.locality, type: LAND_COST_KEY.LOCALITY }));
            // } else if (filterSelected.district) {
            //     dispatch(getAllLandCostApi({ id: filterSelected.district, type: LAND_COST_KEY.DISTRICT }));
            // } else if (filterSelected.province) {
            //     dispatch(getAllLandCostApi({ id: filterSelected.province, type: LAND_COST_KEY.PROVINCE }));
            // } else {
            // dispatch(getAllLandCostApi({}));

            // }
        }
        return () => {
            dispatch(setAllLandCost([]));
        };
    }, []);

    return (
        <Container>
            <Banner />
            <div className="land-cost__container">
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
                    />
                    <Select
                        onChange={handleChangeDistricts}
                        loading={allDistrictsStatus === THUNK_API_STATUS.PENDING}
                        disabled={allDistrictsStatus === THUNK_API_STATUS.PENDING}
                        placeholder="Quận huyện"
                        size="large"
                        value={allDistrictsStatus === THUNK_API_STATUS.PENDING ? null : filterSelected.district}
                        allowClear
                        className="land-cost__container-select-item"
                        options={allDistricts?.map((item) => ({
                            label: item.DistrictName,
                            value: item.DistrictID,
                        }))}
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
                <LandCostTable tableType={MAP_TABLE_TYPE.ON_ROUTE} />
            </div>
        </Container>
    );
};

export default LandCost;
