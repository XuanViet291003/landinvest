import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { setCurrentPage } from '../../../redux/LandAuctions/landAuctions';
import AuctionItem from './AuctionItem';
import { THUNK_API_STATUS } from '../../../constants/thunkApiStatus';
import { Pagination } from 'antd';

const AuctionsListRender = () => {
    const dispatch = useDispatch();
    const landAuctionsList = useSelector((state) => state.landAuctions.allLandAuctions);
    const status = useSelector((state) => state.landAuctions.status);
    const currentPage = useSelector((state) => state.landAuctions.page);
    const totalPage = useSelector((state) => state.landAuctions.totalPage);
    const limit = useSelector((state) => state.landAuctions.limit);
    const [searchParams, setSearchParams] = useSearchParams();
    const appContent = document.querySelector('.app-content');

    const handleChangePage = (currentPage) => {
        dispatch(setCurrentPage(currentPage));
        searchParams.set('page', currentPage);
        setSearchParams(searchParams);

        appContent.scrollTo({
            top: 450,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        const page = Number(searchParams.get('page'));
        if (page) {
            dispatch(setCurrentPage(page));
        }
    }, []);

    return landAuctionsList?.length > 0 ? (
        <>
            {landAuctionsList?.map((auction, index) => (
                <AuctionItem auction={auction} key={index} />
            ))}
            <div className="land-auction__pagination">
                <Pagination
                    current={currentPage}
                    pageSize={limit}
                    total={totalPage * limit}
                    onChange={handleChangePage}
                    showSizeChanger={false}
                />
            </div>
        </>
    ) : (
        <p className="auctions-list-empty">Không có dữ liệu.</p>
    );
};

export default AuctionsListRender;
