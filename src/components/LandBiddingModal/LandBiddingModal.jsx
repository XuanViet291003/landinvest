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
            searchParams.delete(key);
        } else {
            searchParams.set(key, value.toString());
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
    const isMobile = window.innerWidth <= 768;

    const handleShareLocation = () => {
        const url = new URL(window.location.href);
        const params = new URLSearchParams(url.search);

        if (searchText) {
            params.set(LAND_BIDDING_KEY.TEXT_SEARCH, searchText);
        }
        params.set('district', districtId);
        params.set('ups', ACTIONS.BIDDING_SHARING);

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
                isMobile ? (
                    <Modal title="Danh sách đấu thầu" visible={isOpen} onCancel={handleCancel} footer={null}>
                        <div className="land-cost-area__wrapper">
                            <div className="land-cost-area__wrapper__header">
                                <span className="land-cost-area__wrapper__header--title">
                                    *Thông tin đấu thầu tại vị trí hiện tại bạn đang xem ở{' '}
                                    <span className="land-cost-area__wrapper__header--bold">
                                        {currentLocation.districtName} - {currentLocation.provinceName}.
                                    </span>
                                    <span className="land-cost-area__wrapper__header--share" onClick={handleShareLocation}>
                                        <CiShare2 size={16} /> Chia sẻ
                                    </span>
                                </span>
                            </div>
                            <p className="land-cost__container--notice">Modal này có thể chỉnh kích thước được.</p>
                        </div>
                    </Modal>
                ) : (
                    <ReactWindow title="Danh sách đấu thầu" onClose={handleCancel}>
                        <div className="land-cost-area__wrapper">
                            <div className="land-cost-area__wrapper__header">
                                <span className="land-cost-area__wrapper__header--title">
                                    *Thông tin đấu thầu tại vị trí hiện tại bạn đang xem ở{' '}
                                    <span className="land-cost-area__wrapper__header--bold">
                                        {currentLocation.districtName} - {currentLocation.provinceName}.
                                    </span>
                                    <span className="land-cost-area__wrapper__header--share" onClick={handleShareLocation}>
                                        <CiShare2 size={16} /> Chia sẻ
                                    </span>
                                </span>
                            </div>
                            <p className="land-cost__container--notice">Modal này có thể chỉnh kích thước được.</p>
                        </div>
                    </ReactWindow>
                )
            )}
        </>
    );
};

export default LandBiddingModal;