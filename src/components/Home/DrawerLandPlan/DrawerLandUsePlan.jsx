import { Drawer, Spin } from 'antd';
// import { set } from 'lodash'; // Có vẻ không dùng set của lodash? Xóa nếu không cần.
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
        // Chỉ gọi API nếu có districtId hợp lệ để tránh gọi khi districtId là null/undefined ban đầu
        if (districtId) {
             dispatch(
                getLandUsePlan({
                    idDistrict: districtId,
                }),
            );
        }
    }, [dispatch, districtId]); // Thêm dispatch vào dependencies

    const [isExtend, setExtend] = useState(false);

    // --- Nội dung bên trong Drawer ---
    let content = null;

    if (landUsePlanStatus === THUNK_API_STATUS.PENDING) {
        // --- Trạng thái Đang Tải ---
        content = (
            <div
                style={{
                    backgroundColor: '#2c353d',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    // Điều chỉnh height nếu cần, ví dụ height: '300px' hoặc '100%' tùy layout
                    height: '100%',
                }}
            >
                <Spin />
            </div>
        );
    } else if (landUsePlanStatus === THUNK_API_STATUS.REJECTED) {
        // --- Trạng thái Lỗi ---
        content = (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px', backgroundColor: '#2c353d', height: '100%' }}>
                Lỗi tải dữ liệu kế hoạch sử dụng đất. Vui lòng thử lại.
            </div>
        );
    } else if (landUsePlan) {
        // --- Trạng thái Thành Công và có dữ liệu landUsePlan ---
        content = (
            <div
                className="hidden-scroll"
                style={{
                    scrollbarWidth: 'none', // Firefox
                    msOverflowStyle: 'none', // IE/Edge
                    paddingLeft: '5px',
                    paddingTop: '15px',
                    backgroundColor: '#2c353d',
                    height: '100%', // Đảm bảo nội dung chiếm đủ chiều cao
                    overflowY: 'auto' // Cho phép cuộn nếu nội dung dài
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
                    {/* Thêm kiểm tra optional chaining (?) đề phòng landUsePlan chưa có các key này */}
                    Đang hiển thị ở {landUsePlan?.District_name}, {landUsePlan?.Province_name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <p /* ... style nút mở rộng ... */ onClick={() => setExtend(!isExtend)}>
                        {isExtend ? 'Thu nhỏ bảng kế hoạch' : 'Mở rộng bảng kế hoạch'}
                    </p>
                    <p style={{color: 'white'}}>Hoặc</p>
                    <Link /* ... style và to của link tới trang ... */ >
                        Đi tới trang
                    </Link>
                </div>
                <hr />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    {/* **** ĐÂY LÀ CHỖ SỬA QUAN TRỌNG **** */}
                    {landUsePlan.list_kehoach && Array.isArray(landUsePlan.list_kehoach) && landUsePlan.list_kehoach.length > 0 ? (
                        // Nếu list_kehoach là mảng và không rỗng thì mới map
                        landUsePlan.list_kehoach.map((item, index) => (
                            <div /* ... style item ... */ key={index} >
                                <p style={{ fontWeight: 700 }}>{item?.DanhMuc}</p>
                                <p>Diện tích: {item?.DienTich} Ha</p>
                                <p style={{ color: '#d6d6d6' }}>Trực thuộc: {item?.CoQuan}</p>
                                <p style={{ color: '#d6d6d6' }}>
                                     Địa chỉ: {item?.DiaDanh2}, {item?.DiaDanh1}
                                </p>
                                <Link /* ... style và to của Link xem chi tiết ... */ >
                                    Xem chi tiết
                                </Link>
                            </div>
                        ))
                    ) : (
                        // Nếu list_kehoach không phải mảng hoặc rỗng
                        <p style={{ color: 'white', textAlign: 'center' }}>
                            Không có dữ liệu kế hoạch chi tiết để hiển thị.
                        </p>
                    )}
                </div>
            </div>
        );
    } else {
         // Trường hợp status không phải PENDING/REJECTED nhưng landUsePlan là null/undefined
         // (Có thể xảy ra nếu initial state là null và API chưa bao giờ thành công)
         content = (
             <div style={{ color: 'grey', textAlign: 'center', padding: '20px', backgroundColor: '#2c353d', height: '100%' }}>
                 Chưa có dữ liệu.
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
            // Chú ý: height='auto' cho mobile có thể không đủ nếu nội dung dài
            height={window.innerWidth < 768 ? '70vh' : '100%'} // Tăng chiều cao thử cho mobile
            className={`overflow-y-hidden ${window.innerWidth > 768 && 'desktop'}`}
            // Bỏ overflow-y-hidden ở Drawer, để div content bên trong tự cuộn
             bodyStyle={{ padding: 0, overflow: 'hidden', height: 'calc(100% - 55px)' }} // 55px là chiều cao title mặc định của antd
             style={{ backgroundColor: '#2c353d'}} // Set nền cho toàn bộ drawer nếu cần
        >
            {content}
        </Drawer>
    );
}