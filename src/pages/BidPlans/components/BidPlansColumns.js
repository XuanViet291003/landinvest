// src/components/BidPlans/BidPlansColumns.js
import BidPlansDescription from './BidPlansDescription';
import { Space,Button } from 'antd';

export const columns = (onViewDetail) => [
  {
    title: 'STT',
    key: 'STT',
    width: 50,
    render: (text, record, index) => index + 1, // Tạo STT tự động
  },
  {
    title: 'Chi tiết dự án',
    key: 'action',
    width: 170,
    render: (text, record) => (
      <Space size="middle">
        <Button 
          type="link"
          onClick={() => onViewDetail(record)}
          style={{ padding: '0' }}
        >
          Xem chi tiết
        </Button>
      </Space>
    ),
  },
  {
    title: 'Tên dự án',
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text) => <BidPlansDescription description={text} maxLines={3} />,
    width: 300,
  },
  {
    title: 'Đột biến hạ tầng',
    dataIndex: 'dotbien_hatang',
    key: 'dotbien_hatang',
    width: 260,
  },
  {
    title: 'Chủ đầu tư',
    dataIndex: 'chudautu',
    key: 'chudautu',
    width: 300,
    render: (text) => <BidPlansDescription description={text} maxLines={3} />,
  },
  {
    title: 'Tổng mức đầu tư (VNĐ)',
    dataIndex: 'tongmuc_dautu',
    key: 'tongmuc_dautu',
    width: 150,
    render: (text) => (text ? text.toLocaleString() : 'N/A'),
  },
  {
    title: 'Ngày công khai',
    dataIndex: 'publicDate',
    key: 'publicDate',
    width: 150,
    render: (text) => (text ? new Date(text).toLocaleDateString() : 'N/A'),
  },
  {
    title: 'Ngày đóng thầu',
    dataIndex: 'bidCloseDate',
    key: 'bidCloseDate',
    width: 150,
    render: (text) => (text ? new Date(text).toLocaleDateString() : 'N/A'),
  },
  {
    title: 'Tên gói thầu',
    dataIndex: 'bidNamePlanNew',
    key: 'bidNamePlanNew',
    width: 100,
    render: (bidNames) => {
      if (!Array.isArray(bidNames) || bidNames.length === 0) return 'N/A';
      return bidNames.map((bid, index) => <div key={index}>{bid.name}</div>);
    },
  },
];