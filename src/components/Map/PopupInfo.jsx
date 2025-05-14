import { createPortal } from 'react-dom';
import { MdOutlineShare, MdClose } from "react-icons/md";
import { message } from 'antd'; // Thêm import message
import './index.scss';

const PopupInfo = ({ info, onClose, shouldIgnoreNextEffectRef }) => {
    if (!info) return null;

    const handleShare = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation();

        const lat = info.lat;
        const lng = info.lng;
        const zoom = 17;

        const shareUrl = `http://landinvest.com.vn/?heat-view=map&vitri=${lat},${lng}&zoom=${zoom}`;
        // const shareUrl = `http://localhost:4000/?heat-view=map&vitri=${lat},${lng}&zoom=${zoom}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            // Hiển thị thông báo toast khi sao chép liên kết
            message.success('Đã sao chép liên kết!', 1.5); // Thời gian hiển thị 1.5 giây
        });

        if (shouldIgnoreNextEffectRef?.current !== undefined) {
            shouldIgnoreNextEffectRef.current = true;
            console.log('[SHARE] Đã bật flag shouldIgnoreNextEffectRef');
        }
    };

    const getDetailAddress = (name, address) => {
        let detail = address;
        if (address.startsWith(name + ",")) {
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
                <div className='popupText'>
                    <div>
                        <div className="title">{info.name}</div>
                        <div className="address">{getDetailAddress(info.name, info.address)}</div>
                        <hr style={{ marginTop: '2.5px' }} className='line'/>
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
        document.body // Portal ra ngoài <MapContainer />
    );
};

export default PopupInfo;