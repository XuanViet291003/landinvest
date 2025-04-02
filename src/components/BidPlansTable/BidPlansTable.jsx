// src/pages/BidPlans/BidPlansTable.jsx
import { ConfigProvider, Table, Modal } from 'antd';  
import React, { memo, useEffect, useState } from 'react';
import { columns } from '../../pages/BidPlans/components/BidPlansColumns';
import BidPlansDetail from '../../pages/BidPlans/components/BidPlansDetail'; 

const BidPlansTable = ({ data }) => {
    const [selectedRecord, setSelectedRecord] = useState(null);
  
    const handleViewDetail = (record) => {
      setSelectedRecord(record);
    };
  
    const handleCloseDetail = () => {
      setSelectedRecord(null);
    };
  
    const dataSource = Array.isArray(data)
      ? data.map((item, index) => ({
          key: item.id,
          STT: index + 1,
          onViewDetail: handleViewDetail,
          projectName: item.projectName,
          chudautu: item.chudautu,
          dotbien_hatang: item.dotbien_hatang,
          tongmuc_dautu: item.tongmuc_dautu,
          publicDate: item.publicDate,
          bidCloseDate: item.bidCloseDate,
          bidNamePlanNew: item.bidNamePlanNew,
          ProvinceID: item.ProvinceID.rovinceName,
          DistrictID: item.DistrictID.districtName,
          link_muasamcong: item.link_muasamcong,
        }))
      : [];
  
    return (
      <div>
        <Table
          columns={columns}
          dataSource={dataSource}
          scroll={{ x: 1500 }}
          pagination={{ pageSize: 10 }}
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
  
  export default BidPlansTable;