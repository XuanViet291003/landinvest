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

const ChartCostHistory = (props) => {
  const [data, setData] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [processedData, setProcessedData] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [diaChi, setDiaChi] = useState("");
  const [hoveredTab, setHoveredTab] = useState(null);
  const [timeFilter, setTimeFilter] = useState("month");

  const { lat, lon } = props;

  useEffect(() => {
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

        const uniqueData = result.lich_su_gia.filter(
          (item, index, self) =>
            index === self.findIndex(
              (i) =>
                i.type.trim().toLowerCase() ===
                item.type.trim().toLowerCase()
            )
        );
        setData(uniqueData);

        const res = await getLocationInBoudingBox(lat, lon);
        if (res?.diachi) {
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

  useEffect(() => {
    if (data) {
      console.log(data)
      const selectedLocation = data[selectedTab];
      if (selectedLocation && selectedLocation.list_gia) {
        let proData = selectedLocation.list_gia.map((item) => ({
          ...item,
          month: item.month ?? new Date(item.endDate).getMonth() + 1,
          year: item.year ?? new Date(item.endDate).getFullYear(),
          monthYear: `${item.month ?? new Date(item.endDate).getMonth() + 1}/${item.year ?? new Date(item.endDate).getFullYear()}`,
        }));

        if (timeFilter === "quarter") {
          proData = proData.reduce((acc, curr) => {
            const quarter = Math.ceil(curr.month / 3);
            const key = `${quarter}/${curr.year}`;
            if (!acc[key] || curr.max > acc[key].max) {
              acc[key] = { ...curr, monthYear: key };
            }
            return acc;
          }, {});
          proData = Object.values(proData);
        } else if (timeFilter === "year") {
          proData = proData.reduce((acc, curr) => {
            const key = `${curr.year}`;
            if (!acc[key] || curr.max > acc[key].max) {
              acc[key] = { ...curr, monthYear: key };
            }
            return acc;
          }, {});
          proData = Object.values(proData);
        }

        setProcessedData(proData.sort((a, b) => new Date(a.endDate) - new Date(b.endDate)));
      }
    }
  }, [data, selectedTab, timeFilter]);

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
      <div className="history-cost-container">
        <div className="close-btn" onClick={handleClose} title="Đóng">X</div>
        <div className="address-box">
          <div className="address-text">
            <strong>Địa chỉ:</strong> {diaChi}
          </div>
        </div>

        {data ? (
          data.length > 0 ? (
            <>
              <select onChange={(e) => setTimeFilter(e.target.value)}>
                <option value="month">Tháng/Năm</option>
                <option value="quarter">Quý/Năm</option>
                <option value="year">Năm</option>
              </select>

              <div className="tabs-container">
                {data?.map((item, index) => (
                  <div key={index} className="tab-item">
                    <button
                      className={`tab-btn ${index === selectedTab ? "active" : ""}`}
                      onClick={() => handleTabChange(index)}
                      onMouseEnter={() => setHoveredTab(index)}
                      onMouseLeave={() => setHoveredTab(null)}
                    >
                      {item.type.trim()}
                    </button>
                    {hoveredTab === index && (
                      <div className="tab-popup">
                        {item.image_links && (
                          <img src={item.image_links.split(",")[0]} alt="Preview" />
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
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="max" stroke="#FF0000" name="Giá cao nhất" />
                  <Line type="monotone" dataKey="avg" stroke="#00BFFF" name="Giá phổ biến" />
                  <Line type="monotone" dataKey="min" stroke="#008000" name="Giá thấp nhất" />
                </LineChart>
              </ResponsiveContainer>
            </>
          ) : (
            <h1 className="loading">Không có dữ liệu</h1>
          )
        ) : <h1 className="loading">Loading...</h1>}
      </div>
    </Container>
  );
};

export default ChartCostHistory;