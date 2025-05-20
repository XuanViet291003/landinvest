import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import axios from 'axios';

const MapView = ({ setPopupInfo }) => {
    const map = useMap();

    const updateMapFromURL = () => {
        const params = new URLSearchParams(window.location.search);
        const vitri = params.get('vitri');
        const zoom = parseInt(params.get('zoom')) || 18;

        if (vitri) {
            const [lat, lng] = vitri.split(',').map((v) => parseFloat(v));
            console.log('[PARSE URL] lat:', lat, 'lng:', lng);
            if (!isNaN(lat) && !isNaN(lng)) {
                // Chờ map đã sẵn sàng rồi mới gọi flyTo
                map.flyTo([lat, lng], zoom, { animate: true, duration: 1.5 });

                // Gọi API Nominatim để lấy thông tin địa điểm
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
                        const placeName =
                            res.data.name ||
                            res.data.display_name?.split(',')[0] ||
                            'Vị trí không rõ';
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
    };

    useEffect(() => {
        // Thêm delay 500ms để đảm bảo map đã sẵn sàng
        const timer = setTimeout(updateMapFromURL, 500);
        return () => clearTimeout(timer);
    }, [map, setPopupInfo]);

    return null;
};

export default MapView;