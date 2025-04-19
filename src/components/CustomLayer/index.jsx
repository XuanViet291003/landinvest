import { useState, useEffect, useRef } from "react";
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
    const diachinhRefs = useRef([]);
    const [quyhoachData, setQuyhoachData] = useState(null);

    // Fetch dữ liệu quy hoạch từ public
    useEffect(() => {
        fetch("/quyhoach_toanbo.json")
            .then(res => res.json())
            .then(data => setQuyhoachData(data))
            .catch(err => console.error("Lỗi tải file quyhoach_toanbo.json: ", err));
    }, []);

    // Khi item thay đổi, cập nhật createTile cho các layer
    useEffect(() => {
        if (!item || !item.link_server || !quyhoachData) return;

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
                    // update test
                    tile.style.opacity = "0.2";
                    done(null, tile);
                };

                return tile;
            };

            // Bắt buộc redraw lại sau khi gán createTile
            layer.redraw();
        });

        // === Tải địa chính tương ứng ===
        const dcList = quyhoachData.diachinh?.filter(dc => dc.idProvince === item.idProvince) || [];
        dcList.forEach((dc, index) => {
            const layer = diachinhRefs.current[index];
            if (!layer) return;

            layer.createTile = function (coords, done) {
                const tile = document.createElement("img");
                const { x, y, z } = coords;
                const tileY = dc.type_load_anh === "NGHICH" ? Math.pow(2, z) - 1 - y : y;
                tile.src = `${dc.link_server}/${z}/${x}/${tileY}.png`;
                tile.onload = () => done(null, tile);
                tile.onerror = () => {                    
                    console.warn(`DC tile lỗi: zoom=${z}, x=${x}, y=${tileY} - ${tile.src}`);
                    tile.style.opacity = "0.2";
                    done(null, tile);
                }
                return tile;
            };

            layer.redraw();
        })

    }, [item, quyhoachData]);

    if (!item || !quyhoachData) return null;
    
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

    // Test
    const diachinhForProvince = quyhoachData.diachinh?.filter(dc => dc.idProvince === item.idProvince) || [];

    return (
        <>
            {links.map((link, index) => (
                <TileLayer
                    key={`map-${index}`}
                    ref={(ref) => (tileLayerRefs.current[index] = ref)}
                    url="" // bắt buộc để ngăn Leaflet auto load
                    {...tileOptions}
                />
            ))}

            {/* Lớp địa chính */}
            {diachinhForProvince.map((dc, index) => (
                <TileLayer 
                    key={`dc-${dc.id}-${index}`}
                    ref={(ref) => diachinhRefs.current[index] = ref}
                    url=""
                    minZoom={Number(dc.min_zoom || 10) - 1}
                    minNativeZoom={Number(dc.min_zoom || 10)}
                    maxNativeZoom={Number(dc.zoom)}
                    maxZoom={25}
                    tileSize={256}
                    opacity={0.7}
                    zIndex={800}
                    noWrap={true}
                    bounds={undefined} // đảm bảo không bị cắt ngoài vùngs
                />
            ))}
        </>
    );
};

export default CustomTileLayer;
