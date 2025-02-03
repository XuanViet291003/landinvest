/* eslint-disable eqeqeq */
import React, { useEffect, useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import instance from '../../utils/axios-customize';
import './landUsePlan.scss';
import { ConfigProvider, Pagination, Spin, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getLandUsePlan } from '../../redux/landUsePlanSlice/lanUsePlanSlice';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import TableDescription from '../../components/elements/TableDescription';
import { arrayBannerImage } from '../../assets/banner/image';

export default function LandUsePlan() {
    // PARAMS
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    // COMPONENTS STATE
    const [loading, setLoading] = useState(false);
    const [province, setProvince] = useState([]);
    const [districAvailble, setDistrictAvailble] = useState([]);
    const [selectedProvinceId, setSelectedProvinceID] = useState(searchParams.get('idProvince') || 24);
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                const { data } = await instance.get(`/list_quan_huyen_co_khsdd`);
                setProvince(data.list_kehoach);
                const findIndexProvince = data.list_kehoach.find((item) => item.province_id === 24);
                setDistrictAvailble(findIndexProvince.kehoach);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
            }
        })();
    }, []);
    const currentProvince = province.find((item) => item.province_id === selectedProvinceId);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'STT',
            key: 'STT',
            render: (text) => <span>{text}</span>,
            with: '10%',
        },
        {
            title: <span className="table-title">Tên Huyện</span>,
            dataIndex: 'ten_huyen',
            key: 'ten_huyen',
            render: (text) => <span>{text || 'Chưa cập nhật'}</span>,
            width: '30%',
        },
        {
            title: <span className="table-title">Tên Thành Phố</span>,
            dataIndex: 'city',
            key: 'city',
            render: (text) => <span>{text || 'Chưa cập nhật'}</span>,
            width: '30%',
        },
        {
            title: <span className="table-title">Năm hết hạn</span>,
            dataIndex: 'nam_het_han',
            key: 'nam_het_han',
            render: (item) => <span className="land-cost-address">{item || 'Chưa cập nhật'}</span>,
            width: '15%',
        },
        {
            title: <span className="table-title">Thao tác</span>,
            dataIndex: ['id', 'name'],
            key: 'id',
            render: (item, record) => (
                <Link
                    to={`/landuseplan/${selectedProvinceId}?idDistrict=${record.id}&name=${record.name}`}
                    style={{ color: '#3DB700', textDecoration: 'none' }}
                >
                    Xem chi tiết
                </Link>
            ),
            width: '15%',
        },
    ];
    return (
        <Container className="landplan-container">
            <Carousel style={{ marginTop: '15px' }} controls={false} interval={5000}>
                {arrayBannerImage.map((image, index) => (
                    <Carousel.Item key={index}>
                        <div>
                            <img className="image-banner" src={image} alt="" />
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
            <div style={{marginTop: '15px'}}>
                <Link to={`/`} style={{ color: '#3DB700', marginTop: '25px', textDecoration: 'none' }}>
                    Quay về trang chủ
                </Link>
            </div>
            <div>
                <h3 style={{ color: 'white' }}>Kế hoạch sử dụng đất</h3>
                <div style={{ display: 'flex' }}>
                    <select
                        className="information-location-select"
                        value={selectedProvinceId}
                        placeholder="Tỉnh, thành phố"
                    >
                        <option value="">Chọn tỉnh</option>
                        {province.map((province) => {
                            return (
                                <option key={province.province_id} value={province.province_id}>
                                    {province.name}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <p className="land-cost__container--notice">Giữ shift + lăn chuột để xem các cột tiếp theo</p>
                <div className="land-plan__container-table">
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
                            loading={loading}
                            rowKey={(record) => record.key}
                            dataSource={districAvailble.map((item, index) => ({
                                STT: index + 1,
                                ten_huyen: item.ten_huyen,
                                nam_het_han: item.nam_het_han,
                                id: item.id_district,
                                city: currentProvince.name,
                                name: item.ten_huyen,
                            }))}
                            showSizeChanger={false}
                            scroll={{
                                scrollToFirstRowOnChange: true,
                                x: 'max-content',
                            }}
                            pagination={false}
                        />
                    </ConfigProvider>
                </div>
            </div>
        </Container>
    );
}
