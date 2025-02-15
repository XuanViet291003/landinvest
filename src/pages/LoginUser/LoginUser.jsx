import React, { useState, useEffect } from "react";
import "./LoginUser.scss";

const API_ENDPOINTS = {
  today: "https://api.quyhoach.xyz/show_all_user_active_user_activity_today",
  activeToday: "https://api.quyhoach.xyz/show_active_user_activity_today?page=",
  activeTotal: "https://api.quyhoach.xyz/show_active_user_activity?page=",
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

  // Chuyển đổi sang chuỗi ngày giờ theo định dạng tiếng Việt
  return date.toLocaleString('vi-VN', options);
}

const LoginUserPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(0);
  const [activeTab, setActiveTab] = useState("today");

  // Lần đầu truy cập trang, lấy data loginUserToday đổ ra
  useEffect(() => {
    fetchData("today");
  }, []);

  // Hàm lọc dữ liệu có ipLocation trùng nhau và thêm trường count tăng dần theo số lần xuất hiện bản ghi
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

  // Hàm để fetch tất cả các trang của api userToday và userAll
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

  // Hàm lấy dữ liệu tương ứng với tab nguwoif dùng chọn
  const fetchData = async (key) => {
    setLoading(true);
    setActiveTab(key);

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

  return (
    <div className="loginUser-container">
      <h1>Quản lý người truy cập</h1>
      <div className="buttons">
        <button className={activeTab === "today" ? "active" : ""} onClick={() => fetchData("today")}>
          Người truy cập hôm nay ({count})
        </button>
        <button className={activeTab === "activeToday" ? "active" : ""} onClick={() => fetchData("activeToday")}>
          Số lần truy cập hôm nay
        </button>
        <button className={activeTab === "activeTotal" ? "active" : ""} onClick={() => fetchData("activeTotal")}>
          Số lần truy cập tổng 
        </button>
      </div>
      {loading && <p>Đang tải dữ liệu...</p>}
      <div className="data-container">
        {activeTab === "today" ? (
          data.map((item, index) => (
            <div key={index} className="data-card">
              <p><strong>Thành phố:</strong> {item.city}</p>
              <p><strong>Thời gian:</strong> {convertToVietnamTime(item.date_visit)}</p>
              <p><strong>Thiết bị:</strong> {item.device_active}</p>
              <p><strong>Hệ điều hành:</strong> {item.he_dieu_hanh}</p>
              <p><strong>IP:</strong> {item.iplocation}</p>
            </div>
          ))
        ) : (
          data.map((item, index) => (
            <div key={index} className="data-card">
              <p><strong>Thành phố:</strong> {item.details?.city}</p>
              <p><strong>Truy cập gần nhất:</strong> {convertToVietnamTime(item.details?.date_visit)}</p>
              <p><strong>Thiết bị:</strong> {item.details?.device_active}</p>
              <p><strong>Hệ điều hành:</strong> {item.details?.he_dieu_hanh}</p>
              <p><strong>IP:</strong> {item.details?.iplocation}</p>
              <p><strong>Số lần truy cập:</strong> {item.count}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LoginUserPage;