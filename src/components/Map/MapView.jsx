import { useEffect, useRef } from 'react'
import { useMap } from 'react-leaflet'

const MapView = ({ setPopupInfo, shouldIgnoreNextEffectRef }) => {
    const map = useMap();
    const initialized = useRef(false); // ngăn render

    useEffect(() => {
        if (shouldIgnoreNextEffectRef?.current) {
            console.log('[MapView] Bỏ qua effect do vừa Share');
            shouldIgnoreNextEffectRef.current = false;
            return;
        }

        if (initialized.current) return; // render 1 lần
        initialized.current = true;

        const params = new URLSearchParams(window.location.search);
        const vitri = params.get('vitri');
        const zoom = parseInt(params.get('zoom')) || 18;

        if (vitri) {
            const [lat, lng] = vitri.split(',').map((v) => parseFloat(v));
            console.log('[PARSE URL] lat:', lat, 'lng:', lng);

            if (!isNaN(lat) && !isNaN(lng)) {
                map.setView([lat, lng], zoom);
                setPopupInfo({
                    name: 'Vị trí được chia sẻ',
                    address: 'Chưa rõ địa chỉ',
                    lat,
                    lng
                });
            }
        }
    }, [map, setPopupInfo, shouldIgnoreNextEffectRef]);

    return null;
}

export default MapView;


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

//         if (initialized.current) return;
//         initialized.current = true;

//         const params = new URLSearchParams(window.location.search);
//         const vitri = params.get('vitri');
//         const zoom = parseInt(params.get('zoom')) || 18;

//         if (vitri) {
//             const [lat, lng] = vitri.split(',').map((v) => parseFloat(v));
//             console.log('[PARSE URL] lat:', lat, 'lng:', lng);

//             if (!isNaN(lat) && !isNaN(lng)) {
//                 map.setView([lat, lng], zoom);
//             }
//         }
//     }, [map]);

//     return null;
// }

// export default MapView;