
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

export const MarkerPaneSetup = () => {
    const map = useMap();

    useEffect(() => {
        if (!map.getPane('markerTopPane')) {
            const pane = map.createPane('markerTopPane');
            pane.style.zIndex = 1000;
        }
    }, [map]);

    return null;
};

export const MeasurePaneCreator = () => {
    const map = useMap();

    useEffect(() => {
        if (!map.getPane('measurePane')) {
            const pane = map.createPane('measurePane');
            pane.style.zIndex = 650;
        }
    }, [map]);

    return null;
};
