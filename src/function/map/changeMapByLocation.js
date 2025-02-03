import { useDispatch } from 'react-redux';
import { LAND_AUCTION_KEYS } from '../../constants/LandAuctionKey';
import { getLocationByDistrict, getLocationByProvince } from '../../services/api';
import { calculateLocation } from '../calculateLocation';
import { setDistrictId, setProvinceId } from '../../redux/landCostSlice/landCostSlice';

export const handleChangeMapByLocation = async (id, locationType = LAND_AUCTION_KEYS.PROVINCE, mapRef, dispatch) => {
    const currentZoom = mapRef?.current.getZoom();
    const options = {
        animate: true,
    };

    if (locationType === LAND_AUCTION_KEYS.PROVINCE) {
        const res = await getLocationByProvince(id);
        const provinceId = res.districts_data.ProvinceID;
        const boundingBox = JSON.parse(res.districts_data.bounding_box);
        const [lng, lat] = calculateLocation([
            [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
        ]);

        dispatch(setProvinceId(provinceId));
        mapRef.current?.flyTo([lat, lng], currentZoom, options);
    } else {
        const res = await getLocationByDistrict(id);
        console.log(res);
        const districtId = res.districts_data.DistrictID;
        const boundingBox = JSON.parse(res.districts_data.bounding_box);
        const [lng, lat] = calculateLocation([
            [boundingBox.west, boundingBox.south, boundingBox.east, boundingBox.north],
        ]);

        dispatch(setDistrictId(districtId));
        console.log(lat,lng)
        mapRef.current?.flyTo([lat, lng], currentZoom || 15, options);
    }
};
