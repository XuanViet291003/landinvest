import { message, Modal, Pagination, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { CiShare2 } from 'react-icons/ci';
import { ACTIONS } from '../../constants/commonKey';
import { getLandBiddingApi } from '../../redux/landBiddingSlice/landBiddingSlice';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import { useLocation } from 'react-router-dom';
import _, { set } from 'lodash';
import { LAND_BIDDING_KEY } from '../../constants/LandBiddingKey';
import HandleGotoLocation from '../LandAuctionTable/components/HandleGotoLocation';

import ReactWindow from 'reactjs-windows';

function updateQueryParams(newParams) {
    const url = new URL(window.location.href);
    const searchParams = new URLSearchParams(url.search);

    Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value.length === 0) {
            searchParams.delete(key); // Xóa tham số nếu giá trị là null
        } else {
            searchParams.set(key, value.toString()); // Thêm hoặc cập nhật tham số
        }
    });

    url.search = searchParams.toString();
    window.history.pushState(null, '', url.toString());
}
const LandBiddingModal = ({ isOpen, handleOk, handleCancel }) => {
    const dispatch = useDispatch();
    const biddingData = useSelector((state) => state.landBidding.landBidding);
    const biddingStatus = useSelector((state) => state.landBidding.landBiddingStatus);
    const currentLocation = useSelector((state) => state.searchQuery.searchResult);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [messageApi, contextHolder] = message.useMessage();
    const inputRef = React.useRef(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [page, setPage] = useState(searchParams.get('page') || 1);
    const [searchText, setSearchText] = useState(searchParams.get('text_search') || '');
    const handleShareLocation = () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        // Cập nhật hoặc thêm tham số nếu chưa có
        if (searchText) {
            params.set(LAND_BIDDING_KEY.TEXT_SEARCH, searchText);
        }
        params.set('district', districtId);
        params.set('ups', ACTIONS.BIDDING_SHARING);

        // Tạo URL mới
        const sharingUrl = `${url.origin}${url.pathname}?${params.toString()}`;

        navigator.clipboard
            .writeText(sharingUrl)
            .then(() => {
                messageApi.open({
                    type: 'success',
                    content: 'Đã sao chép vào bộ nhớ',
                });
            })
            .catch(() => {
                messageApi.open({
                    type: 'error',
                    content: 'Lỗi khi sao chép vào bộ nhớ',
                });
            });
    };

    const handlePagination = (page) => {
        setPage(page);
        updateQueryParams({
            page: page,
        });
    };
    useEffect(() => {
        if (isOpen) {
            dispatch(getLandBiddingApi({ idDistrict: districtId, currentPage: page, searchText: searchText }));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, districtId, page, searchText]);
    const onChangeQuerySearch = _.debounce((value) => {
        setSearchText(value);
        updateQueryParams({
            text_search: value,
        });
    }, 1500);
    return (
        <>
            {contextHolder}
            {isOpen && (
                <ReactWindow title="Danh sách đấu thầu" onClose={handleCancel}>
                    {/* <Modal
                        zIndex={9999}
                        closable={false}
                        width={'90vw'}
                        centered
                        footer={<></>}
                        // closeIcon={<FaCircleMinus color="#fff" fontSize={16} />}
                        open={isOpen}
                        afterOpenChange={(open) => {
                            if (open) {
                                updateQueryParams({
                                    page: page,
                                    district: districtId,
                                    ups: ACTIONS.BIDDING_SHARING,
                                    text_search: searchText,
                                });
                            } else {
                                updateQueryParams({
                                    page: null,
                                    district: null,
                                    ups: null,
                                    text_search: null,
                                });
                                setSearchText('');
                                setPage(1);
                            }
                        }}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        className="land-cost-area"
                    > */}
                    <div className="land-cost-area__wrapper">
                        <div className="land-cost-area__wrapper__header">
                            <span className="land-cost-area__wrapper__header--title">
                                *Thông tin đấu thầu tại vị trí hiện tại bạn đang xem ở{' '}
                                <span className="land-cost-area__wrapper__header--bold">
                                    {currentLocation.districtName}{' '}
                                    <span className="land-cost-area__wrapper__header-dash">-</span>{' '}
                                    {currentLocation.provinceName}.
                                </span>
                                <span className="land-cost-area__wrapper__header--share" onClick={handleShareLocation}>
                                    <CiShare2 size={16} />
                                    Chia sẻ
                                </span>
                            </span>
                            <div className="land-cost-area__wrapper__header--search">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Tìm kiếm"
                                    style={{ borderRadius: '5px', padding: '5px 15px' }}
                                    onChange={(e) => onChangeQuerySearch(e.target.value)}
                                />
                            </div>
                            <FaCircleMinus
                                color="#fff"
                                fontSize={26}
                                className="land-cost-area__wrapper__header--icon"
                                onClick={handleCancel}
                            />
                        </div>
                        <span className="land-cost-area__wrapper__header--subtitle">
                            *Thông tin đấu thầu {new Date().getFullYear()} do chính phủ ban hành.
                        </span>
                        <p className="land-cost__container--notice">Modal này có thể chỉnh kích thước được.</p>

                        <div className="bidding-container">
                            <div className="Planning-container">
                                <div className="Planning-table">
                                    <table className="Planning-table_data" border="1">
                                        <thead>
                                            <tr>
                                                <th className="Planning-table_th">Gói Thầu</th>
                                                <th>Bên Mời Thầu</th>
                                                <th>Ngày Đăng</th>
                                                <th>Đóng Thầu</th>
                                                <th>Vị trí</th>
                                            </tr>
                                        </thead>
                                        {biddingStatus !== THUNK_API_STATUS.PENDING && (
                                            <tbody>
                                                {biddingData?.docs?.length > 0 ? (
                                                    biddingData?.docs?.map((result, index) => (
                                                        <tr key={index} style={{ cursor: 'pointer' }}>
                                                            <td>{result.BiddingPackageName}</td>
                                                            <td style={{ color: '#3DB700' }}>{result.BidSolicitor}</td>
                                                            <td>
                                                                {new Date(result.ApprovalDate).toLocaleString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    year: 'numeric',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit',
                                                                })}
                                                            </td>
                                                            <td>
                                                                {new Date(result.TimeOfBidClosing).toLocaleString(
                                                                    'vi-VN',
                                                                    {
                                                                        day: '2-digit',
                                                                        month: '2-digit',
                                                                        year: 'numeric',
                                                                        hour: '2-digit',
                                                                        minute: '2-digit',
                                                                    },
                                                                )}
                                                            </td>
                                                            <td>
                                                                <HandleGotoLocation
                                                                    DistrictID={result.District_id}
                                                                    closeModal={handleCancel}
                                                                />
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="4">Không có dữ liệu</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        )}
                                    </table>
                                    {biddingStatus === THUNK_API_STATUS.PENDING && (
                                        <div
                                            style={{
                                                minHeight: `${biddingData.limit === 10 && '720px'}`,
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
                                            current={biddingData.currentPage}
                                            total={biddingData.totalDocs}
                                            onChange={(page, pageSize) => {
                                                handlePagination(page);
                                            }}
                                            showSizeChanger={false}
                                            onShowSizeChange={(_, size) => {
                                                // setLimit(size);
                                                // updateQueryParams({
                                                //     limit: size,
                                                // });
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* </Modal> */}
                </ReactWindow>
            )}
        </>
    );
};

export default LandBiddingModal;
