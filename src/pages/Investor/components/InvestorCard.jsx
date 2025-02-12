import { Link } from "react-router-dom";
import "../Investor.scss";

const InvestorCard = (props) => {
  const { data } = props;

  return (
    <div className="investor-card">
      <div className="header">
        <span className="taxCode">{data?.orgCode}</span>
        <span className={`status ${(data && data?.statusOrg && data.statusOrg === "1") ? "active" : "inactive"}`}>
          {(data && data?.statusOrg && data.statusOrg === "1") ? "Đang hoạt động" : "Không hoạt động"}
        </span>
      </div>
      <Link to={`/investor/${data?.orgCode}`} className="title">
        {data?.orgFullName.trim()}
      </Link>
      <div className="details">
        <div>
          <span className="label">Mã số thuế</span>
          <p>{data?.taxCode}</p>
        </div>
        <div className="address">
          <span className="label">Địa chỉ</span>
          <p>{data?.officeAdd}</p>
        </div>
        <div>
          <span className="label">Ngày phê duyệt</span>
          <p>{data?.taxDateTime ? data?.taxDateTime : "N/A"}</p>
        </div>
      </div>
    </div>
  );
};

export default InvestorCard;