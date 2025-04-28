// src/components/BidPlans/BidPlansColumns.js
import { spanAll } from 'ip-address/dist/v6/helpers';
import BidPlansDescription from './BidPlansDescription';
import { Space,Button } from 'antd';

export const columns = (onViewDetail) => [
  {
    title: 'STT',
    key: 'STT',
    width: 10,
    render: (text, record, index) => index + 1, // Tạo STT tự động
  },
  {
    title: <span className="table-title">Chi tiết dự án</span>,
    key: 'action',
    width: 80,
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
    title: <span className="table-title">Tên dự án</span>,
    dataIndex: 'projectName',
    key: 'projectName',
    render: (text) => <BidPlansDescription description={text} maxLines={3} />,
    width: 300,
  },
  {
    title: <span className="table-title">Đột biến hạ tầng</span>,
    dataIndex: 'dotbien_hatang',
    key: 'dotbien_hatang',
    width: 160,
  },
  {
    title: <span className="table-title">Chủ đầu tư</span>,
    dataIndex: 'chudautu',
    key: 'chudautu',
    width: 300,
    render: (text) => <BidPlansDescription description={text} maxLines={3} />,
  },
  {
    title: <span className="table-title">Tổng mức đầu tư (VNĐ)</span>,
    dataIndex: 'tongmuc_dautu',
    key: 'tongmuc_dautu',
    width: 150,
    render: (text) => (text ? text.toLocaleString() : 'N/A'),
  },
  {
    title: <span className="table-title">Ngày công khai</span>,
    dataIndex: 'publicDate',
    key: 'publicDate',
    width: 150,
    render: (text) => (text ? new Date(text).toLocaleDateString() : 'N/A'),
  },
  {
    title: <span className="table-title">Ngày đóng thầu</span>,
    dataIndex: 'bidCloseDate',
    key: 'bidCloseDate',
    width: 150,
    render: (text) => (text ? new Date(text).toLocaleDateString() : 'N/A'),
  },
  {
    title: <span className="table-title">Tên gói thầu</span>,
    dataIndex: 'bidName',
    key: 'bidName',
    width: 100,
    render: (bidNames) => {
      if (!Array.isArray(bidNames) || bidNames.length === 0) return 'N/A';
      return bidNames.map((bid, index) => <div key={index}>{bid.name}</div>);
    },
  },
];