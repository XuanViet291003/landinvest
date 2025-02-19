import parse from 'html-react-parser';
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useState } from 'react';
import { CiLocationOn } from 'react-icons/ci';
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
    const [results, setResults] = useState([]);
    const [location, setLocation] = useState({});
    
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
            .replace(/{([^}]+)}/g, (match, content) => {
                // Nếu nội dung chứa "Ảnh thực tế ..." hoặc "Phối cảnh của ...", căn giữa và bỏ gạch đầu dòng
                if (/^(Ảnh thực tế|Phối cảnh)/.test(content.trim())) {
                    return `<div className="center-text">${content.trim()}</div>`;
                }
                return `<div className=""> - ${content.trim()}</div>`;
            })
            .replace(/(^|\n)([^.\n]+):\s*(?!\/\/)/g, '$1<b> $2</b>: ');
    };

    const convertData = (dataExtension) => {
        if (!dataExtension) return;

        const pattern = /\[img\](.*?)\[\/img\]\s*\{(.*?)\}/g;
        let matches;
        let extractedResults = [];

        while ((matches = pattern.exec(dataExtension)) !== null) {
            extractedResults.push({
                image: matches[1],
                content: matches[2],
            });
        }

        setResults(extractedResults); // Cập nhật state sau khi xử lý xong
    };

    useEffect(() => {
        fetchDetailData(); // Fetch data khi `projectId` thay đổi
        convertData(dataExtension);
    }, [projectId, dataExtension]); // Chỉ lắng nghe `projectId` và `dataExtension`

    useEffect(() => {
        console.log('>>> Check data: ', JSON.stringify(results));
    }, [results]); // Log kết quả mỗi khi `results` thay đổi
    const fetchDetailData = async () => {
        const res = await getAllDetail(projectId);
        if (res && res.data) {
            setDetailData(res.data);
            setDataExtension(res.data.tienIch || '');
            setDataPosition(res.data.viTriDesc || '');
            setDataImageRepresent(res.data.images || '');
            setImageHeader(res.data.images);
            const lat = parseFloat(res.data.toaDo.split(",")[0]);
            const lon = parseFloat(res.data.toaDo.split(",")[1]);
            console.log(lat);
            console.log(lon)
            setLocation({lat, lon});
        } else {
            setDetailData({});
            setDataPosition('');
            setDataImageRepresent('');
            setImageHeader('');
            setLocation({});
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
    const contentHeader = imageRepresent.find((_, index) => index === +projectId + 5);

    return (
        <div style={{ backgroundColor: '#343a40', paddingBottom: "150px" }}>
            <div className="container-md">
                <div className="detail-container">
                        {contentHeader && contentHeader.image && (
                            <div className="detail-image">
                                <img src={contentHeader.image} alt={contentHeader.description} />
                            </div>
                        )}
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
                                                    <span className="data-content-text">{detailData.loaiHinh}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Chủ đầu tư:</span>
                                                    <span className="data-content-text">{detailData.chuDauTu}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Công trình công cộng:</span>
                                                    <span className="data-content-text">{detailData.congTrinhCongCong}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Diện tích xây dựng:</span>
                                                    <span className="data-content-text">{detailData.dienTichXayDung}</span>
                                                </div>
                                                <div>
                                                    <span className="data-content-title">Tổng vốn đầu tư:</span>
                                                    <span className="data-content-text">{detailData.tongVonDauTu}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="detail-content-location">
                                    <h2 className="content-location-name">Vị trí</h2>
                                    <div className="location-content">{parse(handleConvert(dataPosition))}</div>
                                    {(location.lat && location.lon) && (
                                      <MapContainer 
                                          center={[location.lat, location.lon]} 
                                          zoom={15} 
                                          style={{ margin: "10px auto", height: "50vh", width: "70%" }} 
                                      >
                                        <TileLayer
                                            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            subdomains='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        />
                                          <Marker position={[location.lat, location.lon]} />
                                      </MapContainer>
                                    )}
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
        </div>
    );
};

export default Detail;
