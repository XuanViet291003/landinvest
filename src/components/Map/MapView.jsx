// import { useEffect, useRef } from 'react'
// import { useMap } from 'react-leaflet'

// const MapView = ({ setPopupInfo, shouldIgnoreNextEffectRef }) => {
//     const map = useMap();
//     const initialized = useRef(false);

//     useEffect(() => {
//         if (shouldIgnoreNextEffectRef?.current) {
//             console.log('[MapView] Bỏ qua effect do vừa Share');
//             shouldIgnoreNextEffectRef.current = false;
//             return;
//         }

//         if (initialized.current) return; // render 1 lần
//         initialized.current = true;

//         const params = new URLSearchParams(window.location.search);
//         const vitri = params.get('vitri');
//         const zoom = parseInt(params.get('zoom')) || 18;

//         if (vitri) {
//             const [lat, lng] = vitri.split(',').map((v) => parseFloat(v));
//             console.log('[PARSE URL] lat:', lat, 'lng:', lng);

//             if (!isNaN(lat) && !isNaN(lng)) {
//                 map.setView([lat, lng], zoom);
//                 setPopupInfo({
//                     name: 'Vị trí được chia sẻ',
//                     address: 'Chưa rõ địa chỉ',
//                     lat,
//                     lng,
//                 });
//             }
//         }
//     }, [map, setPopupInfo, shouldIgnoreNextEffectRef]);

//     return null;
// };

// export default MapView;

import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import axios from 'axios';

const MapView = ({ setPopupInfo, shouldIgnoreNextEffectRef }) => {
    const map = useMap();
    const initialized = useRef(false);

    useEffect(() => {
        if (shouldIgnoreNextEffectRef?.current) {
            console.log('[MapView] Bỏ qua effect do vừa Share');
            shouldIgnoreNextEffectRef.current = false;
            return;
        }

        if (initialized.current) return;
        initialized.current = true;

        const params = new URLSearchParams(window.location.search);
        const vitri = params.get('vitri');
        const zoom = parseInt(params.get('zoom')) || 18;

        if (vitri) {
            const [lat, lng] = vitri.split(',').map((v) => parseFloat(v));
            console.log('[PARSE URL] lat:', lat, 'lng:', lng);

            if (!isNaN(lat) && !isNaN(lng)) {
                map.setView([lat, lng], zoom);

                // Gọi Nominatim API để lấy tên địa điểm và địa chỉ đầy đủ
                (async () => {
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
                            lng,
                        });
                    } catch (error) {
                        console.warn('[MapView] Lỗi khi gọi API Nominatim:', error);
                        setPopupInfo({
                            name: 'Vị trí không rõ',
                            address: '',
                            lat,
                            lng,
                        });
                    }
                })();
            }
        }
    }, [map, setPopupInfo, shouldIgnoreNextEffectRef]);

    return null;
};

export default MapView;
