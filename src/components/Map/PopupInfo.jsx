import { createPortal } from 'react-dom';
import { MdOutlineShare, MdClose } from 'react-icons/md';
import { message } from 'antd';
import { useMap } from 'react-leaflet';
import './index.scss';

const PopupInfo = ({ info, onClose }) => {
    // Lấy map instance từ context
    const map = useMap();
    if (!info) return null;

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

        const { lat, lng } = info;
        const zoom = 17;
        // const shareUrl = `http://localhost:4000/?heat-view=map&vitri=${lat},${lng}&zoom=${zoom}`;
        const shareUrl = `https://landinvest.com.vn//?heat-view=map&vitri=${lat},${lng}&zoom=${zoom}`;

        // Copy link share và thông báo cho người dùng
        navigator.clipboard.writeText(shareUrl).then(() => {
            message.success('Đã sao chép liên kết!', 1.5);
        });

        // Cập nhật URL mới vào history và di chuyển map tới vị trí đó
        window.history.pushState({}, '', shareUrl);
        map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });
    };

    const getDetailAddress = (name, address) => {
        let detail = address;
        if (address.startsWith(name + ',')) {
            detail = address.slice(name.length + 2);
        }
        return detail.replace(/\d{5,6}(, )?/g, '').trim();
    };

    return createPortal(
        <div className="fixed-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-content">
                <img
                    src="https://maps.gstatic.com/tactile/reveal/no_street_view_1x_030525.png"
                    alt="thumbnail"
                    style={{ width: '90px', height: '105px', marginRight: '9px' }}
                />
                <div className="popupText">
                    <div>
                        <div className="title">{info.name}</div>
                        <div className="address">{getDetailAddress(info.name, info.address)}</div>
                        <hr style={{ marginTop: '2.5px' }} className="line" />
                        <div className="coords">
                            {info.lat.toFixed(6)}, {info.lng.toFixed(6)}
                        </div>
                    </div>
                </div>
                <div className="actions">
                    <button type="button" className="share" onClick={handleShare}>
                        <MdOutlineShare />
                    </button>
                    <button type="button" className="close" onClick={onClose}>
                        <MdClose />
                    </button>
                </div>
            </div>
        </div>,
        document.body // Render Portal bên ngoài MapContainer
    );
};

export default PopupInfo;