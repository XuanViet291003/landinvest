import { Drawer, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { THUNK_API_STATUS } from '../../../constants/thunkApiStatus';
import { getLandUsePlan, getLandUsePlan2, onChangeDrawer } from '../../../redux/landUsePlanSlice/lanUsePlanSlice';

// Hàm format tiền VNĐ
const formatVND = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

export default function DrawerLandUsePlan() {
    const isOpen = useSelector((state) => state.landUsePlan.isDrawerOpen);
    const dispatch = useDispatch();
    const onCloseDrawer = () => {
        dispatch(onChangeDrawer(false));
        setExtend(false);
    };
    const landUsePlan = useSelector((state) => state.landUsePlan.LandUsePlan);
    const landUsePlanStatus = useSelector((state) => state.landUsePlan.statusLandUsePlan);
    const landUsePlan2 = useSelector((state) => state.landUsePlan.LandUsePlan2);
    const landUsePlan2Status = useSelector((state) => state.landUsePlan.statusLandUsePlan2);
    const districtId = useSelector((state) => state.landCost.districtId);

    useEffect(() => {
        if (districtId) {
            dispatch(getLandUsePlan({ idDistrict: districtId }));
            dispatch(getLandUsePlan2({ idDistrict: districtId }));
        }
    }, [dispatch, districtId]);

    const [isExtend, setExtend] = useState(false);

    // --- Nội dung bên trong Drawer ---
    let content = null;

    const isLoading = landUsePlanStatus === THUNK_API_STATUS.PENDING || landUsePlan2Status === THUNK_API_STATUS.PENDING;
    const isError = landUsePlanStatus === THUNK_API_STATUS.REJECTED && landUsePlan2Status === THUNK_API_STATUS.REJECTED;

    if (isLoading) {
        content = (
            <div
                style={{
                    backgroundColor: '#2c353d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100%',
                }}
            >
                <Spin />
            </div>
        );
    } else if (isError) {
        content = (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px', backgroundColor: '#2c353d', height: '100%' }}>
                Lỗi tải dữ liệu kế hoạch sử dụng đất. Vui lòng thử lại.
            </div>
        );
    } else if (landUsePlan?.list_kehoach && Array.isArray(landUsePlan.list_kehoach) && landUsePlan.list_kehoach.length > 0) {
        // Hiển thị LandUsePlan.list_kehoach nếu LandUsePlan2.projects không có dữ liệu
        content = (
            <div
                className="hidden-scroll"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: '5px',
                    paddingTop: '15px',
                    backgroundColor: '#2c353d',
                    height: '100%',
                    overflowY: 'auto'
                }}
            >
                <style>
                    {`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                    `}
                </style>
                <p style={{ fontWeight: 600, color: 'white' }}>
                    Đang hiển thị ở {landUsePlan?.District_name}, {landUsePlan?.Province_name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <p style={{ cursor: 'pointer', color: '#3DB700' }} onClick={() => setExtend(!isExtend)}>
                        {isExtend ? 'Thu nhỏ bảng kế hoạch' : 'Mở rộng bảng kế hoạch'}
                    </p>
                    <p style={{ color: 'white' }}>Hoặc</p>
                    <Link /*to={`/landuseplan/${districtId}`} style={{ color: '#3DB700', textDecoration: 'none' }}*/>
                        Đi tới trang
                    </Link>
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {landUsePlan.list_kehoach.map((item, index) => (
                        <div key={index} style={{ padding: '10px', borderBottom: '1px solid #444' }}>
                            <p style={{ fontWeight: 700, color: 'white' }}>{item?.DanhMuc}</p>
                            <p style={{ color: 'white' }}>Diện tích: {item?.DienTich} Ha</p>
                            <p style={{ color: '#d6d6d6' }}>Trực thuộc: {item?.CoQuan}</p>
                            <p style={{ color: '#d6d6d6' }}>
                                Địa chỉ: {item?.DiaDanh2}, {item?.DiaDanh1}
                            </p>
                            <Link /*to={`/kehoach/${item?.id}`} style={{ color: '#3DB700', textDecoration: 'none' }}*/>
                                Xem chi tiết
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
    else if (landUsePlan2?.projects && Array.isArray(landUsePlan2.projects) && landUsePlan2.projects.length > 0) {
        // Ưu tiên hiển thị LandUsePlan2.projects nếu có dữ liệu
        content = (
            <div
                className="hidden-scroll"
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    paddingLeft: '5px',
                    paddingTop: '15px',
                    backgroundColor: '#2c353d',
                    height: '100%',
                    overflowY: 'auto'
                }}
            >
                <style>
                    {`
                    div::-webkit-scrollbar {
                        display: none;
                    }
                    `}
                </style>
                <p style={{ fontWeight: 600, color: 'white' }}>
                    Đang hiển thị ở {landUsePlan?.District_name || 'Huyện chưa xác định'}, {landUsePlan?.Province_name || 'Tỉnh chưa xác định'}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <p style={{ cursor: 'pointer', color: '#3DB700' }} onClick={() => setExtend(!isExtend)}>
                        {isExtend ? 'Thu nhỏ bảng kế hoạch' : 'Mở rộng bảng kế hoạch'}
                    </p>
                    <p style={{ color: 'white' }}>Hoặc</p>
                    <Link /*to={`/landuseplan/${districtId}`} style={{ color: '#3DB700', textDecoration: 'none' }}*/>
                        Đi tới trang
                    </Link>
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {landUsePlan2.projects.map((item, index) => (
                        <div key={index} style={{ padding: '10px', borderBottom: '1px solid #444' }}>
                            <p style={{ fontWeight: 700, color: 'white' }}>{item?.projectName || 'Dự án chưa xác định'}</p>
                            <p style={{ color: 'white' }}>Chủ đầu tư: {item?.chudautu || 'Chưa cập nhật'}</p>
                            <p style={{ color: 'white' }}>Tổng mức đầu tư: {item?.tongmuc_dautu ? formatVND(item.tongmuc_dautu) : 'Chưa cập nhật'}</p>
                            <p style={{ color: '#d6d6d6' }}>Loại dự án: {item?.dotbien_hatang || 'Chưa cập nhật'}</p>
                            <p style={{ color: '#d6d6d6' }}>Ngày công bố: {item?.publicDate || 'Chưa cập nhật'}</p>
                            <a
                                href={item?.link_muasamcong}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: '#3DB700', textDecoration: 'none' }}
                            >
                                Xem chi tiết đấu thầu
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        );
    }  else {
        // Không có dữ liệu từ cả hai API
        content = (
            <div style={{ color: 'grey', textAlign: 'center', padding: '20px', backgroundColor: '#2c353d', height: '100%' }}>
                Không có dữ liệu kế hoạch sử dụng đất để hiển thị.
            </div>
        );
    }

    return (
        <Drawer
            placement={window.innerWidth < 768 ? 'bottom' : 'right'}
            mask={false}
            afterOpenChange={() => setExtend(false)}
            onClose={onCloseDrawer}
            title={'Kế hoạch sử dụng đất'}
            open={isOpen}
            key={'bottom'}
            width={isExtend ? '100%' : 400}
            height={window.innerWidth < 768 ? '70vh' : '100%'}
            className={`overflow-y-hidden ${window.innerWidth > 768 && 'desktop'}`}
            bodyStyle={{ padding: 0, overflow: 'hidden', height: 'calc(100% - 55px)' }}
            style={{ backgroundColor: '#2c353d' }}
        >
            {content}
        </Drawer>
    );
}