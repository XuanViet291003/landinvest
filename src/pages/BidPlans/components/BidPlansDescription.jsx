import { Modal, Typography } from 'antd';
import React, { useState, useRef, useEffect, memo } from 'react';
import { FaCircleMinus } from 'react-icons/fa6';

const { Text } = Typography;

const BidPlansDescription = ({ description, maxLines = 3 }) => {
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => setIsModalOpen(true);
    const handleCancel = () => setIsModalOpen(false);

    useEffect(() => {
        const checkOverflow = () => {
            if (descriptionRef.current) {
                const element = descriptionRef.current;
                // Calculate if content exceeds maxLines
                const lineHeight = parseInt(getComputedStyle(element).lineHeight);
                const maxHeight = lineHeight * maxLines;
                setIsOverflowing(element.scrollHeight > maxHeight);
            }
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);
        return () => window.removeEventListener('resize', checkOverflow);
    }, [description, maxLines]);

    if (!description) return 'N/A';

    return (
        <div className="bid-plans-description-container">
            <Text
                ref={descriptionRef}
                ellipsis={{
                    rows: maxLines,
                    expandable: false,
                    tooltip: isOverflowing ? description : null
                }}
                style={{
                    whiteSpace: 'pre-line',
                    marginBottom: isOverflowing ? '8px' : 0
                }}
            >
                {description}
            </Text>
            
            {isOverflowing && (
                <Text 
                    type="link" 
                    onClick={showModal}
                    style={{ 
                        display: 'block',
                        marginTop: '4px'
                    }}
                >
                    Xem chi tiết
                </Text>
            )}

            <Modal
                closable={false}
                footer={null}
                centered
                open={isModalOpen}
                onCancel={handleCancel}
                className="bid-plans-description-modal"
                width={800}
            >
                <div className="modal-content-wrapper">
                    <div className="modal-header">
                        <span className="modal-title">Mô tả chi tiết</span>
                        <FaCircleMinus
                            className="close-icon"
                            onClick={handleCancel}
                        />
                    </div>
                    <div className="modal-body">
                        <Text style={{ whiteSpace: 'pre-line' }}>
                            {description}
                        </Text>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default memo(BidPlansDescription);