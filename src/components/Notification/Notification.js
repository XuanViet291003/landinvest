import React from 'react';
import { Carousel } from 'react-bootstrap';
import { arrayBannerImage } from '../../assets/banner/image';
import './Notification.scss';
import PaginateList from './PaginateList';
import Banner from '../Banner';
const Notification = () => {
    return (
        <div className="" style={{ overflowX: 'hidden' }}>
            <div className="container">
                <Banner />
                <h2 className="header-title text-center text-uppercase fs-4 my-5 pt-4" style={{ color: '#10B700' }}>
                    DANH SÁCH DỰ ÁN BẤT ĐỘNG SẢN TRÊN TOÀN QUỐC
                </h2>
                <PaginateList />
            </div>
        </div>
    );
};

export default Notification;
