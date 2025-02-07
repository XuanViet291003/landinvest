import { Skeleton, Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { TAB_KEYS } from '../../constants/LandAuctionKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import {
    getLandAuctionsInfoApi,
    searchLandAuctionsInfoApi,
    setCurrentPage,
    setTabKey,
} from '../../redux/LandAuctions/landAuctions';
import './AuctionList.css';
import { items } from './components/AuctionTabItems';
import LoadingScreen from '../_common/LoadingScreen';

const AuctionsList = ({ formData }) => {
    const dispatch = useDispatch();
    const landAuctionsListStatus = useSelector((state) => state.landAuctions.status);
    const currentPage = useSelector((state) => state.landAuctions.page);
    const tabKey = useSelector((state) => state.landAuctions.tabKey);
    const [searchParams, setSearchParams] = useSearchParams();

    const handleRemoveFalsyKey = () => {
        const formDataRequest = new FormData();

        const formDataKey = Object.keys(formData);
        formDataKey.forEach((key) => {
            if (formData[key]) {
                formDataRequest.append(key, formData[key]);
            }
        });
        return formDataRequest;
    };

    const onChange = (key) => {
        dispatch(setTabKey(key));
        if (key !== TAB_KEYS.FILTER) {
            dispatch(getLandAuctionsInfoApi({ page: 1 }));
            searchParams.delete('isFilter');
        } else {
            const formData = handleRemoveFalsyKey();
            dispatch(searchLandAuctionsInfoApi({ page: 1, formData }));
            searchParams.set('isFilter', true);
        }
        dispatch(setCurrentPage(1));
        searchParams.set('page', 1);
        setSearchParams(searchParams);
    };

    useEffect(() => {
        const isFillter = searchParams.get('isFilter');
        const page = Number(searchParams.get('page'));

        if (tabKey !== TAB_KEYS.FILTER && !isFillter) {
            dispatch(getLandAuctionsInfoApi({ page: page ? page : currentPage }));
        } else {
            const formData = handleRemoveFalsyKey();
            dispatch(searchLandAuctionsInfoApi({ page: page ? page : currentPage, formData }));
        }
    }, [currentPage]);

    useEffect(() => {
        const isFillter = searchParams.get('isFilter');
        const page = Number(searchParams.get('page'));

        if (page) {
            setCurrentPage(page);
        }
        if (isFillter === 'true' && tabKey !== TAB_KEYS.FILTER) {
            const formData = handleRemoveFalsyKey();
            dispatch(setTabKey(TAB_KEYS.FILTER));
            dispatch(searchLandAuctionsInfoApi({ page: page ? page : 1, formData }));
        }
    }, []);
    return (
        <Container>
            <div className="auctions">
                <Tabs defaultActiveKey={TAB_KEYS.ALL} activeKey={tabKey} items={items} centered onChange={onChange} />
                {landAuctionsListStatus === THUNK_API_STATUS.PENDING && <Skeleton active />}
                {landAuctionsListStatus === THUNK_API_STATUS.PENDING && <LoadingScreen />}
            </div>
        </Container>
    );
};

export default AuctionsList;
