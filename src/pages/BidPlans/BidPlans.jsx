import React, { useEffect, useState } from 'react';
import Banner from '../../components/Banner';
import { useDispatch, useSelector } from 'react-redux';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import {
    getAllProvincesApi,
    getAllDistrictsInProvinceApi,
    getBidPlansByDistrictApi,
    fetchBidPlansByTextApi,
    resetBidPlansState,
} from '../../redux/BidPlansSlice/BidPlansSlice';
import { Select, Row, Col, Spin, Empty, Button, message, Input } from 'antd';
import BidPlansTable from '../../components/BidPlansTable/BidPlansTable.jsx';
import { Container } from 'react-bootstrap';

const { Option } = Select;
const { Search } = Input;

const removeVietnameseAccents = (str) => {
    return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/Đ/g, 'D');
};

const BidPlans = () => {
    const dispatch = useDispatch();
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchResultText, setSearchResultText] = useState('');

    const bidPlansState = useSelector((state) => state.bidPlans) || {};
    const {
        provinces = [],
        districts = [],
        bidPlans = [],
        status = { provinces: 'DEFAULT', districts: 'DEFAULT', bidPlans: 'DEFAULT' },
    } = bidPlansState;
    const { provinces: provincesStatus, districts: districtsStatus, bidPlans: bidPlansStatus } = status;

    // useEffect(() => {
    //     dispatch(getAllProvincesApi()).then((result) => {
    //         if (result.error) {
    //             message.error('Không thể tải danh sách tỉnh/thành phố');
    //         } else {
    //             console.log('Provinces from API:', result.payload);
    //             const hoaBinh = result.payload.find((p) => p.ProvinceName === 'Hòa Bình');
    //         }
    //     });
    // }, [dispatch]);

    useEffect(() => {
        // Chỉ cập nhật searchResultText khi có selectedDistrict
        if (selectedDistrict) {
            if (!Number.isInteger(Number(selectedDistrict))) {
                message.error('Mã quận/huyện không hợp lệ');
                return;
            }
            dispatch(getBidPlansByDistrictApi(selectedDistrict)).then((result) => {
                if (result.error) {
                    message.error(result.payload || 'Không thể tải dữ liệu đấu thầu');
                } else if (result.payload.length === 0) {
                    message.info('Không có dữ liệu đấu thầu cho quận/huyện này');
                } else {
                    const selectedDistrictData = districts.find((d) => d.DistrictID === selectedDistrict);
                    if (selectedDistrictData) {
                        setSearchResultText(`Kết quả tìm kiếm theo quận/huyện: ${selectedDistrictData.DistrictName}`);
                    } else {
                        setSearchResultText('');
                    }
                }
            });
        }
    }, [selectedDistrict, dispatch, districts]);

    const handleProvinceChange = (value) => {
        setSearchText('');
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setSearchResultText('');

        if (value) {
            dispatch(getAllDistrictsInProvinceApi(value)).then((result) => {
                if (result.error) message.error('Không thể tải danh sách quận/huyện');
                else if (result.payload.length === 0) message.warning('Không có quận/huyện nào trong tỉnh này');
            });
        } else {
            dispatch(resetBidPlansState());
        }
    };

    const handleDistrictChange = (value) => {
        setSearchText('');
        setSelectedDistrict(value);
        dispatch(resetBidPlansState());

        if (value) {
            if (!Number.isInteger(Number(value))) {
                message.error('Mã quận/huyện không hợp lệ');
                return;
            }
            dispatch(getBidPlansByDistrictApi(value)).then((result) => {
                if (result.error) {
                    message.error(result.payload || 'Không thể tải dữ liệu đấu thầu');
                } else if (result.payload.length === 0) {
                    message.info('Không có dữ liệu đấu thầu cho quận/huyện này');
                } else {
                    const selectedDistrictData = districts.find((d) => d.DistrictID === value);
                    if (selectedDistrictData) {
                        setSearchResultText(`Kết quả tìm kiếm theo quận/huyện: ${selectedDistrictData.DistrictName}`);
                    }
                }
            });
        } else {
            setSearchResultText('');
        }
    };

    const handleSearchByText = (value) => {
        if (!value || value.trim() === '') {
            message.warning('Vui lòng nhập từ khóa tìm kiếm hợp lệ!');
            return;
        }
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSearchText(value.trim());
        setSearchResultText(`Kết quả tìm kiếm theo từ khóa: ${value.trim()}`);
        dispatch(resetBidPlansState());
        dispatch(fetchBidPlansByTextApi(value.trim())).then((result) => {
            if (result.error) {
                message.error(result.payload || 'Không thể tìm kiếm dữ liệu đấu thầu');
            } else if (result.payload.length === 0) {
                message.info('Không tìm thấy dữ liệu đấu thầu với từ khóa này');
            }
        });
    };

    const handleReset = () => {
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setSearchText('');
        setSearchResultText('');
        dispatch(resetBidPlansState());
    };

    return (
        <div  className="bid-plans-container">
            <Banner />
            <div className="bid-plans-content">
                <h2 className="bid-plans-title">Tìm kiếm Kế hoạch đấu thầu</h2>

                <div className="search-section">
                    <Row gutter={16} justify="center" className="search-row">
                        <Col>
                            <Search
                                className="search-input"
                                placeholder="Nhập từ khóa tìm kiếm (ví dụ: Hà Nội)"
                                allowClear
                                enterButton="Tìm kiếm"
                                onSearch={handleSearchByText}
                                onChange={(e) => setSearchText(e.target.value)}
                                value={searchText}
                            />
                        </Col>
                    </Row>

                    <Row gutter={16} justify="center" className="filter-row">
                        <Col>
                            <Select
                                className="province-select"
                                placeholder="Chọn Tỉnh/Thành phố"
                                loading={provincesStatus === 'PENDING'}
                                onChange={handleProvinceChange}
                                value={selectedProvince}
                                showSearch
                                filterOption={(input, option) =>
                                    removeVietnameseAccents(option.children.toLowerCase()).includes(
                                        removeVietnameseAccents(input.toLowerCase())
                                    )
                                }
                            >
                                {provinces.map((province) => (
                                    <Option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Select
                                className="district-select"
                                placeholder={
                                    districtsStatus === 'PENDING'
                                        ? 'Đang tải...'
                                        : districts.length === 0
                                        ? 'Không có quận/huyện'
                                        : 'Chọn Quận/Huyện'
                                }
                                disabled={!selectedProvince || districtsStatus === 'PENDING'}
                                loading={districtsStatus === 'PENDING'}
                                onChange={handleDistrictChange}
                                value={selectedDistrict}
                                showSearch
                                filterOption={(input, option) =>
                                    removeVietnameseAccents(option.children.toLowerCase()).includes(
                                        removeVietnameseAccents(input.toLowerCase())
                                    )
                                }
                            >
                                {districts.map((district) => (
                                    <Option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                    </Option>
                                ))}
                            </Select>
                        </Col>
                        <Col>
                            <Button className="reset-btn" onClick={handleReset}>
                                Đặt lại
                            </Button>
                        </Col>
                    </Row>
                </div>

                <div className="results-section">
                    {searchResultText && <p className="search-result-text">{searchResultText}</p>}
                    {bidPlansStatus === 'PENDING' ? (
                        <Spin size="large" className="loading-spinner" />
                    ) : bidPlans.length === 0 ? (
                        <Empty description="Không có kế hoạch nào" className="empty-state" />
                    ) : (
                        <BidPlansTable data={bidPlans} className="bid-plans-table" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default BidPlans;