import parse from 'html-react-parser';
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { CiCircleMinus, CiLocationOn } from 'react-icons/ci';
import { useParams } from 'react-router-dom';
import { getAllDetail } from '../../../services/api';
import './Detail.scss';
const Detail = () => {
    const [detailData, setDetailData] = useState({});
    const [dataPosition, setDataPosition] = useState('');
    const [dataImageRepresent, setDataImageRepresent] = useState('');
    const [dataExtension, setDataExtension] = useState('');
    const { projectId } = useParams(); // Get project ID from URL params
    const [imageHeader, setImageHeader] = useState('');
    const iconText = () => {
        return <CiCircleMinus />;
    };
    const handleConvert = (string) => {
        if (!string) return '';

        return (
            string
                // Chuyển đổi [img]URL[/img] -> <img src="URL" />
                .replace(/\[img\](.*?)\[\/img\]/g, '<div className="image-container"><img src="$1"/> </div>')
                // Chuyển đổi { -> <div> và } -> </div>
                .replace(/{/g, `<div className="icon-container"> - `)
                .replace(/}/g, '</div>')
                // Chuyển đổi "text: value" nhưng KHÔNG thay đổi dấu ":" trong URL
                .replace(/(^|\n)([^.\n]+):\s*(?!\/\/)/g, '$1<b> $2</b>: ')
        );
        // .replaceAll(':', ': ');
    };

    const handleConvertExtension = (string) => {
        if (!string) return '';
        return string
            .replace(/\[img\](.*?)\[\/img\]/g, '<div className="extention-image-container"><img src="$1"/> </div>')
            .replace(/{/g, `<div className=""> - `)
            .replace(/}/g, '</div>')
            .replace(/(^|\n)([^.\n]+):\s*(?!\/\/)/g, '$1<b> $2</b>: ');
    };

    useEffect(() => {
        fetchDetailData(); // Fetch data when `projectId` changes
    }, [projectId]);

    const fetchDetailData = async () => {
        const res = await getAllDetail(projectId);
        if (res && res.data) {
            setDetailData(res.data);
            setDataExtension(res.data.tienIch || '');
            setDataPosition(res.data.viTriDesc || '');
            setDataImageRepresent(res.data.images || '');
            setImageHeader(res.data.images);
        } else {
            setDetailData({});
            setDataPosition('');
            setDataImageRepresent('');
            setImageHeader('');
        }
    };

    const getBadgeClass = (status) => {
        return status === 'Đã bàn giao' ? 'badge bg-success' : 'badge bg-primary';
    };

    const processDataRepresent = (data) => {
        const regex = /\[img\](.*?)\[\/img\]/g;
        const processedItems = [];
        const imageMatches = [];
        let match;

        while ((match = regex.exec(data)) !== null) {
            imageMatches.push(match[1]);
        }

        let remainingText = data.replace(regex, '').replace(/[{}]/g, '');
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

    const imageRepresent = dataImageRepresent ? processDataRepresent(dataImageRepresent) : [];
    const contentHeader = imageRepresent.find((_, index) => index === +projectId);

    return (
        <div style={{ backgroundColor: '#343a40' }}>
            <div className="container-md">
                <div className="detail-container">
                    <div className="detail-image">
                        {contentHeader && contentHeader.image && (
                            <img src={contentHeader.image} alt={contentHeader.description} />
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
                                                    <span
                                                        className={`inform-data-status ${getBadgeClass(
                                                            detailData.trangThai,
                                                        )}`}
                                                    >
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
                                    <div className="location-content">{parse(handleConvert(dataPosition))}</div>
                                </div>

                                <div className="extension-container">
                                    <h2 className="extension-name">Tiện ích</h2>
                                    <div className="extension-content" style={{ color: '#fff' }}>
                                        {parse(handleConvertExtension(dataExtension))}
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
