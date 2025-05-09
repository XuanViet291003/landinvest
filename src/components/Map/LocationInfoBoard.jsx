// import { useMapEvent, useMap } from 'react-leaflet';
// import axios from 'axios';
// import PopupInfo from './PopupInfo';


// const LocationInfoBoard = ({ popupInfo, setPopupInfo, shouldIgnoreNextEffectRef  }) => {
//     const map = useMap();

//     useMapEvent({
//         click: async (e) => {
//             const { lat, lng } = e.latlng;
//             console.log('[CLICK] lat:', lat, 'lng:', lng);

//             // Gọi Nominatim để lấy tên địa điểm (có thể thay bằng API khác)
//             try {
//                 // https://nominatim.openstreetmap.org/reverse
//                 const res = await axios.get(`https://nominatim.openstreetmap.org/reverse.php?lat=${lat}&lon=${lng}&zoom=18&format=jsonv2&addressdetails=1`, {
//                     params: {
//                         lat,
//                         lon: lng,
//                         format: 'json',
//                     },
//                 });

//                 const placeName = res.data.name || res.data.display_name?.split(',')[0] || 'Vị trí không rõ';
//                 const address = res.data.display_name || '';

//                 setPopupInfo({
//                     name: placeName,
//                     address,
//                     lat,
//                     lng,
//                 });
//             } catch (error) {
//                 setPopupInfo({
//                     name: "Vị trí không rõ",
//                     address: '',
//                     lat,
//                     lng,
//                 });
//                 console.log('Lỗi lấy thông tin địa điểm:', error);
//             }            
//         },
//     });

//     return <PopupInfo info={popupInfo} onClose={() => setPopupInfo(null)} shouldIgnoreNextEffectRef={shouldIgnoreNextEffectRef} />;
// }

// export default LocationInfoBoard;


import { useMapEvent } from 'react-leaflet';
import axios from 'axios';
import PopupInfo from './PopupInfo';

const LocationInfoBoard = ({ popupInfo, setPopupInfo, shouldIgnoreNextEffectRef }) => {
    useMapEvent({
        click: async (e) => {
            const { lat, lng } = e.latlng;

            // Không làm tròn, không xử lý lại
            console.log('[CLICK] lat:', lat, 'lng:', lng);

            try {
                const res = await axios.get('https://nominatim.openstreetmap.org/reverse.php', {
                    params: {
                        lat,
                        lon: lng,
                        format: 'jsonv2',
                        zoom: 18,
                        addressdetails: 1,
                    },
                });

                const placeName = res.data.name || res.data.display_name?.split(',')[0] || 'Vị trí không rõ';
                const address = res.data.display_name || '';

                setPopupInfo({
                    name: placeName,
                    address,
                    lat,
                    lng, // ⚠️ giữ số gốc không làm tròn
                });
            } catch (error) {
                console.warn('Lỗi lấy thông tin địa điểm:', error);
                setPopupInfo({
                    name: 'Vị trí không rõ',
                    address: '',
                    lat,
                    lng, // vẫn giữ tọa độ gốc
                });
            }

            // Nếu đang dùng flag để bỏ qua set lại (ví dụ khi vừa click + share)
            if (shouldIgnoreNextEffectRef?.current) {
                console.log('[LocationInfoBoard] Đã bỏ qua set lại do flag');
                shouldIgnoreNextEffectRef.current = false;
            }
        },
    });

    return (
        <PopupInfo
            info={popupInfo}
            onClose={() => setPopupInfo(null)}
            shouldIgnoreNextEffectRef={shouldIgnoreNextEffectRef}
        />
    );
};

export default LocationInfoBoard;
