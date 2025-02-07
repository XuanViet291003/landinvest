import { ConfigProvider, Table } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST_KEY, MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import { getAllLandCostApi } from '../../redux/landCostSlice/landCostSlice';
import { columns } from '../../pages/LandCost/components/LandCostColumns';

export const LandCostTable = ({ tableType, searchValue }) => {
    const dispatch = useDispatch();
    const allLandCost = useSelector((state) => state.landCost.allLandCost) || [];
    const allLandCostStatus = useSelector((state) => state.landCost.allLandCostStatus);
    const page = useSelector((state) => state.landCost.page);
    const pageSize = useSelector((state) => state.landCost.pageSize);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [landCostData, setLandCostData] = useState([]);

    // const handleChange = (paginate) => {
    //     const { current } = paginate;
    //     dispatch(setCurrentPage(current));
    // };

    useEffect(() => {
        if (tableType && tableType === MAP_TABLE_TYPE.ON_MAP) {
            dispatch(getAllLandCostApi({ id: districtId, type: LAND_COST_KEY.DISTRICT }));
        }
    }, [districtId]);

    useEffect(() => {
        if (searchValue) {
            const landCostsFiltered = allLandCost?.filter((item) =>
                item?.DistrictName?.toLowerCase().includes(searchValue?.toLowerCase()),
            );
            setLandCostData(landCostsFiltered);
        } else {
            setLandCostData(allLandCost);
        }
    }, [allLandCost, searchValue]);

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
                    loading={allLandCostStatus === THUNK_API_STATUS.PENDING}
                    rowKey="id"
                    dataSource={landCostData?.map((item, index) => ({
                        key: item.id,
                        STT: index + 1,
                        district: item.DistrictName,
                        description: item.RoadName,
                        address: item.WardName,
                        locationCost: item.vi_tri,
                        landType: item.Type,
                    }))}
                    pagination={false}
                    // pagination={{
                    //     pageSize: 5,
                    // }}
                    // pagination={{
                    //     pageSize,
                    //     current: page,
                    //     defaultCurrent: page,
                    //     defaultPageSize: 5,
                    //     total: allLandCost.length,
                    //     onShowSizeChange: (_, size) => {
                    //         dispatch(setCurrentPageSize(size));
                    //     },
                    // }}
                    // // onChange={handleChange}
                    scroll={{
                        scrollToFirstRowOnChange: true,
                        x: 'max-content',
                    }}
                />
            </ConfigProvider>
        </div>
    );
};

export default memo(LandCostTable);
