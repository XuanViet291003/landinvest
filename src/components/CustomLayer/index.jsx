import { useState, useEffect, useRef } from "react";
import { TileLayer } from "react-leaflet";

const CustomTileLayer = ({ item, opacity }) => {
    const tileLayerRef = useRef(null);
    const tileLayerRefs = useRef([]);

    useEffect(() => {
        if (!item) return; 

        const updateTileLayer = (tileLayer, link) => {
            if (!tileLayer) return;
            if (item?.type_load_anh === "NGHICH") {
                tileLayer.getTileUrl = ({ x, y, z }) => {
                    const newY = Math.pow(2, z) - 1 - y;
                    return `${link}/${z}/${x}/${newY}.png`;
                };
            } else {
                tileLayer.getTileUrl = ({ x, y, z }) => `${link}/${z}/${x}/${y}.png`;
            }
            tileLayer.redraw();
        };

        if (item.type_link === "1_link") {
            if (tileLayerRef.current) {
                updateTileLayer(tileLayerRef.current, item.link_server);
            }
        } else {
            const links = item.link_server
                ?.split(",")
                .map((link) => link.trim().replace(/[^a-zA-Z0-9:/._-]/g, "")) || [];

            links.forEach((link, index) => {
                if (tileLayerRefs.current[index]) {
                    updateTileLayer(tileLayerRefs.current[index], link);
                }
            });
        }
    }, [item?.type_load_anh, item?.link_server, item?.type_link]);

    if (!item) {
        return null;
    }

    return (
        <>
            {item.type_link === "1_link" ? (
                <TileLayer
                    ref={tileLayerRef}
                    url={`${item.link_server}/{z}/{x}/{y}.png`}
                    // minNativeZoom={12}  
                    // maxNativeZoom={18}                      // fix item.zoom 18 -> 22
                    minNativeZoom={parseInt(item.min_zoom || "12", 10)}
                    maxNativeZoom={parseInt(item.zoom || (item.min_zoom + 5), 10)}
                    minZoom={9}         
                    maxZoom={25} 
                    tileSize={256} 
                    opacity={opacity}
                />
            ) : (
                item?.link_server?.split(",").map((link, index) => (
                    <TileLayer
                        key={index}
                        ref={(el) => (tileLayerRefs.current[index] = el)}
                        url={`${link}/{z}/{x}/{y}.png`}
                        // minNativeZoom={12}
                        // maxNativeZoom={18}                  // fix item.zoom 18 -> 22
                        minNativeZoom={parseInt(item.min_zoom || "12", 10)}
                        maxNativeZoom={parseInt(item.zoom || (item.min_zoom + 5), 10)}
                        minZoom={9}
                        maxZoom={25}
                        tileSize={256} 
                        opacity={opacity}
                    />
                ))
            )}
        </>
    );
};

export default CustomTileLayer;
