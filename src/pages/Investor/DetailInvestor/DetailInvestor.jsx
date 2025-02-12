import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";

import "./DetailInvestor.scss";
import { useNavigate, useParams } from "react-router-dom";
import InfoTable from "../components/InfoTable";

const DetailInvestor = () => {
  const { orgCode } = useParams();

  const navigate = useNavigate();

  const [data, setData] = useState({
    generalInfo: [],
    addressInfo: [],
    legalRepresentative: [],
    businessInfo: [],
    businessRegistration: [],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.quyhoach.xyz/list_nhadautu?page=1");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();

        const investor = result?.data?.find(item => item.orgCode === orgCode);

        if(investor.taxNation === "VN"){
          investor.taxNation.replace("VN", "Việt Nam");
        }

        setData({
          generalInfo: [
            { label: "Tên đơn vị (đầy đủ)", value: investor.orgFullName },
            { label: "Tên đơn vị (tiếng Anh)", value: investor.orgEnName },
            { label: "Mã định danh", value: investor.orgCode },
            { label: "Loại hình pháp lý", value: investor.businessType },
            { label: "Mã số thuế", value: investor.taxCode },
            { label: "Ngày cấp", value: investor.taxDateTime },
            { label: "Quốc gia cấp", value: investor.taxNation },
          ],
          addressInfo: [
            { label: "Số nhà, đường phố", value: investor.officeAdd },
            { label: "Web", value: investor.officeWeb },
            { label: "Số điện thoại", value: investor.officePhone },
          ],
          legalRepresentative: [
            { label: "Họ và tên", value: investor.repName },
            { label: "Chức vụ", value: investor.repPosition },
          ],
          businessInfo: [
            { label: "Điều lệ hoạt động của DN", value: "" },
            { label: "Sơ đồ tổ chức", value: "" },
            { label: "Số nhân viên", value: "" },
            { label: "Lĩnh vực tham gia", value: investor.businessType },
            { label: "Quy mô doanh nghiệp", value: "" },
          ],
          businessRegistration: [
            { label: "Số đăng kí kinh doanh", value: investor.decNo },
            { label: "Ngày cấp", value: "" },
            { label: "Quốc gia cấp", value: "" },
          ],
        });        
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <button 
        className="administrative-detail__back-button" 
        onClick={() => navigate(`/investor`)} 
        style={{ marginTop: "15px" }}>
        ← Quay Lại
      </button>
      {data && (
        <div className="detailInvestor-container">
          <h4 className="head-title">{data.generalInfo?.[0]?.value}</h4>
          {data?.generalInfo?.length > 0 && <InfoTable title="Thông tin chung" data={data.generalInfo} />}
          {data?.establishmentInfo?.length > 0 && <InfoTable title="Quyết định thành lập" data={data.establishmentInfo} />}
          {data?.addressInfo?.length > 0 && <InfoTable title="Địa chỉ trụ sở" data={data.addressInfo} />}
          {data?.legalRepresentative?.length > 0 && <InfoTable title="Người đại diện pháp luật" data={data.legalRepresentative} />}
          {data?.businessRegistration?.length > 0 && <InfoTable title="Đăng kí kinh doanh" data={data.businessRegistration} />}
          {data?.businessInfo?.length > 0 && <InfoTable title="Thông tin hoạt động" data={data.businessInfo} />}
        </div>
      )}
    </Container>
  );
};

export default DetailInvestor;