import React from 'react';

const Loading = () => {
    return (
        <div className="flex justify-center items-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            <span className="ml-4 text-blue-600">Đang tải dữ liệu...</span>
        </div>
    );
};

export default Loading;
