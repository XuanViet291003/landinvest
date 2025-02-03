import { Modal } from 'antd';
import { memo } from 'react';

function LandTableModal({ isOpenLandModal, handleCloseLandModal, showLandCostModal, showAuctionModal, showBiddingModal }) {
    return (
        <>
            <Modal
                open={isOpenLandModal}
                title="Danh sách bảng giá ở vị trí hiện tại"
                footer={null}
                centered
                onCancel={handleCloseLandModal}
            >
                <div className="land-table">
                    <div
                        className="list-item"
                        onClick={() => {
                            showLandCostModal();
                            handleCloseLandModal();
                        }}
                    >
                        <div className="item">
                            <div className="item-text">Bảng giá đất</div>
                        </div>
                    </div>
                    <div
                        className="list-item"
                        onClick={() => {
                            showAuctionModal();
                            handleCloseLandModal();
                        }}
                    >
                        <div className="item">
                            <div className="item-text">Danh sách đấu giá</div>
                        </div>
                    </div>
                    <div
                        className="list-item"
                        onClick={() => {
                            showBiddingModal();
                            handleCloseLandModal();
                        }}
                    >
                        <div className="item">
                            <div className="item-text">Thông tin đấu thầu</div>
                        </div>
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default memo(LandTableModal);
