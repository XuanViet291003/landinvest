import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import "./RegionalPriceChart.scss";

function CompactPriceChart(props) {
  const { regionalPrice } = props;
  const [visible, setVisible] = useState(true); 

  useEffect(() => {
    setVisible(true)
  }, [regionalPrice])

  const data = JSON.parse(regionalPrice);

  return (
    <Container>
      {visible && (
        <div className="compact-price-chart">
          <button className="close-btn" onClick={() => setVisible(false)}>×</button>
          <h3>Giá cùng khu vực</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={data} margin={{ left: 20, right: 20, bottom: 60 }}>
              <XAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: "#fff", fontSize: 10 }} 
                angle={-30} 
                textAnchor="end"
              />
              <YAxis type="number" tick={{ fill: "#fff" }} />
              <Tooltip contentStyle={{ backgroundColor: "#333", color: "#fff" }} />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </Container>
  );
}

export default CompactPriceChart;