import { message, Modal } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useState } from 'react';
import { CiShare2 } from 'react-icons/ci';
import { FaCircleMinus } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { ACTIONS } from '../../constants/commonKey';
import { LAND_COST_KEY, MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import LandCostTable from '../LandCostTable/LandCostTable';
import ReactWindow from 'reactjs-windows';

const LandCostModal = ({ isLandCostModalOpen, handleOk, handleCancel }) => {
    const currentLocation = useSelector((state) => state.searchQuery.searchResult);
    const provinceId = useSelector((state) => state.landCost.provinceId);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [messageApi, contextHolder] = message.useMessage();
    const [isSearchLoading, setIsSearchLoading] = useState();
    const [searchValue, setSearchValue] = useState();

    const [debouncedInputSearch] = useDebounce(searchValue, 500);

    const handleShareLocation = () => {
        const sharingUrl = `${window.location.href}&province=${provinceId}&district=${districtId}&share-type=${LAND_COST_KEY.SHARING}&ups=${ACTIONS.SHARING}`;

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

    const handleSearch = (value) => {
        setSearchValue(value);
        setIsSearchLoading(true);
        setTimeout(() => {
            setIsSearchLoading(false);
        }, 1000);
    };

    return (
        isLandCostModalOpen && (
            <ReactWindow title="Bảng giá đất" onClose={handleCancel}>
                <>
                    {contextHolder}
                    <div className="land-cost-area__wrapper">
                        <div className="land-cost-area__wrapper__header">
                            <span className="land-cost-area__wrapper__header--title">
                                *Bảng giá tại vị trí hiện tại bạn đang xem ở{' '}
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
                                <Search
                                    placeholder="Tìm kiếm quận huyện..."
                                    allowClear
                                    value={searchValue}
                                    onSearch={handleSearch}
                                    loading={isSearchLoading}
                                    size="middle"
                                    onChange={(e) => setSearchValue(e.target.value)}
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
                            *Bảng giá đất 2024 do chính phủ ban hành.
                        </span>
                        <p className="land-cost__container--notice">
                            Chú thích: Vị trí 1 là mặt tiền đường; Ví trí 2 là hẻm rộng trên 5m; Vị trí 3 là hẻm rộng 3m
                            - 5m; Vị trí 4 là hẻm rộng dưới 3m.
                        </p>
                        <p className="land-cost__container--notice">Modal này có thể chỉnh kích thước được.</p>
                        <p className="land-cost__container--notice">Giữ shift + lăn chuột để xem các cột tiếp theo</p>
                        <div>
                            <LandCostTable searchValue={debouncedInputSearch} tableType={MAP_TABLE_TYPE.ON_MAP} />
                        </div>
                    </div>
                </>
            </ReactWindow>
        )
    );
};

export default LandCostModal;
