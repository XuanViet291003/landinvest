import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";

import "./Investor.scss";
import InvestorCard from "./components/InvestorCard";

const Investor = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  // Lấy trang hiện tại từ URL query (nếu không có thì mặc định là 1)
  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.quyhoach.xyz/list_nhadautu?page=${currentPage}`);
        const result = await response.json();
        setData(result.data);
        if (result.page_numer) {
          setTotalPages(Math.ceil(result.page_numer));
        }
      } catch (err) {
        console.log(err.message);
      }
    };

    fetchData();
  }, [currentPage]);

  // Hàm bắt sự kiện click vào trang
  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setData([]);
      setSearchParams({ page: page.toString() });
    }
  };

  // Hàm tạo danh sách số trang 
  const renderPagination = () => {
    let pages = [];
    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage > 3) {
      pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push("...");
    }

    return pages;
  };

  return (
    <Container>
      <div className="investor-container">
        {data.length > 0 && <h3 className="head-title">Danh sách nhà đầu tư được phê duyệt</h3>}

        {data.length > 0 ? (
          data.map((item, index) => <InvestorCard key={index} data={item} />)
        ) : (
          <p>Không có dữ liệu</p>
        )}

        {data.length > 0 && (
          <ul className="pagination">
            <li>
              <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                «
              </button>
            </li>

            <li>
              <button className={currentPage === 1 ? "active" : ""} onClick={() => handlePageChange(1)}>
                1
              </button>
            </li>

            {renderPagination().map((page, index) =>
              page === "..." ? (
                <li key={index} className="dots">...</li>
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

            {totalPages > 1 && (
              <li>
                <button
                  className={currentPage === totalPages ? "active" : ""}
                  onClick={() => handlePageChange(totalPages)}
                >
                  {totalPages}
                </button>
              </li>
            )}

            <li>
              <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                »
              </button>
            </li>
          </ul>
        )}
      </div>
    </Container>
  );
};

export default Investor;