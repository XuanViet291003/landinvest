import React, { useMemo } from 'react';
import { Marker } from 'react-leaflet';

const MarkerComponent = React.memo(({ position, icon }) => {
    const markerProps = useMemo(() => ({
        key: `${position[0]},${position[1]}`,
        position,
        icon,
        zIndexOffset: 1000,
        pane: 'markerTopPane',
    }), [position, icon]);

    return <Marker {...markerProps} />;
});

export default MarkerComponent;
