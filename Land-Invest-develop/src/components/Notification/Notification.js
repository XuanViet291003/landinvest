import React from 'react';
import { Carousel } from 'react-bootstrap';
import { arrayBannerImage } from '../../assets/banner/image';
import './Notification.scss';
import PaginateList from './PaginateList';
const Notification = () => {
    return (
        <div className="">
            <div className="container">
                <Carousel style={{ marginTop: '15px' }} infinite interval={5000}>
                    {arrayBannerImage
                        .reduce((acc, _, i) => {
                            if (i % 2 === 0) {
                                acc.push(arrayBannerImage.slice(i, i + 2));
                            }
                            return acc;
                        }, [])
                        .map((pair, index) => (
                            <Carousel.Item key={index}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                    {pair.map((image, i) => (
                                        <img
                                            key={i}
                                            style={{ objectFit: 'contain', width: '50%' }}
                                            src={image}
                                            alt=""
                                        />
                                    ))}
                                </div>
                            </Carousel.Item>
                        ))}
                </Carousel>
                <h2 className="header-title text-center text-uppercase fs-4 my-5 pt-4" style={{ color: '#10B700' }}>
                    DANH SÁCH DỰ ÁN BẤT ĐỘNG SẢN TRÊN TOÀN QUỐC
                </h2>
                <PaginateList />
            </div>
        </div>
    );
};

export default Notification;
