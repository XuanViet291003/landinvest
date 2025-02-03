import { Drawer, Spin } from 'antd';
import { set } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { THUNK_API_STATUS } from '../../../constants/thunkApiStatus';
import { getLandUsePlan, onChangeDrawer } from '../../../redux/landUsePlanSlice/lanUsePlanSlice';

export default function DrawerLandUsePlan() {
    const isOpen = useSelector((state) => state.landUsePlan.isDrawerOpen);
    const dispatch = useDispatch();
    const onCloseDrawer = () => {
        dispatch(onChangeDrawer(false));
        setExtend(false);
    };
    const landUsePlan = useSelector((state) => state.landUsePlan.LandUsePlan);
    const landUsePlanStatus = useSelector((state) => state.landUsePlan.statusLandUsePlan);
    const districtId = useSelector((state) => state.landCost.districtId);
    useEffect(() => {
        dispatch(
            getLandUsePlan({
                idDistrict: districtId,
            }),
        );
    }, [districtId]);
    const [isExtend, setExtend] = useState(false);
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
            height={window.innerWidth < 768 ? 'auto' : '100%'}
            className={`overflow-y-hidden ${window.innerWidth > 768 && 'desktop'}`}
        >
            {landUsePlanStatus !== THUNK_API_STATUS.PENDING &&
                landUsePlanStatus !== THUNK_API_STATUS.REJECTED &&
                landUsePlan && (
                    <div
                        className="hidden-scroll"
                        style={{
                            scrollbarWidth: 'none', // Firefox
                            msOverflowStyle: 'none', // IE/Edge
                            paddingLeft: '5px',
                            paddingTop: '15px',
                            backgroundColor: '#2c353d',
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
                            Đang hiển thị ở {landUsePlan.District_name}, {landUsePlan.Province_name}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <p
                                style={{
                                    color: '#0bff28',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                }}
                                onClick={() => setExtend(!isExtend)}
                            >
                                {isExtend ? 'Thu nhỏ bảng kế hoạch' : 'Mở rộng bảng kế hoạch'}
                            </p>
                            <p style={{color: 'white'}}>Hoặc</p>
                            <Link
                                to={`/landuseplan?idDistrict=${districtId}`}
                                style={{
                                    color: '#0bff28',
                                    textDecoration: 'none',
                                    cursor: 'pointer',
                                }}
                            >
                                Đi tới trang
                            </Link>
                        </div>

                        <hr />
                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '5px',
                            }}
                        >
                            {landUsePlan.list_kehoach.map((item, index) => (
                                <div
                                    style={{
                                        backgroundColor: '#212529',
                                        borderRadius: '5px',
                                        padding: 5,
                                        color: 'white',
                                    }}
                                    key={index}
                                >
                                    <p style={{ fontWeight: 700 }}>{item?.DanhMuc}</p>
                                    <p>Diện tích: {item.DienTich} Ha</p>
                                    <p style={{ color: '#d6d6d6' }}>Trực thuộc: {item?.CoQuan}</p>
                                    <p style={{ color: '#d6d6d6' }}>
                                        Địa chỉ: {item?.DiaDanh2}, {item?.DiaDanh1}
                                    </p>
                                    <Link
                                        style={{
                                            color: '#0bff28',
                                            textDecoration: 'none',
                                        }}
                                        to={`/landuseplan/${item.ProvinceID}?idDistrict=${item.DistrictID}&name=${item.DiaDanh1}`}
                                    >
                                        Xem chi tiết
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            {landUsePlanStatus === THUNK_API_STATUS.PENDING && (
                <div
                    style={{
                        backgroundColor: '#2c353d',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100vh',
                    }}
                >
                    <Spin />
                </div>
            )}
        </Drawer>
    );
}
