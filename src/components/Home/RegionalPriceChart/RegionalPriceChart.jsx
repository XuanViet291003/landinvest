import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import "./RegionalPriceChart.scss";

function RegionalPriceChart(props) {
  const { regionalPrice } = props;
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
  }, [regionalPrice]);

  let data;

  if (typeof regionalPrice === "string") {
    try {
      data = JSON.parse(regionalPrice);
    } catch (error) {
      data = regionalPrice;
    }
  } else {
    data = regionalPrice;
  }

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: "#333", color: "#fff", padding: "10px", borderRadius: "5px" }}>
          <span style={{ fontWeight: "bold" }}>{payload[0].payload.name}</span> 
          <br />
          <span style={{ color: "#8884d8", fontWeight: "bold" }}>Giá:</span>{" "}
          <span style={{ color: "#8884d8" }}>{payload[0].value} triệu/m²</span>
        </div>
      );
    }
    return null;
  };

  return (
    <Container>
      {visible && (
        <div className="compact-price-chart">
          <button className="close-btn" onClick={() => setVisible(false)}>×</button>
          <h3>Giá cùng khu vực</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ top: 30, left: 20, right: 20, bottom: 60 }}>
              <XAxis
                dataKey="name"
                type="category"
                tick={{ fill: "#fff", fontSize: 11.5 }}
                angle={-30}
                textAnchor="end"
              />
              <YAxis type="number" tick={{ fill: "#fff" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color ? entry.color : "#8884d8"} />
                ))}
                <LabelList
                  dataKey="value"
                  position="top"
                  fill="#fff"
                  fontSize={12}
                  formatter={(value) => `${value}`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Container>
  );
}

export default RegionalPriceChart;