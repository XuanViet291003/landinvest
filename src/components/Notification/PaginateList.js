import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { GrCaretNext, GrCaretPrevious } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import { fetchAllListProject } from '../../services/api';
import Footer from './Footer';
import ListItem from './ListItem';
import './Notification.scss';
import SearchItem from './SearchItem';
import { useSearchParams } from 'react-router-dom';
import instance from '../../utils/axios-customize'; // Import instance

const PaginateList = () => {
    const [listItems, setListItems] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [visibleItems, setVisibleItems] = useState(5); // Mặc định hiển thị 5 phần tử
    const [currentPage, setCurrentPage] = useState(parseInt(useSearchParams()[0].get('page') || '1'));
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [searchParms, setSearchParam] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);

    useEffect(() => {
        if (!searchTerm) {
            getApi(currentPage);
        }
    }, [currentPage, searchTerm, getApi]); // Thêm getApi vào dependency array

    const getApi = useCallback(async (page) => {
        setLoading(true);
        try {
            const res = await fetchAllListProject(page);
            if (res) {
                setListItems(res.data);
                setTotalPage(Math.ceil(+res.page_numer));
            } else {
                setListItems([]);
                setTotalPage(0);
            }
        } catch (error) {
            console.error('Lỗi khi lấy danh sách dự án:', error);
            setListItems([]);
            setTotalPage(0);
        } finally {
            setLoading(false);
        }
    }, [fetchAllListProject]); // Thêm fetchAllListProject vào dependency array

    const getSearchResults = useCallback(async (query) => {
        setSearchLoading(true);
        try {
            const res = await instance.get(`/search_du_an?search=${encodeURIComponent(query)}`);
            setSearchResults(res.data.data || []); // Cập nhật kết quả tìm kiếm
        } catch (error) {
            console.error('Lỗi khi tìm kiếm dự án:', error);
            setSearchResults([]);
        } finally {
            setSearchLoading(false);
        }
    }, []); // instance đã ổn định, không cần thêm vào dependency array

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            getSearchResults(value); // Tìm kiếm khi có từ khóa
        } else {
            setSearchResults([]); // Xóa kết quả khi ô tìm kiếm rỗng
        }
        setCurrentPage(1); // Reset về trang 1 khi thực hiện tìm kiếm mới
        searchParms.delete('page');
        setSearchParam(searchParms);
    };

    const itemsToDisplay = searchTerm ? searchResults : listItems;

    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        searchParms.set('page', selectedPage);
        setSearchParam(searchParms);
        setCurrentPage(selectedPage);
    };

    // useEffect để xử lý việc đọc tham số page từ URL khi component mount
    useEffect(() => {
        const initialPage = parseInt(searchParms.get('page') || '1');
        setCurrentPage(initialPage);
    }, [searchParms]);

    return (
        <>
            <SearchItem searchTerm={searchTerm} handleSearch={handleSearch} loading={searchLoading} />

            <div className="list-item-container">
                {loading ? (
                    <div className="loading-indicator">Đang tải...</div>
                ) : (
                    <>
                        {!searchTerm && totalPage > 1 && (
                            <ReactPaginate
                                nextLabel={<GrCaretNext />}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPage}
                                previousLabel={<GrCaretPrevious />}
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                forcePage={currentPage - 1}
                                renderOnZeroPageCount={null}
                                initialPage={parseInt(searchParms.get('page') || '1') - 1}
                            />
                        )}

                        {/* Hiển thị danh sách */}
                        <ListItem listItems={itemsToDisplay} visibleItems={visibleItems} loading={loading || searchLoading} />

                        {/* Phân trang dưới */}
                        {!searchTerm && totalPage > 1 && (
                            <ReactPaginate
                                nextLabel={<GrCaretNext />}
                                onPageChange={handlePageClick}
                                pageRangeDisplayed={3}
                                marginPagesDisplayed={2}
                                pageCount={totalPage}
                                previousLabel={<GrCaretPrevious />}
                                pageClassName="page-item"
                                pageLinkClassName="page-link"
                                previousClassName="page-item"
                                previousLinkClassName="page-link"
                                nextClassName="page-item"
                                nextLinkClassName="page-link"
                                breakLabel="..."
                                breakClassName="page-item"
                                breakLinkClassName="page-link"
                                containerClassName="pagination"
                                activeClassName="active"
                                forcePage={currentPage - 1}
                                renderOnZeroPageCount={null}
                            />
                        )}
                        {searchTerm && searchResults.length === 0 && !searchLoading && (
                            <div className="no-results">Không tìm thấy kết quả nào.</div>
                        )}
                    </>
                )}
            </div>
            <Footer />
        </>
    );
};

export default PaginateList;