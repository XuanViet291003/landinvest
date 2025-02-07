import React from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import './Notification.scss';
const SearchItem = ({ searchTerm, handleSearch }) => {
    return (
        <div className="input-group-search mb-3">
            <IoSearchOutline className="input-icon" />
            <input placeholder="Tim kiếm dự án" type="text" onChange={handleSearch} value={searchTerm} />

            {/* <div className="input-button">
                <button className="btn btn-primary" type="button">
                    Tìm kiếm
                </button>
            </div> */}
        </div>
    );
};

export default SearchItem;
