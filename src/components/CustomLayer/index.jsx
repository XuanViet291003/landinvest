import { useEffect, useRef } from "react";
import { TileLayer } from "react-leaflet";

const CustomTileLayer = ({ item, opacity }) => {
    const tileLayerRef = useRef(null);

    useEffect(() => {
        if (tileLayerRef.current) {
            if (item.type_load_anh === "NGHICH") {
                tileLayerRef.current.getTileUrl = function ({ x, y, z }) {
                    const newY = Math.pow(2, z) - 1 - y;
                    return `${item.link_quyhoach}/${z}/${x}/${newY}.png`;
                };
            } else {
                // Khi trở về THUẬN, đặt lại URL mặc định bằng setUrl()
                tileLayerRef.current.getTileUrl = function ({ x, y, z }) {
                return `${item.link_quyhoach}/${z}/${x}/${y}.png`;
              };
            }
            tileLayerRef.current.redraw(); // Vẽ lại các tile
        }
    }, [item.type_load_anh, item.link_quyhoach]);

    return (
        <TileLayer
            ref={tileLayerRef}
            url={`${item.link_quyhoach}/{z}/{x}/{y}.png`} // URL mặc định
            pane="overlayPane"
            minNativeZoom={item.min_zoom ? item.min_zoom : 12}
            maxNativeZoom={item.zoom ? item.zoom : 18}
            minZoom={item.min_zoom ? item.min_zoom - 2 : 9}
            maxZoom={25}
            opacity={opacity}
        />
    );
};

export default CustomTileLayer;