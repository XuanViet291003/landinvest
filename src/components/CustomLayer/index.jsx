import { useEffect, useRef } from "react";
import { TileLayer } from "react-leaflet";

const CustomTileLayer = ({ item, opacity }) => {
    const tileLayerRef = useRef(null);
    const tileLayerRefs = useRef([]);

    // console.log(item)

    const updateTileLayer = (tileLayer, link) => {
        if (!tileLayer) return;
        if (item.type_load_anh === "NGHICH") {
            tileLayer.getTileUrl = ({ x, y, z }) => {
                const newY = Math.pow(2, z) - 1 - y;
                return `${link}/${z}/${x}/${newY}.png`;
            };
        } else {
            tileLayer.getTileUrl = ({ x, y, z }) => {
                return `${link}/${z}/${x}/${y}.png`;
            };
        }
        tileLayer.redraw();
    };

    useEffect(() => {
        if (item.type_link === "1_link") {
            if (tileLayerRef.current) {
                updateTileLayer(tileLayerRef.current, item.link_server);
            }
        } else {
            const links = item.link_server
                .split(",")
                .map((link) => link.trim().replace(/[^a-zA-Z0-9:/._-]/g, ""));

            links.forEach((link, index) => {
                if (tileLayerRefs.current[index]) {
                    updateTileLayer(tileLayerRefs.current[index], link);
                }
            });
        }
    }, [item.type_load_anh, item.link_server]);

    console.log(item)

    return (
        <>
            {item.type_link === "1_link" ? (
                <TileLayer
                    ref={tileLayerRef}
                    url={`${item.link_server}/{z}/{x}/{y}.png`}
                    pane="overlayPane"
                    minNativeZoom={12}  
                    maxNativeZoom={item.zoom || 18} 
                    minZoom={9}         
                    maxZoom={25}        
                    tileSize={256}      
                    opacity={opacity}
                />
            ) : (
                item.link_server
                    .split(",")
                    .map((link, index) => (
                        <TileLayer
                            key={index}
                            ref={(el) => (tileLayerRefs.current[index] = el)}
                            url={`${link}/{z}/{x}/{y}.png`}
                            pane="overlayPane"
                            minNativeZoom={9}
                            maxNativeZoom={item.zoom || 18}
                            minZoom={9}
                            maxZoom={25}
                            opacity={opacity}
                        />
                    ))
            )}
        </>
    );
};

export default CustomTileLayer;