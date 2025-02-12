import React from "react";
import "../DetailInvestor/DetailInvestor.scss";

const InfoTable = ({ title, data }) => {
  return (
    <div className="info-table">
      <h2>{title}</h2>
      <table>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td className="label">{item.label}</td>
              <td className="value">{item.value || ""}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfoTable;
