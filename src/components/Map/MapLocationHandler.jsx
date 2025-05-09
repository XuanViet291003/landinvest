// import React, { useState, useEffect, memo } from 'react';
// import { Modal, Table, Button, Input, message } from 'antd';
// import { ShareAltOutlined } from '@ant-design/icons';

// // import './ShareLocationPopup.css'; // Tạo file CSS riêng nếu cần

// const MapLocationHandler = ({
//     isOpen,
//     onClose,
//     locationData, // Dữ liệu vị trí để hiển thị (có thể là object hoặc array)
//     location, // Tọa độ [lat, lng] để tạo liên kết
// }) => {
//     const [shareableLink, setShareableLink] = useState('');
//     const [messageApi, contextHolder] = message.useMessage();

//     useEffect(() => {
//         if (location && location.length === 2) {
//             // Tạo liên kết chia sẻ dựa trên tọa độ (ví dụ: Google Maps)
//             const link = `https://landinvest.com.vn/?heat-view=map&vitri=${location[0]}%2C${location[1]}&zoom=17`;
//             setShareableLink(link);
//         } else {
//             setShareableLink('');
//         }
//     }, [location]);

//     const columns = React.useMemo(() => {
//         if (Array.isArray(locationData) && locationData.length > 0) {
//             return Object.keys(locationData[0]).map((key) => ({
//                 title: key.toUpperCase(), // Hiển thị tên trường viết hoa
//                 dataIndex: key,
//                 key: key,
//             }));
//         } else if (typeof locationData === 'object' && locationData !== null) {
//             return Object.keys(locationData).map((key) => ({
//                 title: key.toUpperCase(),
//                 dataIndex: key,
//                 key: key,
//             }));
//         } else {
//             return [];
//         }
//     }, [locationData]);

//     const dataSource = React.useMemo(() => {
//         if (Array.isArray(locationData)) {
//             return locationData;
//         } else if (typeof locationData === 'object' && locationData !== null) {
//             return [locationData]; // Chuyển object thành array để hiển thị trong Table
//         } else {
//             return [];
//         }
//     }, [locationData]);

//     const copyToClipboard = () => {
//         if (shareableLink) {
//             navigator.clipboard.writeText(shareableLink);
//             messageApi.success('Đã sao chép liên kết');
//         } else {
//             messageApi.warning('Không có liên kết để sao chép');
//         }
//     };

//     return (
//         <Modal
//             title="Thông tin Vị trí"
//             open={isOpen}
//             onCancel={onClose}
//             footer={[
//                 <Button key="back" onClick={onClose}>
//                     Đóng
//                 </Button>,
//             ]}
//             width={600}
//         >
//             {contextHolder}
//             {locationData && columns.length > 0 ? (
//                 <Table
//                     columns={columns}
//                     dataSource={dataSource}
//                     pagination={false} // Tắt pagination nếu không cần thiết
//                     scroll={{ x: 'max-content' }}
//                 />
//             ) : (
//                 <p>Không có dữ liệu để hiển thị.</p>
//             )}

//             {location && location.length === 2 && (
//                 <div className="share-link-container">
//                     <Input
//                         value={shareableLink}
//                         readOnly
//                         style={{ width: '70%', marginRight: '10px' }}
//                     />
//                     <Button
//                         icon={<ShareAltOutlined />}
//                         onClick={copyToClipboard}
//                         type="primary"
//                     >
//                         Chia sẻ
//                     </Button>
//                 </div>
//             )}
//         </Modal>
//     );
// };

// export default memo(MapLocationHandler);



import React, { useEffect, useState, memo } from 'react';
import { MdClose } from 'react-icons/md'; // Dùng icon đóng
import { Input, message, Button } from 'antd';
import { ShareAltOutlined } from '@ant-design/icons';

const MapLocationHandler = ({
    isOpen,
    onClose,
    locationData,
    location,
}) => {
    const [shareableLink, setShareableLink] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const zoom = 17;
    useEffect(() => {
        if (location && location.length > 0) {
            const link = `https://landinvest.com.vn/?heat-view=map&vitri=${location[0]}%2C${location[1]}&zoom=${zoom}`;
            setShareableLink(link);
        } else {
            setShareableLink('');
        }
    }, [location]);

    const getDetailAddress = (name, address) => {
        return address ? `${name}, ${address}` : name;
    };

    const info = {
        name: locationData?.name || 'Chưa rõ tên',
        address: locationData?.address || '',
        lat: location?.[0]?.toFixed(6),
        lng: location?.[1]?.toFixed(6),
    };

    const copyToClipboard = () => {
        if (shareableLink) {
            navigator.clipboard.writeText(shareableLink);
            messageApi.success('Đã sao chép liên kết');
        } else {
            messageApi.warning('Không có liên kết để sao chép');
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {contextHolder}
            <div className="fixed-popup">
                <div className="popup-content">
                    <img
                        src="https://maps.gstatic.com/tactile/reveal/no_street_view_1x_030525.png"
                        alt="thumbnail"
                        style={{ width: '90px', height: '100px', marginRight: '10px' }}
                    />
                    <div style={{ width: '220px', height: '100px', marginTop: '-15px', marginRight: '9px' }}>
                        <div>
                            <div className="title">{info.name}</div>
                            <div className="address">{getDetailAddress(info.name, info.address)}</div>
                            <hr style={{ marginTop: '3px' }} />
                            <div className="coords">{info.lat}, {info.lng}</div>
                            <div style={{ marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                <Input
                                    value={shareableLink}
                                    readOnly
                                    style={{ width: '70%', marginRight: '10px' }}
                                />
                                <Button
                                    icon={<ShareAltOutlined />}
                                    onClick={copyToClipboard}
                                    type="primary"
                                    size="small"
                                >
                                    Chia sẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="actions">
                        <button type="button" className="close" onClick={onClose}>
                            <MdClose size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default memo(MapLocationHandler);