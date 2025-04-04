// src/components/BidPlans/BidPlansColumns.js
import BidPlansDescription from './BidPlansDescription';
import BidPlansDetail from './BidPlansDetail';
import { Space } from 'antd';

export const columns = [
  {
    title: 'STT',
    dataIndex: 'STT',
    key: 'STT',
    width: 50,
  },
  {
    title: 'Chi tiết dự án',
    key: 'action',
    width: 170,
    render: (text, record) => (
      <Space size="middle">
        <a onClick={() => record.onViewDetail(record)}>Xem chi tiết</a>
      </Space>
    ),
  },
  {
    title: 'Tên dự án',
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text) => <BidPlansDescription description={text} oneLine/>,
      width: 300,
    },
    {
      title: 'Đột biến hạ tầng',
      dataIndex: 'dotbien_hatang',
      key: 'dotbien_hatang',
      width: 300,
    },
    {
      title: 'Chủ đầu tư',
      dataIndex: 'chudautu',
      key: 'chudautu',
      width: 200,
      render: (text) => <BidPlansDescription description={text} oneLine/>,
    },
    {
      title: 'Tổng mức đầu tư (VNĐ)',
      dataIndex: 'tongmuc_dautu',
      key: 'tongmuc_dautu',
      width: 150,
      render: (text) => text ? text.toLocaleString() : 'N/A',
    },
    {
      title: 'Ngày công khai',
      dataIndex: 'publicDate',
      key: 'publicDate',
      width: 150,
      render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Ngày đóng thầu',
      dataIndex: 'bidCloseDate',
      key: 'bidCloseDate',
      width: 150,
      render: (text) => text ? new Date(text).toLocaleDateString() : 'N/A',
    },
    {
      title: 'Tên gói thầu',
      dataIndex: 'bidNamePlanNew',
      key: 'bidNamePlanNew',
      width: 300,
      render: (bidNames) => {
        if (!Array.isArray(bidNames) || bidNames.length === 0) return 'N/A';
        return bidNames.map((bid, index) => (
          <div key={index}>{bid.name}</div>
        ));
      },
    },
    // {
    //   title: 'Tỉnh/Thành phố',
    //   dataIndex: 'ProvinceID',
    //   key: 'ProvinceID',
    //   width: 150,
    //   render: (provinces) => {
    //     if (!Array.isArray(provinces) || provinces.length === 0) return 'N/A';
    //     return provinces.map((province) => province.provinceName).join(', ');
    //   },
    // },
  ];