import React, { memo } from 'react';
import { FaLocationArrow } from "react-icons/fa6";
import { formatDate } from '../../../function/formatDateToYMD';

const AuctionLocationItem = ({ item }) => {
    return (
        <div class="auction-card">
            <p class="limited-text">{item?.Title}</p>
            <p>
                Tài sản của <span class="link">{item?.AuctionAddress}</span>
            </p>
            <a href={item?.AuctionUrl} className='auction-card-link' target="_blank" rel="noopener noreferrer">
                Chi tiết bài viết tại đây
            </a>
            <span className='auction-card-go-to'>Đến vị trí này <FaLocationArrow color='#fff' /></span>
            <div class="date-info">
                <p>
                    Ngày công khai: <span>{formatDate(item?.CreateAt)}</span>
                </p>
                <p>
                    Ngày tổ chức đấu giá: <span>{formatDate(item?.EventSchedule)}</span>
                </p>
            </div>
        </div>
    );
};

export default memo(AuctionLocationItem);
