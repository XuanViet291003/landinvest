import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./EstatePricePopUp.scss";

const EstatePricePopUp = ({ estatePrice }) => {
  const itemsPerPage = 10;
  const [searchParams, setSearchParams] = useSearchParams();

  const estateType = searchParams.get("estate-price");
  const tabs = ["Tất cả", ...new Set(estatePrice.lich_su_gia.map((item) => item.type))];

  const slugify = (text) =>
    text
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

  const [selectedTab, setSelectedTab] = useState(
    estateType ? tabs.findIndex((tab) => slugify(tab) === estateType) : 0
  );
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (estateType) {
      const index = tabs.findIndex((tab) => slugify(tab) === estateType);
      setSelectedTab(index !== -1 ? index : 0);
    }
  }, [estateType]);

  const filteredData =
    selectedTab === 0
      ? estatePrice.lich_su_gia
      : estatePrice.lich_su_gia.filter(
          (item) => slugify(item.type) === slugify(tabs[selectedTab])
        );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleTabChange = (index) => {
    setSelectedTab(index);
    setCurrentPage(1);

    const newParams = new URLSearchParams(searchParams);
    if (index === 0) {
      searchParams.set("estate-price", "tat-ca");
    } else {
      newParams.set("estate-price", slugify(tabs[index]));
    }
    setSearchParams(newParams);
  };

  const handleClose = () => {
    searchParams.delete("estate-price");
    setSearchParams(searchParams);
  };

  return (
    estateType && (
      <div className="estate-price-container">
        <div className="close-btn" onClick={handleClose} title="Đóng">X</div>
        <div className="address-box">
          <div className="address-text">
            <strong>Địa chỉ:</strong> {estatePrice.diachi}
          </div>
        </div>

        {tabs.length > 0 && (
          <div className="tabs-container">
            {tabs.map((item, index) => (
              <div key={index} className="tab-item">
                <button
                  className={`tab-btn ${index === selectedTab ? "active" : ""}`}
                  onClick={() => handleTabChange(index)}
                >
                  {item.trim()}
                </button>
              </div>
            ))}
          </div>
        )}

        {currentData.length > 0 ? (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Mô tả</th>
                  <th>Diện tích (m²)</th>
                  <th>Giá (tỉ vnđ)</th>
                  <th>Loại</th>
                  <th>Người đăng</th>
                  <th>Link</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr key={index}>
                    <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                    <td>{item.description}</td>
                    <td>{item.area}</td>
                    <td>{item.price ? (item.price / 1000000000) + " tỉ" : "N/A"}</td>
                    <td>{item.type}</td>
                    <td>{item.poster}</td>
                    <td>
                      <a href={item.url} target="_blank" rel="noopener noreferrer">Xem</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <ul className="pagination">
                <li>
                  <button
                    style={{ fontSize: "12px" }}
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    «
                  </button>
                </li>
                {[...Array(totalPages).keys()].map((page) => (
                  <li key={page}>
                    <button
                      style={{ fontSize: "12px" }}
                      className={currentPage === page + 1 ? "active" : ""}
                      onClick={() => setCurrentPage(page + 1)}
                    >
                      {page + 1}
                    </button>
                  </li>
                ))}
                <li>
                  <button
                    style={{ fontSize: "12px" }}
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    »
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <h1 className="loading">Không có dữ liệu</h1>
        )}
      </div>
    )
  );
};

export default EstatePricePopUp;