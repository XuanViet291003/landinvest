import { Modal } from 'antd';
import React, { useState, useRef, useEffect, memo } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';

const LandCostDescription = ({ description, oneLine = false }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        const checkIsOverFlow = () => {
            const element = descriptionRef?.current;
            if (element) {
                setTimeout(() => {
                    if (element.scrollHeight > element.clientHeight) {
                        setIsOverflowing(true);
                    }
                }, 0);
            }
        };
        checkIsOverFlow();
        window.addEventListener('resize', checkIsOverFlow);
        return () => window.removeEventListener('resize', checkIsOverFlow);
    }, []);

    return (
        <div className="land-cost-description-container">
            <p className={`land-cost-description ${oneLine ? 'one-line' : ''}`} ref={descriptionRef}>
                {description}
            </p>
            {isOverflowing && (
                <span className="land-cost-detail" onClick={showModal}>
                    Xem chi tiết
                </span>
            )}
            <Modal
                closable={false}
                footer={<></>}
                center
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                className="land-cost-description-modal"
            >
                <div className="land-const-detail__wrapper">
                    <div className="lant-cost-detail__header">
                        <span></span>
                        <span className="lant-cost-detail__header--title">Mô tả chi tiết</span>
                        <FaCircleMinus
                            color="#fff"
                            fontSize={24}
                            className="lant-cost-detail__header--icon"
                            onClick={handleCancel}
                        />
                    </div>
                    <p className="land-cost-description--detail">{description}</p>
                </div>
            </Modal>
        </div>
    );
};

export default memo(LandCostDescription);
