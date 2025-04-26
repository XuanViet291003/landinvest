import { Table, Modal } from 'antd';
import React, { memo, useState } from 'react';
import { columns } from '../../pages/BidPlans/components/BidPlansColumns';
import BidPlansDetail from '../../pages/BidPlans/components/BidPlansDetail'; 
import { Empty } from 'antd';

const BidPlansTable = ({ data }) => {
    const [selectedRecord, setSelectedRecord] = useState(null);

    console.log('BidPlansTable data:', data);

    const handleViewDetail = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseDetail = () => {
        setSelectedRecord(null);
    };

    if (!Array.isArray(data) || data.length === 0) {
        return <Empty description="Không có dữ liệu để hiển thị" />;
    }

    return (
        <div>
            <Table
                columns={columns(handleViewDetail)}
                dataSource={data}
                rowKey={(record) => record.ProjectID || record.id}
                scroll={{ x: 1500 }}
                pagination={{ pageSize: 500 }}
            />
            <Modal
                title="Chi tiết dự án"
                open={!!selectedRecord}
                onCancel={handleCloseDetail}
                footer={null}
                width={800}
            >
                <BidPlansDetail record={selectedRecord} onClose={handleCloseDetail} />
            </Modal>
        </div>
    );
};

export default memo(BidPlansTable);