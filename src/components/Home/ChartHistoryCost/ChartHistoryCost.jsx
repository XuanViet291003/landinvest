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

const ChartCostHistory = (props) => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const { lat, lon } = props;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.quyhoach.xyz/get_lich_su_gia_dat/${lat}/${lon}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        // Lọc các area trùng nhau 
        const uniqueData = result.lich_su_gia
          .filter(
            (item, index, self) =>
              index === self.findIndex((i) => i.area === item.area)
          )
        setData(uniqueData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [lat, lon]);

  useEffect(() => {
    if (data) {
      const selectedLocation = data[selectedTab];
      if (selectedLocation && selectedLocation.list_gia) {
        const proData = selectedLocation.list_gia.map((item) => ({
          ...item,
          month: item.month ?? new Date(item.endDate).getMonth() + 1, 
          year: item.year ?? new Date(item.endDate).getFullYear(), 
          monthYear: `${item.month ?? new Date(item.endDate).getMonth() + 1}/${item.year ?? new Date(item.endDate).getFullYear()}`
        })).sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
        setProcessedData(proData);
      }
    }
  }, [data, selectedTab]);

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

        {(data || processedData) ? (
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
                    onClick={() => setSelectedTab(index)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      backgroundColor: index === selectedTab ? "#00BFFF" : "#fff",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      color: index === selectedTab ? "#fff" : "#00BFFF"
                    }}
                  >
                    {`Area: ${location.area}`}
                  </button>
                </div>
              ))}
            </div>

            <ResponsiveContainer width="100%" height={400}>
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