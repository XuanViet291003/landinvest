import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import { FaLocationDot } from 'react-icons/fa6';

// Icon cho vị trí hiện tại
const iconHtml = ReactDOMServer.renderToStaticMarkup(
    <div style={{
        color: 'red',
        fontSize: '30px',
    }}>
        <FaLocationDot />
    </div>,
);

export const locationIcon = L.divIcon({
    html: iconHtml,
    className: '', // Loại bỏ class mặc định
    iconSize: [30, 30],
    iconAnchor: [15, 30], // Tâm của icon
});

// Icon cho dự án có polygon
export const projectIcon = new L.Icon({
    iconUrl: require('../../assets/du_an.png'),
    iconSize: [38, 38],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -38],
});

// Icon cho dự án không có polygon
export const projectNoPolygonIcon = new L.Icon({
    iconUrl: require('../../assets/icons8-home-48.png'),
    iconSize: [38, 38],
    iconAnchor: [22, 38],
    popupAnchor: [-3, -38],
});

// Icon mặc định
export const defaultIcon = new L.Icon({
    iconUrl: require('../../assets/marker.png'),
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5],
    popupAnchor: [-3, -38],
});

// Icon cho điểm đánh dấu
export const dotIcon = new L.DivIcon({
    className: 'custom-dot-icon',
    html: `<div></div>`,
    iconSize: [15, 15],
    iconAnchor: [7.5, 7.5],
});

// Icon cho nút lưu polygon
export const savePolygonIcon = L.divIcon({
    className: 'custom-icon',
    html: `<button style="background: #007bff; color: white;z-index : 1000; border: none; padding: 5px 10px; border-radius: 5px;">Lưu</button>`,
    iconSize: [50, 30],
}); 