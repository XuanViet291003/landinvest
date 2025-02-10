import React, { useState } from 'react';
import { List } from 'antd';
import { useSelector } from 'react-redux';
import ModalLogin from '../Auth/ModalNotification';
import { FaList } from 'react-icons/fa';

const ListRegulations = ({ RegulationsImagesList, handleItemClick }) => {
    const [isVisible, setIsVisible] = useState(false); // Trạng thái hiển thị danh sách
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const [isShowLoginModal, setIsShowLoginModal] = useState(false);
    const isEmpty = !RegulationsImagesList || RegulationsImagesList.length === 0;

    const getTotalHeight = (items) => {
        const itemCount = items?.length;
        if (itemCount === 0) return '50px';
        if (itemCount <= 10) return `${itemCount * 7}vh`;
        return '100vh';
    };

    const handleCloseIsLoginModal = () => {
        setIsShowLoginModal(false);
    };

    const toggleVisibility = () => {
        setIsVisible(!isVisible); // Toggle trạng thái hiển thị
    };

    return (
        <div>
            {/* Icon để mở danh sách */}
            <div
                className="icon-wrapper-regulation"
                onClick={(event) => {
                    event.stopPropagation(); // Ngăn sự kiện lan truyền
                    toggleVisibility(); // Thay đổi trạng thái hiển thị danh sách
                }}
            >
                <FaList style={{ fontSize: '30px', cursor: 'pointer' }} />
            </div>

            {/* Danh sách quy hoạch */}
            {isVisible && (
                <div
                    className="list-wrapper-regulation"
                    style={{ height: getTotalHeight(RegulationsImagesList) }}
                >
                    <div className="list-regulations">
                        <p>Bản đồ quy hoạch</p>
                        {isEmpty ? (
                            <div className="no-data">Không có dữ liệu</div>
                        ) : (
                            RegulationsImagesList.map((item, index) => (
                                <div className="list-wrapper" key={index}>
                                    <List
                                        size="small"
                                        bordered
                                        dataSource={[item]}
                                        renderItem={(district) => (
                                            <List.Item
                                                style={{ color: '#fff', fontWeight: '400' }}
                                                className="text-list"
                                                key={district.idDistrict}
                                                onClick={() => {
                                                    if (!isAuthenticated) {
                                                        setIsShowLoginModal(true);
                                                        return;
                                                    }
                                                    handleItemClick(item); // Xử lý khi click vào bounding box
                                                    handleItemClick(
                                                        item.boundingbox,
                                                        item.type,
                                                        item.nam_het_han
                                                    );
                                                }}
                                            >
                                                {item.description || 'No description'}
                                            </List.Item>
                                        )}
                                        locale={{ emptyText: 'Không có dữ liệu' }}
                                    />
                                </div>
                            ))
                        )}
                    </div>
                    <ModalLogin
                        handleClose={handleCloseIsLoginModal}
                        show={isShowLoginModal}
                    />
                </div>
            )}
        </div>
    );
};

export default ListRegulations;
