import { useState, useEffect } from 'react'
import { MdOutlineShare } from "react-icons/md";
import { MdClose } from "react-icons/md";
import './index.scss';

const PopupInfo = ({ info, onClose, shouldIgnoreNextEffectRef }) => {
    const [copied, setCopied] = useState(false);

    // useEffect(() => {
    //     if (!info) return;
    //     const timer = setTimeout(() => {
    //         onClose();
    //     }, 10000);
    //     return () => clearTimeout(timer);
    // }, [info, onClose]);

    if (!info) return null;

    const handleShare = (e) => {
        e.preventDefault(); // NGĂN hành vi mặc định nếu có
        e.stopPropagation(); // NGĂN BUBBLE nếu cha có handler click
        if (e.nativeEvent) e.nativeEvent.stopImmediatePropagation(); 

        const lat = info.lat;
        const lng = info.lng;
        const zoom = 17 // zoom cố định
        console.log('[SHARE] lat:', info.lat, 'lng:', info.lng);

        // link shareURL
        // const shareUrl = `https://landinvest.com.vn/?heat-view=map&vitri=${lat}%2C${lng}&zoom=${zoom}`;
        const shareUrl = `http://localhost:4000/?heat-view=map&vitri=${lat}%2C${lng}&zoom=${zoom}`;

        navigator.clipboard.writeText(shareUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });

        // Cờ để MapView không set lại popupInfo
        if (shouldIgnoreNextEffectRef?.current !== undefined) {
            shouldIgnoreNextEffectRef.current = true;
            console.log('[SHARE] Đã bật flag shouldIgnoreNextEffectRef');
        }
    };

    // Hàm tách phần địa chỉ chi tiết
    const getDetailAddress = (name, address) => {
        let detail = address;
        if (address.startsWith(name + ",")) {
            detail = address.slice(name.length + 2); // bỏ "Tên, " đầu chuỗi
        }
        // Loại bỏ mã bưu điện (5 hoặc 6 chữ số)
        return detail.replace(/\d{5,6}(, )?/g, '').trim();
    };
    return (
        <div className='fixed-popup'>
            <div className='popup-content'>
                <img
                    src="https://maps.gstatic.com/tactile/reveal/no_street_view_1x_030525.png"
                    alt="thumbnail"
                    style={{ width: '90px', height: '100px', marginRight: '10px' }}
                />
                <div style={{ width: '220px', height: '100px', marginTop: '-15px', marginRight: '9px' }}>
                    <div >
                        <div className='title'>{info.name}</div>
                        <div className='address'>{getDetailAddress(info.name, info.address)}</div>
                        <hr style={{ marginTop: '3px' }} />
                        <div className='coords'>{info.lat}, {info.lng}</div>
                    </div>
                </div>
                <div className='actions'>
                    <button type="button" className='share' onClick={handleShare}>
                        <MdOutlineShare />
                    </button>
                    <button type="button" className='close' onClick={onClose}>
                        <MdClose />
                    </button>
                </div>
            </div>
            {copied && <div className="copied-toast">Đã sao chép liên kết!</div>}
        </div>
    )
}

export default PopupInfo;