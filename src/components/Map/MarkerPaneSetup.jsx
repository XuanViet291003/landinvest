import React, { useEffect } from 'react'
import { useMap } from 'react-leaflet';

const MarkerPaneSetup = () => {
    const map = useMap();

    useEffect(() => {
        if (!map.getPane('markerTopPane')) {
            map.createPane('markerTopPane');
            map.getPane('markerTopPane').style.zIndex = 1000;
        }
    }, [map])

    return null;
}

export default MarkerPaneSetup