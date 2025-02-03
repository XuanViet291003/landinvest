import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { CiBookmark, CiLocationOn } from 'react-icons/ci';
import { FaArrowRightLong } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { getAllDetail } from '../../../services/api';
import './Detail.scss';

const Detail = () => {
    const [detailData, setDetailData] = useState({});
    const [dataImage, setDataImage] = useState('');
    const [dataPosition, setDataPosition] = useState('');
    const [dataImageRepresent, setDataImageRepresent] = useState('');
    const { projectId } = useParams(); // Lấy tham số từ URL

    useEffect(() => {
        getApi(); // Gọi API khi projectId thay đổi
    }, [projectId]); // Cập nhật khi projectId thay đổi

    const getApi = async () => {
        let res = await getAllDetail(projectId);
        console.log(res); // Debug log API response
        if (res && res.data) {
            setDetailData(res.data);
            setDataImage(res.data.tienIch); // Dữ liệu tiện ích
            setDataPosition(res.data.viTriDesc); // Dữ liệu mô tả vị trí
            setDataImageRepresent(res.data.images);
        } else {
            setDetailData({});
            setDataImage(''); // Đảm bảo dataImage luôn được khởi tạo đúng
            setDataPosition(''); // Đảm bảo dataPosition luôn được khởi tạo đúng
            setDataImageRepresent('');
        }
    };

    let newClassName = '';
    if (detailData.trangThai === 'Đã bàn giao') {
        newClassName = 'badge bg-success';
    } else {
        newClassName = 'badge bg-primary';
    }
    const processDataRepresent = (data) => {
        const regex = /\[img\](.*?)\[\/img\]/g;
        const processedItems = [];
        let match;
        let imageMatches = [];
        while ((match = regex.exec(data)) !== null) {
            imageMatches.push(match[1]);
        }

        let remainingText = data.replace(regex, '');
        remainingText = remainingText.replace(/[{}]/g, '');

        const textItems = remainingText
            .split(/\s*(?=\n|,|;|\.)\s*/)
            .map((item) => item.trim())
            .filter((item) => item !== '');

        const maxLength = Math.max(imageMatches.length, textItems.length);

        // Kết hợp các phần mô tả và hình ảnh lại
        for (let i = 0; i < maxLength; i++) {
            processedItems.push({
                image: imageMatches[i] || '',
                description: textItems[i] || '',
            });
        }

        return processedItems;
    };
    // Hàm xử lý dữ liệu để tách ảnh và mô tả
    const processData = (data) => {
        const regex = /\[img\](.*?)\[\/img\]/g;
        const processedItems = [];
        let match;
        // Tìm kiếm các ình ảnh trong data
        let imageMatches = [];
        while ((match = regex.exec(data)) !== null) {
            imageMatches.push(match[1]);
        }
        // Cắt phần văn bản còn lại (không phải hình ảnh)
        let remainingText = data.replace(regex, '');

        // Xoá toàn bộ dấu { và } trong dữ liệu văn bản
        remainingText = remainingText.replace(/[{}]/g, '');

        // Phân chia các đoạn văn bản thành các phần mô tả
        const textItems = remainingText
            .split(/\s*(?=\n|,|;|\.)\s*/)
            .map((item) => item.trim())
            .filter((item) => item !== '');

        const maxLength = Math.max(imageMatches.length, textItems.length);

        // Kết hợp các phần mô tả và hình ảnh lại
        for (let i = 0; i < maxLength; i++) {
            processedItems.push({
                image: imageMatches[i] || '',
                description: textItems[i] || '',
            });
        }

        return processedItems;
    };

    // Xử lý dữ liệu vị trí
    const processPosition = (data) => {
        const regex = /\[img\](.*?)\[\/img\]/g;
        const processedItems = [];
        let match;

        let imageMatches = [];
        while ((match = regex.exec(data)) !== null) {
            imageMatches.push(match[1]);
        }

        let remainingText = data.replace(regex, '');
        remainingText = remainingText.replace(/[{}]/g, '');

        const textItems = remainingText
            .split(/\s*(?=\n|,|;|\.)\s*/)
            .map((item) => item.trim())
            .filter((item) => item !== '');

        const maxLength = Math.max(imageMatches.length, textItems.length);

        for (let i = 0; i < maxLength; i++) {
            processedItems.push({
                image: imageMatches[i] || '',
                description: textItems[i] || '',
            });
        }

        return processedItems;
    };

    // Chuyển đổi dữ liệu tiện ích thành mảng các item
    const items = dataImage ? processData(dataImage) : [];
    const positionItems = dataPosition ? processPosition(dataPosition) : [];
    const imageRepresent = dataImageRepresent ? processDataRepresent(dataImageRepresent) : [];

    const contentHeader = imageRepresent.find((item, index) => {
        return index === +projectId;
    });
    if (contentHeader && contentHeader.image) {
        console.log(contentHeader.image);
    } else {
        console.log('Không tìm thấy hình ảnh hoặc phần tử không tồn tại.');
    }

    return (
        <div style={{ backgroundColor: '#343a40' }}>
            <div className="container-md">
                <div className="detail-container">
                    <div className="detail-image">
                        {contentHeader && contentHeader.image && (
                            <img src={contentHeader.image} title={contentHeader.description} />
                        )}
                    </div>
                    {detailData && (
                        <div className="row" key={detailData.id}>
                            <div className="detail-content">
                                <div className="detail-content-inform">
                                    <h2 className="content-inform-header">{detailData.tenDuAn}</h2>
                                    <div className="content-inform-data">
                                        <div className="inform-data-location">
                                            <div className="inform-data-box">
                                                <div>
                                                    <CiLocationOn className="inform-data-icon" />
                                                    <span className="inform-data-address">{detailData.viTri}</span>
                                                </div>
                                                <div>
                                                    <span className={`inform-data-status ${newClassName}`}>
                                                        {detailData.trangThai}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="inform-data-content">
                                            <div className="data-content-container">
                                                <div>
                                                    <span className="data-content-title">Diện tích:</span>
                                                    <span className="data-content-text">{detailData.dienTich}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Mật độ xây dựng:</span>
                                                    <span className="data-content-text">{detailData.matDoXayDung}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Bàn giao dự kiến:</span>
                                                    <span className="data-content-text">
                                                        {detailData.banGiaoDuKien}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Loại hình:</span>
                                                    <span className="red-content">{detailData.loaiHinh}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-content-location">
                                    <h2 className="content-location-name">Vị trí</h2>
                                    <div>
                                        {positionItems.length > 0 ? (
                                            positionItems.map((item, index) => (
                                                <div key={index} className="position-item">
                                                    {item.image !== '' && (
                                                        <>
                                                            <div
                                                                style={{
                                                                    textAlign: 'center',
                                                                    marginBottom: '16px',
                                                                    marginTop: '16px',
                                                                }}
                                                            >
                                                                <img
                                                                    src={item.image}
                                                                    alt="Image"
                                                                    width={'80%'}
                                                                    height={400}
                                                                />
                                                            </div>
                                                            <p
                                                                style={{
                                                                    marginTop: '16px',
                                                                    fontWeight: 500,
                                                                    color: '#FFF',
                                                                }}
                                                            >
                                                                <FaArrowRightLong
                                                                    style={{ color: 'red', marginRight: '10px' }}
                                                                />

                                                                {item.description}
                                                            </p>
                                                        </>
                                                    )}
                                                    {/* {item.image !== '' && <img src={item.image} alt="Image" />}
                                                    {item.description && <p>{item.description}</p>} */}
                                                </div>
                                            ))
                                        ) : (
                                            <p>Không có thông tin về vị trí.</p>
                                        )}
                                    </div>
                                </div>

                                <div className="forum-content">
                                    <h2 className="forum-title">Tiện ích</h2>
                                    <div className="forum-body">
                                        {items.length > 0 ? (
                                            items.map(
                                                (item, index) =>
                                                    item.image !== '' && (
                                                        <div key={index} className="forum-item">
                                                            <div className="forum-item-header">
                                                                <span className="forum-item-author">
                                                                    Người đăng: User {index + 1}
                                                                </span>
                                                                <span className="forum-item-time">
                                                                    Thời gian: {new Date().toLocaleString()}
                                                                </span>
                                                            </div>
                                                            <div className="forum-item-body">
                                                                <img
                                                                    src={item.image}
                                                                    alt="Image"
                                                                    className="forum-item-image"
                                                                />
                                                                <p style={{ fontSize: '18px' }}>
                                                                    <CiBookmark
                                                                        style={{
                                                                            color: 'blue',
                                                                            marginRight: '5px',
                                                                        }}
                                                                    />
                                                                    {item.description}
                                                                </p>
                                                            </div>
                                                            <div className="forum-item-footer">
                                                                <button className="like-button">Thích</button>
                                                                <button className="comment-button">Bình luận</button>
                                                            </div>
                                                        </div>
                                                    ),
                                            )
                                        ) : (
                                            <p>Không có tiện ích nào.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="footer" style={{ height: '200px', background: '#000', marginTop: '20px' }}></div>
        </div>
    );
};

export default Detail;
