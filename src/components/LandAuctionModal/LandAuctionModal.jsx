import { message, Modal } from 'antd';
import React from 'react';
import { FaCircleMinus } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { ACTIONS } from '../../constants/commonKey';
import { MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import LandAuctionTable from '../LandAuctionTable/LandAuctionTable';
import { LAND_AUCTION_KEYS } from '../../constants/LandAuctionKey';
import { CiShare2 } from 'react-icons/ci';
import ReactWindow from 'reactjs-windows';

const isMobile = window.innerWidth <= 768;

const LandAuctionModal = ({ isLandAuctionModalOpen, handleOk, handleCancel }) => {
    const currentLocation = useSelector((state) => state.searchQuery.searchResult);
    const provinceId = useSelector((state) => state.landCost.provinceId);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [messageApi, contextHolder] = message.useMessage();

    const handleShareLocation = () => {
        const sharingUrl = `${window.location.href}&act=dau-gia&province=${provinceId}&district=${districtId}&share-type=${LAND_AUCTION_KEYS.SHARING}&ups=${ACTIONS.SHARING}`;

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

    return (
        <>
            {isLandAuctionModalOpen && (
                isMobile ? (
                    <Modal title="Danh sách đấu giá" open={isLandAuctionModalOpen} onCancel={handleCancel} footer={null}>
                        {contextHolder}
                        <div>
                            <p>
                                *Bảng giá đấu giá tại vị trí hiện tại bạn đang xem ở{' '}
                                <strong>
                                    {currentLocation.districtName} - {currentLocation.provinceName}.
                                </strong>
                            </p>
                            <p onClick={handleShareLocation} style={{ cursor: 'pointer', color: 'blue' }}>
                                <CiShare2 size={16} /> Chia sẻ
                            </p>
                            <LandAuctionTable tableType={MAP_TABLE_TYPE.ON_MAP} handleClose={handleCancel} />
                        </div>
                    </Modal>
                ) : (
                    <ReactWindow title="Danh sách đấu giá" onClose={handleCancel}>
                        {contextHolder}
                        <div className="land_modal__wrapper">
                            <div className="land-cost-area__wrapper">
                                <div className="land-cost-area__wrapper__header">
                                    <span className="land-cost-area__wrapper__header--title">
                                        *Bảng giá đấu giá tại vị trí hiện tại bạn đang xem ở{' '}
                                        <span className="land-cost-area__wrapper__header--bold">
                                            {currentLocation.districtName} - {currentLocation.provinceName}.
                                        </span>
                                        <span className="land-cost-area__wrapper__header--share" onClick={handleShareLocation}>
                                            <CiShare2 size={16} /> Chia sẻ
                                        </span>
                                    </span>
                                    <FaCircleMinus color="#fff" fontSize={26} className="land-cost-area__wrapper__header--icon" onClick={handleCancel} />
                                </div>
                                <p className="land-cost__container--notice" style={{ marginTop: '13px' }}>
                                    Modal này có thể chỉnh kích thước được.
                                </p>
                                <p className="land-cost__container--notice">Giữ shift + lăn chuột để xem các cột tiếp theo</p>
                                <LandAuctionTable tableType={MAP_TABLE_TYPE.ON_MAP} handleClose={handleCancel} />
                            </div>
                        </div>
                    </ReactWindow>
                )
            )}
        </>
    );
};

export default LandAuctionModal;
