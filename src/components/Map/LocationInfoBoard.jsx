import { useMapEvent } from 'react-leaflet';
import axios from 'axios';
import PopupInfo from './PopupInfo';
import { useRef } from 'react';
import debounce from 'lodash/debounce';

const LocationInfoBoard = ({ popupInfo, setPopupInfo }) => {
    const debouncedSetPopupInfo = useRef(
        debounce(async (lat, lng) => {
            // Reset popup trước khi cập nhật thông tin mới
            setPopupInfo(null);
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
                    res.data.name || res.data.display_name?.split(',')[0] || 'Vị trí không rõ';
                const address = res.data.display_name || '';
                setPopupInfo({
                    name: placeName,
                    address,
                    lat,
                    lng,
                });
            } catch (error) {
                console.warn('Lỗi lấy thông tin địa điểm:', error);
                setPopupInfo({
                    name: 'Vị trí không rõ',
                    address: '',
                    lat,
                    lng,
                });
            }
        }, 200)
    ).current;

    useMapEvent({
        click: (e) => {
            const { lat, lng } = e.latlng;
            debouncedSetPopupInfo(lat, lng);
        },
    });

    return <PopupInfo info={popupInfo} onClose={() => setPopupInfo(null)} />;
};

export default LocationInfoBoard;