import { ConfigProvider, Table } from 'antd';
import React, { memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LAND_COST_KEY, MAP_TABLE_TYPE } from '../../constants/LandCostKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import { getAllLandCostApi } from '../../redux/landCostSlice/landCostSlice';
import { columns } from '../../pages/LandCost/components/LandCostColumns';

export const LandCostTable = ({ tableType, searchValue, data, type }) => {
    const dispatch = useDispatch();
    const allLandCostStatus = useSelector((state) => state.landCost.allLandCostStatus);
    const districtId = useSelector((state) => state.landCost.districtId);
    const [landCostData, setLandCostData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 50; // Số lượng dòng trên mỗi trang
    const [totalRecords, setTotalRecords] = useState(0);

    useEffect(() => {
      if(type !== "popup")
        setLandCostData(data)
    }, [data])

    // Hàm gọi API lấy dữ liệu theo trang
    const fetchLandCostData = async (page) => {
        try {
            const response = await fetch(`https://landinvest.thinkdiff.us/bang_gia_dat_district/${districtId}?page=${page}`);
            const data = await response.json();
            console.log("Dữ liệu từ API:", data);// kiem tra

            setLandCostData(Array.isArray(data.dulieu) ? data.dulieu : []);
            
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu:', error);
        }
    };

    // Gọi API khi districtId hoặc currentPage thay đổi
    useEffect(() => {
        if (districtId) {
            fetchLandCostData(currentPage);
        }
    }, [districtId, currentPage]);

    // Xử lý tìm kiếm
    useEffect(() => {
        if (searchValue) {
            console.log("Trước khi lọc:", landCostData);

            const landCostsFiltered = landCostData?.filter((item) =>
                item?.DistrictName?.toLowerCase().includes(searchValue?.toLowerCase()),
            );
            
            console.log("Sau khi lọc:", landCostsFiltered);
            setLandCostData(landCostsFiltered);
        } else {
            fetchLandCostData(currentPage);
        }
    }, [searchValue]);

    useEffect(() => {
        if (type !== "popup") {
            setLandCostData(Array.isArray(data) ? data : []);
        }
    }, [data]);

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
                    columns={columns.filter(col => {
                        if (col.dataIndex === 'address') {
                            return Array.isArray(landCostData) && landCostData.some(item => item.WardName);
                        }
                        return true;
                    })}
                    loading={allLandCostStatus === THUNK_API_STATUS.PENDING}
                    rowKey="id"
                    dataSource={Array.isArray(landCostData) ? landCostData.map((item, index) => ({
                        key: item.id,
                        STT: (currentPage - 1) * pageSize + index + 1,
                        district: item.DistrictName,
                        description: item.RoadName,
                        address: item.WardName,
                        locationCost: item.vi_tri,
                        landType: item.Type,
                    })) : []}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: totalRecords,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                    }}
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
