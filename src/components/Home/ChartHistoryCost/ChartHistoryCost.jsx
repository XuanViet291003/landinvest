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
  Brush
} from "recharts";
import { useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import { getLocationInBoudingBox } from "../../../services/api";

const ChartCostHistory = (props) => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [diaChi, setDiaChi] = useState("");

  const { lat, lon } = props;

  // Lấy dữ liệu từ API
  useEffect(() => {
    const fetchData = async () => {
      if (searchParams.get("type") && processedData) {
        const newParams = new URLSearchParams(searchParams);
        newParams.delete("type");
        setSearchParams(newParams);
      }

      setProcessedData(null);
      setDiaChi("");

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
            index === self.findIndex((i) => i.type.trim().toLowerCase() === item.type.trim().toLowerCase())
        );
        setData(uniqueData);

        // Lấy thông tin địa chỉ
        const res = await getLocationInBoudingBox(lat, lon);
        if (res?.quyhoach?.length > 0) {
          setDiaChi(res.diachi || 'Không xác định');
        } else {
          setDiaChi('Không có dữ liệu quy hoạch.');
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
          (item) => item.type.trim().toLowerCase() === typeFromUrl.trim().toLowerCase()
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
            monthYear: `${item.month ?? new Date(item.endDate).getMonth() + 1}/${item.year ?? new Date(item.endDate).getFullYear()}`
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
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("ups");
    setSearchParams(newParams);
  };

  return (
    <Container>
      <div
        style={{
          position: "fixed",
          top: "65px",
          right: "100px",
          width: "60%",
          backgroundColor: "#1F252A",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          padding: "16px",
          borderRadius: "8px",
          zIndex: 1000,
          color: "#fff",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            color: "#FF0000",
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "18px",
            lineHeight: "1"
          }}
          onClick={handleClose}
          title="Đóng"
        >
          X
        </div>

        <div style={{
          margin: "15px",
          padding: "12px",
          backgroundColor: "#2C333A",
          borderRadius: "8px",
          fontSize: "16px",
          lineHeight: "1.5"
        }}>
          <div>
            <strong>Địa chỉ:</strong> {diaChi}
          </div>
        </div>

        {(data && processedData) ? (
          <>
            <div
              style={{
                margin: "16px 62px",
                display: "flex",
                gap: "8px",
                overflowX: "auto",
                paddingBottom: "8px"
              }}
            >
              {data.map((location, index) => (
                <div key={index}>
                  <button
                    onClick={() => handleTabChange(index)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor: index === selectedTab ? "#00BFFF" : "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      color: index === selectedTab ? "#fff" : "#00BFFF"
                    }}
                  >
                    {location.type.trim()}
                  </button>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="monthYear" />
                <YAxis domain={([min, max]) => [min - 5, max + 10]} />
                <Tooltip />
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
          <h2 style={{ color: "white" }}>Loading...</h2>
        )}
      </div>
    </Container>
  );
};

export default ChartCostHistory;