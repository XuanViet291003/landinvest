/* eslint-disable eqeqeq */
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import instance from '../../utils/axios-customize';
import './Bidding.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import _, { set } from 'lodash';
import { Pagination, DatePicker, ConfigProvider, Spin } from 'antd';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { arrayBannerImage } from '../../assets/banner/image';
import { getTimeLeft } from '../../function/getTimeLeft';
import Banner from '../../components/Banner';

dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
function updateQueryParams(newParams) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    Object.entries(newParams).forEach(([key, value]) => {
        if (value === null) {
            searchParams.delete(key); // Xóa tham số nếu giá trị là null
        } else {
            searchParams.set(key, value.toString()); // Thêm hoặc cập nhật tham số
        }
    });

    url.search = searchParams.toString();
    window.history.pushState(null, '', url.toString());
}
const BiddingPage = () => {
    // params
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // DATA
    const [responseData, setResponseData] = useState({});
    const [loading, setLoading] = useState(true);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    // pagination
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page'), 10) || 1);
    const [limit, setLimit] = useState(parseInt(searchParams.get('limit'), 10) || 10);
    // filter
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search_text') || '');
    const [contractorQuery, setContractorQuery] = useState(searchParams.get('contractor') || '');
    const [selectedProvinceID, setSelectedProvinceID] = useState(searchParams.get('province') || '');
    const [selectedDistrictID, setSelectedDistrictID] = useState(searchParams.get('district') || '');
    const [selectedWardID, setSelectedWardID] = useState(searchParams.get('ward') || '');
    const [selectedDate, setSelectedDate] = useState(
        searchParams.get('start_day')
            ? [new Date(searchParams.get('start_day')), new Date(searchParams.get('end_day'))]
            : [],
    );
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await instance.get('/all_provinces');
                setProvinces(response.data.dulieu);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu tỉnh:', error);
            }
        };

        fetchProvinces();
    }, []);

    useEffect(() => {
        if (selectedProvinceID) {
            const fetchDistricts = async () => {
                try {
                    const response = await instance.get(`/list_districts_in_provinces/${selectedProvinceID}`);
                    setDistricts(response.data.dulieu);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu huyện:', error);
                }
            };

            fetchDistricts();
        } else {
            setDistricts([]);
        }
    }, [selectedProvinceID]);

    useEffect(() => {
        if (selectedDistrictID) {
            const fetchWards = async () => {
                try {
                    const response = await instance.get(`/list_xa_phuong_in_districts/${selectedDistrictID}`);
                    setWards(response.data.dulieu);
                } catch (error) {
                    console.error('Lỗi khi lấy dữ liệu xã/phường:', error);
                }
            };

            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedDistrictID]);
    // EFFECT FILTER
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const formData = new FormData();
                formData.append('limit', limit);
                const fields = {
                    text_search: searchQuery,
                    start_day: selectedDate[0] ? dayjs(selectedDate[0]).format('YYYY-MM-DD') : null,
                    end_day: selectedDate[1] ? dayjs(selectedDate[1]).format('YYYY-MM-DD') : null,
                    idProvince: selectedProvinceID,
                    idDistrict: selectedDistrictID,
                    id_xa_phuong: selectedWardID,
                    ten_nha_thau: contractorQuery,
                };
                Object.entries(fields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value.length !== 0) {
                        formData.append(key, value);
                    }
                });
                const { data: response } = await instance.post(`/timkiem_dauthau?page=${currentPage}`, formData);
                const totalPage = response.dauthau_info.data.length !== 0 ? response.dauthau_info.total_page : 0;
                const totalDocs = Math.ceil(totalPage) * response.dauthau_info.data.length;
                const result = {
                    data: response.dauthau_info.data,
                    pagination: {
                        limit: response.limit,
                        totalPages: Math.ceil(totalPage),
                        totalDocs: totalDocs,
                        currentPage: currentPage,
                    },
                };
                setResponseData(result);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        currentPage,
        searchQuery,
        contractorQuery,
        limit,
        selectedDate,
        selectedProvinceID,
        selectedDistrictID,
        selectedWardID,
    ]);
    const onChangeSearchQuery = _.debounce((value) => {
        setSearchQuery(value);
        updateQueryParams({
            search_text: value.length !== 0 ? value : null,
        });
    }, 1500);
    const onChangeContractorQuery = _.debounce((value) => {
        setContractorQuery(value);
        updateQueryParams({
            contractor: value.length !== 0 ? value : null,
        });
    }, 1500);
    // PAGINATION FUNCTION
    const onChangePagination = (page) => {
        setCurrentPage(page);
        searchParams.set('page', page);
        updateQueryParams({
            page: page,
        });
    };
    const handleResetFilter = () => {
        if (
            searchQuery ||
            selectedProvinceID ||
            selectedDistrictID ||
            selectedWardID ||
            selectedDate.length !== 0 ||
            contractorQuery
        ) {
            setSelectedProvinceID('');
            setContractorQuery('');
            setSelectedDistrictID('');
            setSelectedWardID('');
            setSelectedDate([]);
            setSearchQuery('');
            updateQueryParams({
                search_text: null,
                contractor: null,
                province: null,
                district: null,
                ward: null,
                start_day: null,
                end_day: null,
            });
        }
    };
    const handleClickDetail = (id) => {
        const idBase64 = btoa(id);
        navigate(`/biddingdetail/${idBase64}`);
    };
    return (
        <div className="bidding-container">
            <Container className="Planning-container">
                <Banner />
                <button
                    onClick={() => navigate('/bidding/procurement?page=1&limit=10')}
                    style={{ marginTop: '15px', backgroundColor: 'rgb(73 , 97 , 70)' }}
                >
                    Mua sắm công
                </button>
                <h5 style={{ color: 'white', marginTop: '15px' }}>Tìm kiếm gói thầu</h5>
                <div className="Planning-search-vector">
                    <form className="Planning-search">
                        <input
                            placeholder="Tìm kiếm"
                            defaultValue={searchQuery}
                            onChange={(e) => onChangeSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    onChangeSearchQuery(e.target.value);
                                }
                            }}
                        />
                        <button type="submit">
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 20 21"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <circle cx="9" cy="9" r="8" stroke="#858EAD" strokeWidth="2" />
                                <path d="M14.5 15.5L18.5 19.5" stroke="#858EAD" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </button>
                    </form>
                </div>
                <div>
                    {/* <div className="Information-type">
                    <div className="Information-type-title">Loại thông tin :</div>
                    <select className="Information-type-select">
                        <option value="1">Quy hoạch</option>
                        <option value="2">Đất đai</option>
                    </select>
                </div> */}
                    <div className="information-content">
                        <h5 style={{ color: 'white', marginTop: '15px' }}>Tìm kiếm tên nhà thầu :</h5>
                        <form className="bidding-user-search">
                            <input
                                placeholder="Tìm kiếm nhà thầu"
                                defaultValue={contractorQuery}
                                onChange={(e) => onChangeContractorQuery(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        onChangeContractorQuery(e.target.value);
                                    }
                                }}
                            />
                            <button type="submit">
                                <svg
                                    width="20"
                                    height="20"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <circle cx="9" cy="9" r="8" stroke="#858EAD" strokeWidth="2" />
                                    <path
                                        d="M14.5 15.5L18.5 19.5"
                                        stroke="#858EAD"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </button>
                        </form>
                    </div>
                </div>
                <div>
                    {/* <div className="Information-type">
                    <div className="Information-type-title">Loại thông tin :</div>
                    <select className="Information-type-select">
                        <option value="1">Quy hoạch</option>
                        <option value="2">Đất đai</option>
                    </select>
                </div> */}
                    <div className="information-content">
                        <h5 style={{ color: 'white', marginTop: '15px' }}>Khoảng thời gian công bố :</h5>
                        <ConfigProvider
                            theme={{
                                components: {
                                    DatePicker: {
                                        activeBorderColor: '#2C353D',
                                        hoverBorderColor: '#2C353D',
                                    },
                                },
                                token: {
                                    colorBgContainer: '#2C353D',
                                    colorBorder: '#2C353D',
                                },
                            }}
                        >
                            <RangePicker
                                defaultValue={[
                                    selectedDate[0] ? dayjs(selectedDate[0]) : null,
                                    selectedDate[1] ? dayjs(selectedDate[1]) : null,
                                ]}
                                allowEmpty={[false, true]}
                                onChange={(_, dates) => {
                                    setSelectedDate(dates);
                                    updateQueryParams({
                                        start_day: dates[0] ? dates[0].toString() : null,
                                        end_day: dates[1] ? dates[1].toString() : null,
                                    });
                                }}
                                showTime={false}
                                placeholder={['Bắt đầu', 'Kết thúc']}
                            />
                        </ConfigProvider>
                    </div>
                </div>
                <div>
                    <div className="information-location">
                        <h5 style={{ color: 'white', marginTop: '15px' }}>Thông tin địa phương :</h5>
                        <div style={{ display: 'flex' }}>
                            <select
                                className="information-location-select"
                                placeholder="Tỉnh, thành phố"
                                value={selectedProvinceID}
                                onChange={(e) => {
                                    setSelectedProvinceID(e.target.value);
                                    setSelectedDistrictID('');
                                    setSelectedWardID('');
                                    updateQueryParams({
                                        province: e.target.value ? e.target.value : null,
                                        district: null,
                                        ward: null,
                                    });
                                }}
                            >
                                <option value="">Chọn tỉnh</option>
                                {provinces.map((province) => (
                                    <option key={province.ProvinceID} value={province.ProvinceID}>
                                        {province.ProvinceName}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="information-location-select"
                                placeholder="Quận, huyện"
                                value={selectedDistrictID}
                                onChange={(e) => {
                                    setSelectedDistrictID(e.target.value);
                                    updateQueryParams({
                                        district: e.target.value,
                                        ward: null,
                                    });
                                    setSelectedWardID('');
                                }}
                                disabled={!selectedProvinceID} // Disable nếu chưa chọn tỉnh
                            >
                                <option value="">Chọn quận, huyện</option>
                                {districts.map((district) => (
                                    <option key={district.DistrictID} value={district.DistrictID}>
                                        {district.DistrictName}
                                    </option>
                                ))}
                            </select>
                            <select
                                className="information-location-select"
                                placeholder="Phường, xã"
                                value={selectedWardID}
                                onChange={(e) => {
                                    setSelectedWardID(e.target.value);
                                    updateQueryParams({
                                        ward: e.target.value,
                                    });
                                }}
                                disabled={!selectedDistrictID} // Disable nếu chưa chọn huyện
                            >
                                <option value="">Chọn phường, xã</option>
                                {wards.map((ward) => (
                                    <option key={ward.WandID} value={ward.WandID}>
                                        {ward.WandName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <button
                            onClick={handleResetFilter}
                            style={{ margin: '0px', marginTop: '25px', backgroundColor: 'rgb(73 , 97 , 70)' }}
                        >
                            Đặt lại
                        </button>
                    </div>
                </div>
                <div className="header-table">
                    <p className="text-with-lines" style={{ color: 'white', fontSize: '1.2rem' }}>
                        Thông tin mời thầu
                    </p>
                </div>
                <div className="Planning-table">
                    <table className="Planning-table_data" border="1">
                        <thead>
                            <tr>
                                <th className="Planning-table_th">Gói Thầu</th>
                                <th>Bên Mời Thầu</th>
                                <th>Ngày Đăng</th>
                                <th>Đóng Thầu</th>
                            </tr>
                        </thead>
                        {!loading && (
                            <tbody>
                                {responseData?.data?.length > 0 ? (
                                    responseData.data.map((result, index) => {
                                        const isTimeBefore = getTimeLeft(result.TimeOfBidClosing);
                                        return (
                                            <tr
                                                key={index}
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => handleClickDetail(result.id)}
                                            >
                                                <td>
                                                    <p>{result.BiddingPackageName}</p>
                                                </td>
                                                <td style={{ color: '#3DB700' }}>{result.BidSolicitor}</td>
                                                <td>
                                                    <p>{dayjs.utc(result.ApprovalDate).format('DD/MM/YYYY HH:mm')}</p>
                                                </td>
                                                <td>
                                                    <p>
                                                        {dayjs.utc(result.TimeOfBidClosing).format('DD/MM/YYYY HH:mm')}
                                                    </p>
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
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan="4">Không có dữ liệu</td>
                                    </tr>
                                )}
                            </tbody>
                        )}
                    </table>
                    {loading && (
                        <div
                            style={{
                                minHeight: `${limit === 10 && '720px'}`,
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #f0f0f0',
                            }}
                        >
                            <Spin size="large" />
                        </div>
                    )}
                    <div className="antd_custom">
                        <Pagination
                            align="center"
                            current={currentPage}
                            total={responseData?.pagination?.totalDocs}
                            pageSize={limit}
                            onChange={(page, pageSize) => {
                                onChangePagination(page);
                            }}
                            showSizeChanger={true}
                            onShowSizeChange={(_, size) => {
                                setLimit(size);
                                updateQueryParams({
                                    limit: size,
                                });
                            }}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
};

export default BiddingPage;
