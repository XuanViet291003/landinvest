import { Modal } from 'antd';
import React, { useState, useRef, useEffect, memo } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';

const TableDescription = ({ description }) => {
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
        const checkOverflow = () => {
            const element = descriptionRef?.current;
            if (element) {
                setTimeout(() => {
                    setIsOverflowing(element.scrollHeight > element.clientHeight);
                }, 0);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, []);

    return (
        <div className="land-cost-description-container">
            <p className="land-cost-description" ref={descriptionRef}>
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
                // closeIcon={<FaCircleMinus color="#fff" fontSize={16} />}
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

export default memo(TableDescription);
