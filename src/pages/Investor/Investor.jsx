import { useEffect, useState } from "react";

const Investor = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.quyhoach.xyz/list_nhadautu?page=1");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const result = await response.json();
        setData(result);
        console.log(result)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* <h1>Danh sách Nhà Đầu Tư</h1>
      {loading && <p>Đang tải...</p>}
      {error && <p>Lỗi: {error}</p>}
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.name}</li>
        ))}
      </ul> */}
    </div>
  );
}

export default Investor;