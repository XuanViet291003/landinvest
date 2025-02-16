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

const ChartCostHistory = (props) => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [processedData, setProcessedData] = useState(null);

  const {lat, lon} = props;

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
        const uniqueData = result.lich_su_gia.filter(
          (item, index, self) =>
            index === self.findIndex((i) => i.area === item.area)
        );
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
          monthYear: `${item.month}/${item.year}`
        }));
        setProcessedData(proData);
      }
    }
  }, [data, selectedTab]);

  return (
    <div
      style={{
        position: "fixed",
        top: "65px",
        right: "100px",
        width: "60%",
        backgroundColor: "white",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
        padding: "16px",
        borderRadius: "8px",
        zIndex: 1000, 
      }}
    >
      {(data || processedData) ? (
        <>
          <div style={{ margin: "16px 62px", display: "flex", gap: "8px" }}>
            {data.map((location, index) => (
              <div>
                <button
                  key={index}
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
              <YAxis domain={[0, 2400]} />
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
      ) : <h2>Loading...</h2>}
    </div>
  );
};

export default ChartCostHistory;