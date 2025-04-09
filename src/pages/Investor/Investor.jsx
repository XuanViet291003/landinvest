import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import './Investor.scss';
import InvestorCard from './components/InvestorCard';
import { Input, Spin } from 'antd';
import { getListSearchInvestor } from '../../services/api';
const { Search } = Input;
const Investor = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isSearch, setIsSearch] = useState(false);
    const [keySearch, setKeySearch] = useState('');
    const onSearch = async (e) => {
        setIsSearch(true);
        if (currentPage !== 1) {
            setCurrentPage(1);
            return;
        }
        setCurrentPage(1);
        setLoading(true);
        try {
            if (e.trim() == '') {
                const response = await fetch(`https://landinvest.thinkdiff.us/list_nhadautu?page=${1}`);
                const result = await response.json();
                setData(result.data);
                setTotalPages(Math.ceil(result.page_numer));
                setLoading(false);
                return;
            }
            const res = await getListSearchInvestor(e);
            setData(res.data);
            if (res) {
                setTotalPages(Math.ceil(res.page_numer));
            }
        } catch (e) {
            console.log(e);
        }
        setLoading(false);
    };
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let result;
                if (!isSearch) {
                    const response = await fetch(`https://landinvest.thinkdiff.us/list_nhadautu?page=${currentPage}`);
                    result = await response.json();
                    setData(result.data);
                } else {
                    const res = await getListSearchInvestor(keySearch, currentPage);
                    // console.log(res);
                    result = res.data;
                    setData(result);
                }
                if (result.page_numer) {
                    setTotalPages(Math.ceil(result.page_numer));
                }
            } catch (err) {
                console.log(err.message);
            }
            setLoading(false);
        };
        fetchData();
    }, [currentPage]);

    // Hàm bắt sự kiện click vào trang
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Hàm tạo danh sách số trang
    const renderPagination = () => {
        let pages = [];
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage > 3) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (currentPage < totalPages - 2) {
            pages.push('...');
        }

        return pages;
    };

    return (
        <Container>
            <Spin size="large" spinning={loading}>
                <div className="investor-container">
                    <h3 className="head-title">Danh sách nhà đầu tư được phê duyệt</h3>
                    <Search
                        loading={loading}
                        placeholder="Tìm kiếm"
                        size="large"
                        onSearch={onSearch}
                        onChange={(e) => {
                            setKeySearch(e.target.value);
                        }}
                        enterButton
                        style={{ width: '300px' }}
                    />

                    {data.map((item, index) => (
                        <InvestorCard key={index} data={item} />
                    ))}
                    <ul className="pagination">
                        <li>
                            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                «
                            </button>
                        </li>

                        <li>
                            <button className={currentPage === 1 ? 'active' : ''} onClick={() => handlePageChange(1)}>
                                1
                            </button>
                        </li>

                        {renderPagination().map((page, index) =>
                            page === '...' ? (
                                <li key={index} className="dots">
                                    ...
                                </li>
                            ) : (
                                <li key={index}>
                                    <button
                                        className={currentPage === page ? 'active' : ''}
                                        onClick={() => handlePageChange(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ),
                        )}

                        {totalPages > 1 && (
                            <li>
                                <button
                                    className={currentPage === totalPages ? 'active' : ''}
                                    onClick={() => handlePageChange(totalPages)}
                                >
                                    {totalPages}
                                </button>
                            </li>
                        )}

                        <li>
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                »
                            </button>
                        </li>
                    </ul>
                </div>
            </Spin>
        </Container>
    );
};

export default Investor;
