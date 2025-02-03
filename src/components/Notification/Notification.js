import React from 'react';
import './Notification.scss';
import PaginateList from './PaginateList';

const Notification = () => {
    return (
        <div>
            <div className="container">
                <h2 className="header-title text-center text-uppercase fs-4 my-5 pt-4" style={{ color: '#10B700' }}>
                    DANH SÁCH DỰ ÁN BẤT ĐỘNG SẢN TRÊN TOÀN QUỐC
                </h2>
                <PaginateList />
            </div>
        </div>
    );
};

export default Notification;
