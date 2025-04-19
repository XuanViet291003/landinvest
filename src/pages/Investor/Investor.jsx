import { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import './Investor.scss';
import instance from '../../utils/axios-customize';
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
    const [error, setError] = useState(null);

    // Cache để lưu trữ dữ liệu API
    const cache = new Map();

    const fetchInvestors = async (page, searchTerm = '') => {
        setLoading(true);
        setError(null);
        try {
            let result;
            const cacheKey = searchTerm ? `search_${searchTerm}_page_${page}` : `list_page_${page}`;

            // Kiểm tra cache
            if (cache.has(cacheKey)) {
                console.log(`Returning cached data for ${cacheKey}`);
                result = cache.get(cacheKey);
            } else {
                if (searchTerm.trim()) {
                    // Gọi API tìm kiếm
                    const res = await getListSearchInvestor(searchTerm, page);
                    result = res;
                } else {
                    // Gọi API danh sách nhà đầu tư
                    const response = await instance.get(`/list_nhadautu?page=${page}`);
                    result = response.data;
                }
                cache.set(cacheKey, result);
            }

            if (!result || !result.data) {
                throw new Error("Không tìm thấy dữ liệu nhà đầu tư");
            }

            setData(result.data);
            if (result.page_numer) {
                setTotalPages(Math.ceil(result.page_numer));
            } else {
                setTotalPages(1);
            }
        } catch (e) {
            setError("Không thể tải danh sách nhà đầu tư");
            console.log(e.message);
            setData([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    };

    // Xử lý tìm kiếm
    const onSearch = (value) => {
        setIsSearch(!!value.trim());
        setKeySearch(value);
        setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
        fetchInvestors(1, value);
    };

    // Fetch dữ liệu khi thay đổi trang hoặc tìm kiếm
    useEffect(() => {
        fetchInvestors(currentPage, keySearch);
    }, [currentPage, keySearch]);

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
                        onChange={(e) => setKeySearch(e.target.value)}
                        enterButton
                        style={{ width: '300px' }}
                    />

                    {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

                    {data.length > 0 ? (
                        data.map((item, index) => (
                            <InvestorCard key={index} data={item} />
                        ))
                    ) : (
                        !loading && <div>Không có dữ liệu nhà đầu tư</div>
                    )}

                    {totalPages > 1 && (
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
                    )}
                </div>
            </Spin>
        </Container>
    );
};

export default Investor;