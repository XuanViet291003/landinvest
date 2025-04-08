import { useEffect, useRef } from "react";
import { TileLayer } from "react-leaflet";

// const CustomTileLayer = ({ item, opacity }) => {
//     const tileLayerRef = useRef(null);
//     const tileLayerRefs = useRef([]);

//     useEffect(() => {
//         if (!item) return; 

//         const updateTileLayer = (tileLayer, link) => {
//             if (!tileLayer) return;
//             if (item?.type_load_anh === "NGHICH") {
//                 tileLayer.getTileUrl = ({ x, y, z }) => {
//                     const newY = Math.pow(2, z) - 1 - y;
//                     return `${link}/${z}/${x}/${newY}.png`;
//                 };
//             } else {
//                 tileLayer.getTileUrl = ({ x, y, z }) => `${link}/${z}/${x}/${y}.png`;
//             }
//             tileLayer.redraw();
//         };

//         if (item.type_link === "1_link") {
//             if (tileLayerRef.current) {
//                 updateTileLayer(tileLayerRef.current, item.link_server);
//             }
//         } else {
//             const links = item.link_server
//                 ?.split(",")
//                 .map((link) => link.trim().replace(/[^a-zA-Z0-9:/._-]/g, "")) || [];

//             links.forEach((link, index) => {
//                 if (tileLayerRefs.current[index]) {
//                     updateTileLayer(tileLayerRefs.current[index], link);
//                 }
//             });
//         }
//     }, [item?.type_load_anh, item?.link_server, item?.type_link]);

//     if (!item) {
//         return null;
//     }

//     return (
//         <>
//             {item.type_link === "1_link" ? (
//                 <TileLayer
//                     ref={tileLayerRef}
//                     url={`${item.link_server}/{z}/{x}/{y}.png`}
//                     minNativeZoom={12}  
//                     maxNativeZoom={18}                      // fix item.zoom 18 -> 22
//                     minZoom={9}         
//                     maxZoom={25} 
//                     tileSize={256} 
//                     opacity={opacity}
//                 />
//             ) : (
//                 item?.link_server?.split(",").map((link, index) => (
//                     <TileLayer
//                         key={index}
//                         ref={(el) => (tileLayerRefs.current[index] = el)}
//                         url={`${link}/{z}/{x}/{y}.png`}
//                         minNativeZoom={12}
//                         maxNativeZoom={18}                  // fix item.zoom 18 -> 22
//                         minZoom={9}
//                         maxZoom={25}
//                         tileSize={256} 
//                         opacity={opacity}
//                     />
//                 ))
//             )}
//         </>
//     );
// };

const CustomTileLayer = ({ item, opacity }) => {
    const tileLayerRefs = useRef([]);

    useEffect(() => {
        if (!item || !item.link_server) return;

        const links = item.type_link === "1_link"
            ? [item.link_server]
            : item.link_server
                ?.split(",")
                .map((link) => link.trim().replace(/[^a-zA-Z0-9:/._-]/g, "")) || [];

        links.forEach((link, index) => {
            const layer = tileLayerRefs.current[index];
            if (!layer) return;

            layer.createTile = function (coords, done) {
                const tile = document.createElement("img");
                tile.alt = "";
                tile.setAttribute("role", "presentation");

                const { x, y, z } = coords;
                const tileY = item.type_load_anh === "NGHICH" ? Math.pow(2, z) - 1 - y : y;
                tile.src = `${link}/${z}/${x}/${tileY}.png`;

                tile.onload = () => done(null, tile);
                tile.onerror = () => {
                    console.warn(`Tile load error: ${tile.src}`);
                    done(null, tile);
                };

                return tile;
            };

            // Bắt buộc redraw lại sau khi gán createTile
            layer.redraw();
        });
    }, [item]);

    if (!item) return null;

    const tileOptions = {
        minZoom: item.min_zoom ? Number(item.min_zoom) - 2 : 9,
        minNativeZoom: item.min_zoom ? Number(item.min_zoom) : 12,
        maxNativeZoom: item.zoom ? Number(item.zoom) : 17,
        maxZoom: 25,
        tileSize: 256,
        opacity,
        noWrap: true,
    };

    const links = item.type_link === "1_link"
        ? [item.link_server]
        : item.link_server
            ?.split(",")
            .map((link) => link.trim().replace(/[^a-zA-Z0-9:/._-]/g, "")) || [];

    return (
        <>
            {links.map((link, index) => (
                <TileLayer
                    key={index}
                    ref={(ref) => (tileLayerRefs.current[index] = ref)}
                    url="" // bắt buộc để ngăn Leaflet auto load
                    {...tileOptions}
                />
            ))}
        </>
    );
};

export default CustomTileLayer;