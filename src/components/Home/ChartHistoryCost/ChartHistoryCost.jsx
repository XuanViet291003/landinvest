import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import { useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { getLocationInBoudingBox } from "../../../services/api";
import './ChartHistoryCost.scss';
import { useDispatch, useSelector } from "react-redux";

const ChartCostHistory = (props) => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [diaChi, setDiaChi] = useState("");
  const [hoveredTab, setHoveredTab] = useState(null);

  const [isClose, setIsClose] = useState(false);

  const { lat, lon } = props;

  // Lấy dữ liệu từ API
  useEffect(() => {
    setIsClose(false);
    if (searchParams.get("type") && processedData) {
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("type");
      setSearchParams(newParams);
    }

    setProcessedData(null);
    setDiaChi("");

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.quyhoach.xyz/get_lich_su_gia_dat/${lat}/${lon}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // Lọc các type trùng nhau (không phân biệt chữ hoa chữ thường)
        const uniqueData = result.lich_su_gia.filter(
          (item, index, self) =>
            index === self.findIndex(
              (i) =>
                i.type.trim().toLowerCase() ===
                item.type.trim().toLowerCase()
            )
        );
        setData(uniqueData);

        // Lấy thông tin địa chỉ
        const res = await getLocationInBoudingBox(lat, lon);
        if (res?.quyhoach?.length > 0) {
          setDiaChi(res.diachi || "Không xác định");
        } else {
          setDiaChi("Không có dữ liệu quy hoạch.");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [lat, lon]);

  // Đồng bộ selectedTab với query param khi có data
  useEffect(() => {
    if (data) {
      const typeFromUrl = searchParams.get("type");
      if (typeFromUrl) {
        const index = data.findIndex(
          (item) =>
            item.type.trim().toLowerCase() ===
            typeFromUrl.trim().toLowerCase()
        );
        if (index !== -1) {
          setSelectedTab(index);
        }
      }
    }
  }, [data, searchParams]);

  // Xử lý dữ liệu của tab được chọn
  useEffect(() => {
    if (data) {
      const selectedLocation = data[selectedTab];
      if (selectedLocation && selectedLocation.list_gia) {
        const proData = selectedLocation.list_gia
          .map((item) => ({
            ...item,
            month: item.month ?? new Date(item.endDate).getMonth() + 1,
            year: item.year ?? new Date(item.endDate).getFullYear(),
            monthYear: `${item.month ?? new Date(item.endDate).getMonth() + 1}/${item.year ?? new Date(item.endDate).getFullYear()
              }`,
          }))
          .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        setProcessedData(proData);
      }
    }
  }, [data, selectedTab]);

  // Hàm xử lý khi chuyển tab, đồng thời cập nhật query param
  const handleTabChange = (index) => {
    setSelectedTab(index);
    if (data && data[index]) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("type", data[index].type.trim().toLowerCase());
      setSearchParams(newParams);
    }
  };

  const handleClose = () => {
    setIsClose(true);
  };

  return (
    <>
      {!isClose && (
        <Container>
          <div className="history-cost-container">
            <div className="close-btn" onClick={handleClose} title="Đóng">
              X
            </div>

            <div className="address-box">
              <div className="address-text">
                <strong>Địa chỉ:</strong> {diaChi}
              </div>
            </div>

            {data && processedData ? (
              <>
                <div className="tabs-container">
                  {data.map((item, index) => (
                    <div key={index} className="tab-item">
                      <button
                        className={`tab-btn ${index === selectedTab ? "active" : ""
                          }`}
                        onClick={() => handleTabChange(index)}
                        onMouseEnter={() => setHoveredTab(index)}
                        onMouseLeave={() => setHoveredTab(null)}
                      >
                        {item.type.trim()}
                      </button>
                      {hoveredTab === index && (
                        <div className="tab-popup">
                          {item.image_links && (
                            <img
                              src={item.image_links.split(",")[0]}
                              alt="Preview"
                            />
                          )}
                          <p>{item.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={processedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="monthYear" />
                    <YAxis domain={([min, max]) => [min - 5, max + 10]} />
                    <Tooltip
                      formatter={(value, name, props) => [
                        `${value} tỉ/m²`,
                        name,
                      ]}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="max"
                      stroke="#FF0000"
                      name="Giá cao nhất"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="avg"
                      stroke="#00BFFF"
                      name="Giá phổ biến"
                      strokeWidth={2}
                    />
                    <Line
                      type="monotone"
                      dataKey="min"
                      stroke="#008000"
                      name="Giá thấp nhất"
                      strokeWidth={2}
                    />
                    <Brush
                      dataKey="monthYear"
                      height={30}
                      stroke="#8884d8"
                      travellerWidth={10}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </>
            ) : (
              <h2 className="loading">Loading...</h2>
            )}
          </div>
        </Container>
      )}
    </>
  );
};

export default ChartCostHistory;