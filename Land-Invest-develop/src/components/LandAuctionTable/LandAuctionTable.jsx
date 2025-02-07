import { ConfigProvider, Table } from 'antd';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';

import { searchLandAuctionsInfoApi, setCurrentPage } from '../../redux/LandAuctions/landAuctions';
import { columns } from './element/landAuctionColumns';
import { doSearch } from '../../redux/search/searchSlice';
import { useSearchParams } from 'react-router-dom';
import { getTimeLeft } from '../../function/getTimeLeft';

const LandAuctionTable = ({ tableType, handleClose }) => {
    const dispatch = useDispatch();
    const allLandAuctions = useSelector((state) => state.landAuctions.allLandAuctions) || [];
    const status = useSelector((state) => state.landAuctions.status);
    const districtId = useSelector((state) => state.landCost.districtId);
    const provinceId = useSelector((state) => state.landCost.provinceId);
    const isGoto = useSelector((state) => state.searchQuery.searchResult.isGoto);
    const page = useSelector((state) => state.landAuctions.page);
    const totalPage = useSelector((state) => state.landAuctions.totalPage);
    const totalDocs = useSelector((state) => state.landAuctions.totalDocs);
    const limit = useSelector((state) => state.landAuctions.limit);
    const [searchParams, setSearchParams] = useSearchParams();
    const allLandAuctionsData = allLandAuctions.filter((item) => getTimeLeft(item?.RegistrationEndTime));
    console.log(allLandAuctionsData);
    const handleChange = (paginate) => {
        const { current } = paginate;
        dispatch(setCurrentPage(current));
        searchParams.set('page', page);
        setSearchParams(searchParams);
    };

    useEffect(() => {
        if (tableType && tableType === MAP_TABLE_TYPE.ON_MAP && districtId && provinceId) {
            const formData = new FormData();

            formData.append('idProvince', provinceId);
            formData.append('idDistrict', districtId);
            dispatch(searchLandAuctionsInfoApi({ page: 1, formData }));
        }
    }, [districtId, provinceId]);

    useEffect(() => {
        if (isGoto) {
            handleClose();
            dispatch(
                doSearch({
                    isGoto: false,
                }),
            );
        }

        if (page && page !== 1) {
            const formData = new FormData();
            formData.append('idProvince', provinceId);
            formData.append('idDistrict', districtId);
            dispatch(searchLandAuctionsInfoApi({ page: page, formData }));
        }
        return () => {
            dispatch(setCurrentPage(1));
        };
    }, [isGoto, page]);

    useEffect(() => {
        const page = searchParams.get('page');
        dispatch(setCurrentPage(page));
    }, []);

    return (
        <div className="land-cost__container-table">
            <ConfigProvider
                theme={{
                    components: {
                        Table: {
                            headerBg: '#3DB700',
                            headerColor: '#fff',
                            headerSplitColor: '#000',
                            footerBg: '#1E252B',
                            tableBorderColor: '#1890ff',
                            rowHoverBg: '#1E252B',
                        },
                    },
                }}
            >
                <Table
                    columns={columns}
                    loading={status === THUNK_API_STATUS.PENDING}
                    rowKey="id"
                    dataSource={allLandAuctionsData?.map((item, index) => ({
                        key: item.id,
                        STT: index + 1,
                        Title: item.Title,
                        AuctionAddress: item.AuctionAddress,
                        Description: item.Description,
                        CreateAt: item.CreateAt,
                        EventSchedule: item.EventSchedule,
                        DepositPrice: item.DepositPrice,
                        OpenPrice: item.OpenPrice,
                        DistrictID: item.DistrictID,
                        RegistrationEndTime: item.RegistrationEndTime,
                        NamePropertyOwner: item.NamePropertyOwner,
                        NameAuctionHouse: item.NameAuctionHouse,
                        NameProperty: item.NameProperty,
                        RegistrationStartTime: item.RegistrationStartTime,
                        DepositPaymentStartTime: item.DepositPaymentStartTime,
                        DepositPaymentEndTime: item.DepositPaymentEndTime,
                    }))}
                    showSizeChanger={false}
                    pagination={{
                        pageSize: limit,
                        current: page,
                        defaultCurrent: page,
                        total: totalDocs,
                        showSizeChanger: false,
                    }}
                    onChange={handleChange}
                    scroll={{
                        scrollToFirstRowOnChange: true,
                        x: 'max-content',
                    }}
                />
            </ConfigProvider>
        </div>
    );
};

export default memo(LandAuctionTable);
