// src/components/BidPlans/BidPlansDetail.jsx
import React from 'react';
import { Descriptions } from 'antd';

const BidPlansDetail = ({ record, onClose }) => {
  if (!record) {
    return <div>Không có dữ liệu để hiển thị</div>;
  }

  const bidNames = Array.isArray(record.bidNamePlanNew)
    ? record.bidNamePlanNew.map((bid) => bid.name).join('; ')
    : 'N/A';

  return (
    <div style={{ padding: 16 }}>
      <h2>Chi tiết dự án</h2>
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Tên dự án">{record.projectName || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Chủ đầu tư">{record.chudautu || 'N/A'}</Descriptions.Item>
        <Descriptions.Item label="Tổng mức đầu tư">
          {record.tongmuc_dautu ? record.tongmuc_dautu.toLocaleString() + ' VNĐ' : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày công khai">
          {record.publicDate ? new Date(record.publicDate).toLocaleDateString() : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Ngày đóng thầu">
          {record.bidCloseDate ? new Date(record.bidCloseDate).toLocaleDateString() : 'N/A'}
        </Descriptions.Item>
        <Descriptions.Item label="Tên gói thầu">{bidNames}</Descriptions.Item>
        <Descriptions.Item label="Link đấu thầu">
          <a href={record.link_muasamcong} target="_blank" rel="noopener noreferrer">
            Xem chi tiết
          </a>
        </Descriptions.Item>
      </Descriptions>
      <button onClick={onClose} style={{ marginTop: 16 }}>
        Đóng
      </button>
    </div>
  );
};

export default BidPlansDetail;