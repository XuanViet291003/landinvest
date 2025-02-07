import React, { useEffect, useState } from 'react';
import instance from '../../../utils/axios-customize';
import { Carousel, Container } from 'react-bootstrap';
import { arrayBannerImage } from '../../../assets/banner/image';
import { ConfigProvider, DatePicker, Pagination, Spin } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import '../Bidding.scss';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import _ from 'lodash';
import { getTimeLeft } from '../../../function/getTimeLeft';
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
export default function Procurement() {
    // PRAMS
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // STATE COMPONENT
    const [responseData, setResponse] = useState({});
    const [loading, setLoading] = useState(false);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    // filter
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search_text') || '');
    const [contractorQuery, setContractorQuery] = useState(searchParams.get('contractor') || '');
    const [selectedProvinceID, setSelectedProvinceID] = useState(searchParams.get('province') || '24');
    const [selectedDistrictID, setSelectedDistrictID] = useState(searchParams.get('district') || '');
    const [selectedWardID, setSelectedWardID] = useState(searchParams.get('ward') || '');
    const [limit, setLimit] = useState(searchParams.get('limit') || 10);
    const [currentPage, setCurrentPage] = useState(searchParams.get('page') || 1);
    const [selectedDate, setSelectedDate] = useState(
        searchParams.get('start_day')
            ? [new Date(searchParams.get('start_day')), new Date(searchParams.get('end_day'))]
            : [dayjs().format("YYYY-MM-DD"), ''],
    );
    // FETCHPROVINCE DISTRICT WARD
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
    // FETCH DATA
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const formdata = new FormData();
                const fields = {
                    start_day: selectedDate[0] ? dayjs(selectedDate[0]).format('YYYY-MM-DD') : null,
                    limit: limit,
                    idProvince: selectedProvinceID,
                    text_search: searchQuery,
                    idDistrict: selectedDistrictID,
                    id_xa_phuong: selectedWardID,
                    ten_nha_thau: contractorQuery,
                };
                Object.entries(fields).forEach(([key, value]) => {
                    if (value !== undefined && value !== null && value.length !== 0) {
                        formdata.append(key, value);
                    }
                });
                const { data } = await instance.post(`/timkiem_muasamcong_dauthau?page=${currentPage}`, formdata);
                const totalPage = data.dauthau.length !== 0 ? data.number_page : 0;
                const totalDocs = Math.ceil(totalPage) * data.dauthau.length;
                const result = {
                    data: data.dauthau,
                    pagination: {
                        limit: data.limit,
                        totalPages: Math.ceil(totalPage),
                        totalDocs: totalDocs,
                        currentPage: currentPage,
                    },
                };
                setResponse(result);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })()
    }, [currentPage, searchQuery, contractorQuery, limit, selectedProvinceID, selectedDate, selectedDistrictID, selectedWardID]);
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
    const onChangePagination = (page) => {
        setCurrentPage(page);
        updateQueryParams({
            page: page,
        });
    };
    const handleClickDetail = (id)=>{
        navigate(`/bidding/procurement/${id}`)
    }
    return (
        <div className="bidding-container">
            <Container className="Planning-container">
                <Carousel style={{ marginTop: '15px' }} controls={false} interval={5000}>
                    {arrayBannerImage.map((image, index) => (
                        <Carousel.Item key={index}>
                            <div>
                                <img className='image-banner' src={image} alt="" />
                            </div>
                        </Carousel.Item>
                    ))}
                </Carousel>
                <button onClick={()=> navigate('/bidding?page=1&limit=10')}  style={{ marginTop: '15px', backgroundColor: 'rgb(73 , 97 , 70)' }}>Thông tin đấu thầu</button>
                <h5 style={{ color: 'white', marginTop: '15px' }}>Tìm kiếm gói thầu</h5>
                <div className="Planning-search-vector">
                    <form className="Planning-search">
                        <input
                            placeholder="Tìm kiếm"
                            defaultValue={searchQuery}
                            onChange={(e) => {
                                onChangeSearchQuery(e.target.value)
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
                                // onKeyDown={(e) => {
                                //     if (e.key === 'Enter') {
                                //         e.preventDefault();
                                //         onChangeContractorQuery(e.target.value);
                                //     }
                                // }}
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
                        <div style={{ marginTop: '15px', marginBottom: '15px' }}>
                            <button style={{backgroundColor: 'rgb(73 , 97 , 70)' }}>
                                Đặt lại
                            </button>
                        </div>
                    </div>
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
                                        const isTimeBefore = getTimeLeft(result.bidCloseDate);
                                        return (
                                            <tr onClick={()=> handleClickDetail(result.id)} key={index} style={{ cursor: 'pointer' }}>
                                                <td>
                                                    <p>{result.bidName}</p>
                                                    <p style={{color: '#3DB700'}}>Giá thầu: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: result.bidPriceUnit }).format(result.bidPrice)}</p>
                                                </td>
                                                <td style={{ color: '#3DB700' }}>{result.investorName}</td>
                                                <td>
                                                    <p>
                                                        {dayjs.utc(result.publicDate).format('DD/MM/YYYY HH:mm')}
                                                    </p>
                                                </td>
                                                <td>
                                                    <p>
                                                        {dayjs.utc(result.bidCloseDate).format('DD/MM/YYYY HH:mm')}
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
                                minHeight: '720px',
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
                            disabled={loading}
                            total={responseData?.pagination?.totalDocs}
                            pageSize={limit}
                            onChange={(page, pageSize) => {
                                onChangePagination(page);
                            }}
                            showSizeChanger={false}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}
