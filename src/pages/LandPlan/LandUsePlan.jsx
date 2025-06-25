import React, { useState, useEffect } from 'react';
import { Table, Spin, Select } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import instance from '../../utils/axios-customize';
import { setDistrictId } from '../../redux/landCostSlice/landCostSlice'; // Giả định

const { Option } = Select;

export default function LandUsePlan() {
    const [loading, setLoading] = useState(true);
    const [province, setProvince] = useState([]);
    const [districAvailble, setDistrictAvailble] = useState([]);
    const [searchParams] = useSearchParams();
    const [selectedProvinceId, setSelectedProvinceID] = useState(searchParams.get('idProvince') || '');
    const dispatch = useDispatch();

    // Lấy danh sách tỉnh
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await instance.get('/all_provinces');
                setProvince(data.data); // Giả định data là mảng tỉnh
                // Nếu chưa chọn tỉnh, đặt tỉnh đầu tiên làm mặc định
                if (!selectedProvinceId && data.length > 0) {
                    setSelectedProvinceID(data[0].province_id);
                }
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, []);

    // Lấy danh sách huyện khi chọn tỉnh
    useEffect(() => {
        if (selectedProvinceId) {
            (async () => {
                try {
                    setLoading(true);
                    const { data } = await instance.get(`/list_districts_in_provinces/${selectedProvinceId}`);
                    setDistrictAvailble(data.data); // Giả định data là mảng huyện
                    setLoading(false);
                } catch (error) {
                    console.log(error);
                    setDistrictAvailble([]);
                    setLoading(false);
                }
            })();
        }
    }, [selectedProvinceId]);

    // Xử lý thay đổi tỉnh
    const handleProvinceChange = (value) => {
        setSelectedProvinceID(value);
    };

    const columns = [
        {
            title: <span className="table-title">STT</span>,
            dataIndex: 'index',
            key: 'index',
            width: '5%',
            render: (item, record, index) => index + 1,
        },
        {
            title: <span className="table-title">Huyện</span>,
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        },
        {
            title: <span className="table-title">Thao tác</span>,
            dataIndex: ['id', 'name'],
            key: 'id',
            render: (item, record) => (
                <Link
                    to={`/landuseplan/${selectedProvinceId}?idDistrict=${record.id}&name=${record.name}`}
                    style={{ color: '#3DB700', textDecoration: 'none' }}
                    onClick={() => dispatch(setDistrictId(record.id))}
                >
                    Xem chi tiết
                </Link>
            ),
            width: '15%',
        },
    ];

    return (
        <div style={{ padding: '20px', backgroundColor: '#f0f2f5' }}>
            <h2>Kế hoạch sử dụng đất</h2>
            <div style={{ marginBottom: '20px' }}>
                <Select
                    className="information-location-select"
                    value={selectedProvinceId}
                    onChange={handleProvinceChange}
                    placeholder="Tỉnh, thành phố"
                    style={{ width: 200 }}
                    loading={loading}
                >
                    <Option value="">Chọn tỉnh</Option>
                    {Array.isArray(province) &&
                        province.map((prov) => (
                            <Option key={prov.province_id} value={prov.province_id}>
                                {prov.name}
                            </Option>
                        ))
}
                </Select>
            </div>
            {loading ? (
                <Spin />
            ) : (
                <Table
                    columns={columns}
                    dataSource={districAvailble}
                    pagination={false}
                    rowKey="id"
                    style={{ backgroundColor: 'white' }}
                    locale={{ emptyText: 'Không có huyện nào cho tỉnh này' }}
                />
            )}
        </div>
    );
}