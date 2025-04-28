import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import "./LoginUser.scss";

const API_ENDPOINTS = {
  today: "https://landinvest.thinkdiff.us//show_all_user_active_user_activity_today",
  activeToday: "https://landinvest.thinkdiff.us/show_active_user_activity_today?page=",
  activeTotal: "https://landinvest.thinkdiff.us//show_active_user_activity?page=",
};

// Hàm chuyển đổi giờ sang giờ Việt Nam
const convertToVietnamTime = (gmtString) => {
  let date = new Date(gmtString);
  let options = {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Asia/Ho_Chi_Minh'
  };
  return date.toLocaleString('vi-VN', options);
}

const LoginUserPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // Lấy trang hiện tại từ URL (mặc định là 1 nếu không có)
  const currentPage = parseInt(searchParams.get("page")) || 1;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0); // Dùng cho tab "today"
  const [activeTab, setActiveTab] = useState("today");

  // Các state lưu tổng số lượt truy cập lũy kế cho tab activeToday và activeTotal
  const [totalVisitsToday, setTotalVisitsToday] = useState(0);
  const [totalVisitsAll, setTotalVisitsAll] = useState(0);

  // Số bản ghi mỗi trang
  const recordsPerPage = 12;

  // Lần đầu truy cập trang, lấy dữ liệu cho tab "today" (và reset trang về 1)
  useEffect(() => {
    fetchData("today");
  }, []);

  // Khi trang load, tính tổng lượt truy cập cho activeToday và activeTotal
  useEffect(() => {
    fetchTotalVisits("activeToday");
    fetchTotalVisits("activeTotal");
  }, []);

  // Hàm lọc dữ liệu có ipLocation trùng nhau và thêm trường count tăng dần theo số lần xuất hiện
  const processUserActivity = (items) => {
    const userActivityMap = new Map();
    items.forEach((item) => {
      if (!userActivityMap.has(item.iplocation)) {
        userActivityMap.set(item.iplocation, { count: 1, details: item });
      } else {
        userActivityMap.get(item.iplocation).count += 1;
      }
    });
    return Array.from(userActivityMap.values());
  };

  // Hàm fetch tất cả các trang của API activeToday và activeTotal
  const fetchAllPages = async (baseUrl) => {
    let allData = [];
    let page = 1;
    let totalPages = 1;
    try {
      const initialResponse = await fetch(`${baseUrl}1`);
      const initialResult = await initialResponse.json();
      totalPages = Math.ceil(initialResult.page_numer);
      allData = [...initialResult.data];

      for (page = 2; page <= totalPages; page++) {
        const response = await fetch(`${baseUrl}${page}`);
        const result = await response.json();
        allData = [...allData, ...result.data];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    return allData;
  };

  // Hàm lấy dữ liệu theo tab được chọn và reset trang về 1
  const fetchData = async (key) => {
    setLoading(true);
    setActiveTab(key);
    setSearchParams({ page: "1" });
    
    try {
      if (key === "today") {
        const response = await fetch(API_ENDPOINTS[key]);
        const result = await response.json();
        setData(result.data || []);
        setCount(result.tong_phan_tu || 0);
      } else {
        const activityData = await fetchAllPages(API_ENDPOINTS[key]);
        const filteredData = processUserActivity(activityData);
        setData(filteredData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    setLoading(false);
  };

  // Hàm tính tổng lượt truy cập cho activeToday và activeTotal 
  const fetchTotalVisits = async (key) => {
    try {
      const activityData = await fetchAllPages(API_ENDPOINTS[key]);
      const filteredData = processUserActivity(activityData);
      const total = filteredData.reduce((acc, item) => acc + item.count, 0);
      if (key === "activeToday") {
        setTotalVisitsToday(total);
      } else if (key === "activeTotal") {
        setTotalVisitsAll(total);
      }
    } catch (error) {
      console.error("Error fetching total visits:", error);
    }
  };

  // Tính toán dữ liệu hiển thị trên trang hiện tại
  const totalPagesCalc = Math.ceil(data.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = data.slice(indexOfFirstRecord, indexOfLastRecord);

  // Hàm xử lý chuyển trang (dựa trên URL query)
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPagesCalc) {
      setSearchParams({ page: page.toString() });
    }
  };

  // Hàm render số trang (1, ... , n)
  const renderPaginationNumbers = () => {
    let pages = [];
    if (totalPagesCalc <= 5) {
      for (let i = 1; i <= totalPagesCalc; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPagesCalc - 1, currentPage + 1);

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPagesCalc - 1) {
        pages.push("...");
      }
      pages.push(totalPagesCalc);
    }
    return pages;
  };

  return (
    <div className="loginUser-container">
      <h1>Quản lý người truy cập</h1>
      <div className="buttons">
        <button
          className={activeTab === "today" ? "active" : ""}
          onClick={() => fetchData("today")}
        >
          Người truy cập hôm nay ({count})
        </button>
        <button
          className={activeTab === "activeToday" ? "active" : ""}
          onClick={() => fetchData("activeToday")}
        >
          Số lần truy cập hôm nay ({totalVisitsToday})
        </button>
        <button
          className={activeTab === "activeTotal" ? "active" : ""}
          onClick={() => fetchData("activeTotal")}
        >
          Số lần truy cập tổng ({totalVisitsAll})
        </button>
      </div>
      {loading && <p>Đang tải dữ liệu...</p>}
      <div className="data-container">
        {activeTab === "today" ? (
          currentRecords.map((item, index) => (
            <div key={index} className="data-card">
              <p><strong>Thành phố:</strong> {item.city}</p>
              <p><strong>Thời gian:</strong> {convertToVietnamTime(item.date_visit)}</p>
              <p><strong>Thiết bị:</strong> {item.device_active}</p>
              <p><strong>Hệ điều hành:</strong> {item.he_dieu_hanh}</p>
              <p><strong>IP:</strong> {item.iplocation}</p>
            </div>
          ))
        ) : (
          currentRecords.map((item, index) => (
            <div key={index} className="data-card">
              <p><strong>Thành phố:</strong> {item.details?.city}</p>
              <p><strong>Truy cập gần nhất:</strong> {convertToVietnamTime(item.details?.date_visit)}</p>
              <p><strong>Thiết bị:</strong> {item.details?.device_active}</p>
              <p><strong>Hệ điều hành:</strong> {item.details?.he_dieu_hanh}</p>
              <p><strong>IP:</strong> {item.details?.iplocation}</p>
              <p className="data-card__active-count" style={{ color: "darkgreen" }}>
                <strong>Số lần truy cập:</strong> {item.count}
              </p>
            </div>
          ))
        )}
      </div>
      {data.length > 0 && totalPagesCalc > 1 && (
        <ul className="pagination">
          <li>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              «
            </button>
          </li>
          {renderPaginationNumbers().map((page, index) =>
            page === "..." ? (
              <li key={index} className="dots">
                ...
              </li>
            ) : (
              <li key={index}>
                <button
                  className={currentPage === page ? "active" : ""}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              </li>
            )
          )}
          <li>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPagesCalc}
            >
              »
            </button>
          </li>
        </ul>
      )}
    </div>
  );
};

export default LoginUserPage;