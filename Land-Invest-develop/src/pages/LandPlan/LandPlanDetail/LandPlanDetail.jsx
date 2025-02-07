/* eslint-disable eqeqeq */
import { ConfigProvider, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import '../landUsePlan.scss';
import TableDescription from '../../../components/elements/TableDescription';
import { getLandUsePlan } from '../../../redux/landUsePlanSlice/lanUsePlanSlice';
import { THUNK_API_STATUS } from '../../../constants/thunkApiStatus';
export const columns = [
    {
        title: 'STT',
        dataIndex: 'STT',
        key: 'STT',
        render: (text) => <span>{text}</span>, // Chỉ render giá trị text
    },
    {
        title: <span className="table-title">Danh mục</span>,
        dataIndex: 'DanhMuc',
        key: 'DanhMuc',
        render: (text) => <TableDescription description={text || 'Chưa cập nhật'} />,
        width: '200px',
    },
    {
        title: <span className="table-title">Cơ quan</span>,
        dataIndex: 'CoQuan',
        key: 'CoQuan',
        render: (item) => <span className="land-cost-address">{item || 'Chưa cập nhật'}</span>,
        width: '300px',
    },
    {
        title: <span className="table-title">Diện tích</span>,
        dataIndex: 'DienTich',
        key: 'DienTich',
        render: (text) => <span className="land-cost-address">{text ? text + ' Ha' : 'Chưa cập nhật'}</span>,
        width: '150px',
    },
    {
        title: <span className="table-title">Thu hồi đất</span>,
        dataIndex: 'ThuHoiDat',
        key: 'ThuHoiDat',
        render: (text) => <span className="land-cost-address">{text ? text + ' Ha' : 'Chưa cập nhật'}</span>,
        width: '150px',
    },
    {
        title: <span className="table-title">Mã đất</span>,
        dataIndex: 'MaDat',
        key: 'MaDat',
        render: (text) => <span className="land-cost-address">{text || 'Chưa cập nhật'}</span>,
        width: '150px',
    },
    {
        title: <span className="table-title">Địa chỉ</span>,
        dataIndex: 'Address',
        key: 'Address',
        render: (address) => <span className="land-cost-address">{address || 'Chưa cập nhật'}</span>,
        width: '300px',
    },
    {
        title: <span className="table-title">Căn cứ pháp lý</span>,
        key: 'CanCuPhapLy',
        dataIndex: 'CanCuPhapLy',
        render: (description) => <TableDescription description={description || 'Chưa cập nhật'} />,
        width: '250px',
    },
    {
        title: <span className="table-title">Loại</span>,
        key: 'Loai',
        dataIndex: 'Loai',
        render: (description) => <TableDescription description={description || 'Chưa cập nhật'} />,
        width: '250px',
    },

    {
        title: <span className="table-title">Rừng phòng hộ</span>,
        key: 'RungPhongHo',
        dataIndex: 'RungPhongHo',
        render: (description) => <span className="land-cost-address">{description || 'Chưa cập nhật'}</span>,
        width: '250px',
    },
    {
        title: <span className="table-title">Rừng sản xuất</span>,
        key: 'RungSanXuat',
        dataIndex: 'RungSanXuat',
        render: (description) => <span className="land-cost-address">{description || 'Chưa cập nhật'}</span>,
        width: '250px',
    },
    {
        title: <span className="table-title">Ghi chú</span>,
        key: 'GhiChu',
        dataIndex: 'GhiChu',
        render: (description) => <TableDescription description={description || 'Chưa cập nhật'} />,
        width: '250px',
    },
    {
        title: <span className="table-title">Vị trí</span>,
        key: 'ViTriTrenBanDo',
        dataIndex: 'ViTriTrenBanDo',
        render: (description) => <span className="land-cost-address">{description || 'Chưa cập nhật'}</span>,
        width: '250px',
    },
    // {
    //     title: <span className="table-title">Ngày công bố</span>,
    //     key: 'CreateAt',
    //     dataIndex: 'CreateAt',
    //     render: (CreateAt) => {
    //         return <span>{formatDate(CreateAt)}</span>;
    //     },
    //     width: '150px',
    // },
    // {
    //     title: <span className="table-title">Ngày đấu giá</span>,
    //     key: 'EventSchedule',
    //     dataIndex: 'EventSchedule',
    //     render: (EventSchedule) => {
    //         return <span>{formatDate(EventSchedule)}</span>;
    //     },
    //     width: '150px',
    // },
    // {
    //     title: <span className="table-title">Giá gửi</span>,
    //     key: 'DepositPrice',
    //     dataIndex: 'DepositPrice',
    //     render: (DepositPrice) => {
    //         return <span>{DepositPrice}</span>;
    //     },
    //     width: '180px',
    // },
    // {
    //     title: <span className="table-title">Giá sàn</span>,
    //     key: 'OpenPrice',
    //     dataIndex: 'OpenPrice',
    //     render: (OpenPrice) => {
    //         return <span>{toVndCurrency(OpenPrice)}</span>;
    //     },
    //     width: '150px',
    // },
    // {
    //     title: <span className="table-title">Vị trí</span>,
    //     key: 'DistrictID',
    //     dataIndex: 'DistrictID',
    //     render: (DistrictID) => {
    //         return <HandleGotoLocation DistrictID={DistrictID} />;
    //     },
    //     width: '200px',
    // },
];

export default function LandUsePlanDetail() {
    // PARAMS
    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    // RTK
    const dispatch = useDispatch();
    const landUsePlan = useSelector((state) => state.landUsePlan.LandUsePlan);
    const landUsePlanStatus = useSelector((state) => state.landUsePlan.statusLandUsePlan);
    const listPlan = landUsePlan.list_kehoach;
    // COMPONENTS STATE
    const [idDistrict, setIdDistrict] = useState(searchParams.get('idDistrict') || 2);
    const [nameDistrict, setNameDistrict] = useState(searchParams.get('name')|| 'Chưa cập nhật')
    useEffect(() => {
        dispatch(
            getLandUsePlan({
                idDistrict: idDistrict,
            }),
        );
    }, [idDistrict]);
    useEffect(() => {
        if (!searchParams.get('idDistrict')) navigate('/landuseplan');
    }, [location]);
    return (
        <Container className="landplan-container">
            <Link style={{ color: '#3DB700',marginTop: '25px', textDecoration: 'none' }} to={'/landuseplan'}>
                Quay trở về bảng quận huyện
            </Link>
            <div style={{ marginTop: '5px' }}>
                <h3 style={{ color: 'white', marginTop: '5px', fontSize: '18px' }}>Kế hoạch sử dụng đất tại <span style={{ color: '#3DB700'}}>{nameDistrict}</span></h3>
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
                            loading={landUsePlanStatus === THUNK_API_STATUS.PENDING}
                            rowKey={(record) => record.key}
                            dataSource={listPlan.map((item, index) => ({
                                key: item.id,
                                STT: index + 1,
                                DanhMuc: item.DanhMuc,
                                MaDat: item.MaDat,
                                CoQuan: item.CoQuan,
                                ThuHoiDat: item.ThuHoiDat,
                                Address: `${item.DiaDanh2} - ${item.DiaDanh1}`,
                                CanCuPhapLy: item.CanCuPhapLy,
                                DienTich: item.DienTich,
                                Loai: item.Loai,
                                ViTriTrenBanDo: item.ViTriTrenBanDo,
                                RungPhongHo: item.RungPhongHo,
                                RungSanXuat: item.RungSanXuat,
                                GhiChu: item.GhiChu,
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
