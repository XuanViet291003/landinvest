import { message, Modal } from 'antd';
import Search from 'antd/es/input/Search';
import React, { useState, useEffect } from 'react';
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
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const [debouncedInputSearch] = useDebounce(searchValue, 500);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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

    const modalContent = (
        <div style={{ backgroundColor: '#0b0a0a', color: '#eae5e5', padding: '20px', borderRadius: '8px' }}>
            {contextHolder}
            <div className="land-cost-area__wrapper">
                <div className="land-cost-area__wrapper__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="land-cost-area__wrapper__header--title">
                        Bảng giá tại vị trí bạn đang xem ở
                        <strong> {currentLocation.districtName} - {currentLocation.provinceName}.</strong>
                        <span className="land-cost-area__wrapper__header--share" onClick={handleShareLocation} style={{ marginLeft: '10px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center' }}>
                            <CiShare2 size={16} /> Chia sẻ
                        </span>
                    </span>
                    <FaCircleMinus
                        color="#fff"
                        fontSize={24}
                        className="land-cost-area__wrapper__header--icon"
                        onClick={handleCancel}
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <Search
                    placeholder="Tìm kiếm quận huyện..."
                    allowClear
                    value={searchValue}
                    onSearch={handleSearch}
                    loading={isSearchLoading}
                    size="middle"
                    onChange={(e) => setSearchValue(e.target.value)}
                    style={{ margin: '10px 0', width: '100%' }}
                />
                <p>*Bảng giá đất 2024 do chính phủ ban hành.</p>
                <p>Chú thích: Vị trí 1 là mặt tiền đường; Vị trí 2 là hẻm rộng trên 5m; Vị trí 3 là hẻm rộng 3m - 5m; Vị trí 4 là hẻm rộng dưới 3m.</p>
                <LandCostTable searchValue={debouncedInputSearch} tableType={MAP_TABLE_TYPE.ON_MAP} />
            </div>
        </div>
    );

    return isLandCostModalOpen ? (
        isMobile ? (
            <Modal title={<span style={{ color: '#171616' }}>Bảng giá đất</span>} visible={isLandCostModalOpen} onCancel={handleCancel} footer={null} width="80vw" bodyStyle={{ backgroundColor: '#fffdfd', color: '#100e0e' }}>
                {modalContent}
            </Modal>
        ) : (
            <ReactWindow title="Bảng giá đất" onClose={handleCancel} width={500} height={400} style={{ backgroundColor: '#100f0f', color: '#131313' }}>
                {modalContent}
            </ReactWindow>
        )
    ) : null;
};

export default LandCostModal;