import { Spin } from 'antd';
import React from 'react';
import { IoClose, IoLocationOutline } from 'react-icons/io5';

const LandAdministrationModal = ({ landAdministrationData, loading, hanldeClose }) => {
    return (
        <div className="land-administration ">
            <div className="land-administration__land">
                Tờ <strong>{landAdministrationData.shbando}</strong> Thửa{' '}
                <strong>{landAdministrationData.shthua}</strong>, Diện tích{' '}
                <strong>{landAdministrationData.dientich} m²</strong>
            </div>
            <div className="land-administration__location">
                <IoLocationOutline />
                <span className="land-administration__location--detail">
                    {landAdministrationData.xaphuong || '...'},{' '}
                </span>
                <span className="land-administration__location--detail">
                    {landAdministrationData.quanhuyen || '...'},{' '}
                </span>
                <span className="land-administration__location--detail">{landAdministrationData.tinhtp || '...'}</span>
            </div>
            <p className="land-administration--desc">
                (Dữ liệu tham khảo, vui lòng căn cứ theo màu và ký hiệu đất trên bản đồ)
            </p>
            <div className="land-administration__close" onClick={hanldeClose}>
                <IoClose size={26} />
            </div>
            {loading && (
                <div className="land-administration__loading loading">
                    <Spin className="land-administration__loading--icon" />
                </div>
            )}
        </div>
    );
};

export default LandAdministrationModal;
