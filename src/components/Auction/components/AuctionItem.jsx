import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { getTimeLeft } from '../../../function/getTimeLeft';

const AuctionItem = ({ auction }) => {
    const isTimeBefore = getTimeLeft(auction.RegistrationEndTime);
    return (
        <div className="auctions-list">
            <p className="auctions-list-title">{auction.Title}</p>
            <p className="auctions-list-time">Địa chỉ đấu giá tại {auction.AuctionAddress}</p>
            <p className="auctions-list-time">
                (Đăng ký tham gia đấu giá từ: {auction.RegistrationStartTime ? auction.RegistrationStartTime : 'N/A'};
                Thời gian tổ chức đấu giá: {auction.RegistrationEndTime ? auction.RegistrationEndTime : 'N/A'} )
            </p>
            <Link className="auctions-list-detail" to={`${auction.LandAuctionID}`}>
                Chi tiết tại đây
            </Link>
            <div className="auctions-list-time__wrapper">
                <p className="auctions-list-time">
                    (Ngày công khai: {auction.EventSchedule ? auction.EventSchedule : 'N/A'})
                </p>
                {!isTimeBefore && <span className="auctions-list-time-expired">Đã hết hạn đăng ký</span>}
                {isTimeBefore && (
                    <span className="auctions-list-time-remaing">{`Còn ${isTimeBefore.days} ngày, ${isTimeBefore.hours} giờ, ${isTimeBefore.minutes} phút để đăng ký`}</span>
                )}
            </div>
        </div>
    );
};

export default memo(AuctionItem);
