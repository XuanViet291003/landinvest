import React from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import fetchProvinceName from '../../../function/findProvince';
import { getPolygonsQuanHuyen } from '../../../function/getPolygonByName';
import { doSearch } from '../../../redux/search/searchSlice';

const HandleGotoLocation = ({ DistrictID, closeModal }) => {
    const location = useSelector((state) => state.landCost.location);
    const dispatch = useDispatch();
    const [searchParams, _] = useSearchParams();
    const navigate = useNavigate();

    const handleGoto = async (DistrictID) => {
        try {
            const coordinates = await getPolygonsQuanHuyen(DistrictID);
            const centerLat = location.lat;
            const centerLng = location.lng;
            const info = await fetchProvinceName(centerLat, centerLng);

            dispatch(
                doSearch({
                    lat: centerLat,
                    lon: centerLng,
                    coordinates: coordinates.length > 0 ? coordinates : [],
                    provinceName: info.provinceName,
                    districtName: info.districtName,
                    isGoto: true,
                }),
            );
            searchParams.set('vitri', `${centerLat},${centerLng}`);
            navigate(`/?${searchParams.toString()}`);
            if(closeModal){
                closeModal()
            }
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <span className="auction-card-go-to" onClick={() => handleGoto(DistrictID)}>
            Đến vị trí này <FaLocationArrow color="#fff" />
        </span>
    );
};

export default HandleGotoLocation;
