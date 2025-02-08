import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { GrCaretNext, GrCaretPrevious } from 'react-icons/gr';
import ReactPaginate from 'react-paginate';
import { fetchAllListProject } from '../../services/api';
import Footer from './Footer';
import ListItem from './ListItem';
import './Notification.scss';
import SearchItem from './SearchItem';

const PaginateList = () => {
    const [listItems, setListItems] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [visibleItems, setVisibleItems] = useState(5); // Mặc định hiển thị 5 phần tử
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm

    useEffect(() => {
        if (!searchTerm) {
            getApi(currentPage);
        }
    }, [currentPage, searchTerm]);

    const getApi = useCallback(async (page) => {
        let res = await fetchAllListProject(page);
        if (res) {
            setListItems(res.data);
            setTotalPage(Math.ceil(+res.page_numer));
        } else {
            setListItems([]);
        }
    }, []);

    const getSearchResults = useCallback(async (query) => {
        try {
            const res = await axios.get(`https://api.quyhoach.xyz/search_du_an?search=${encodeURIComponent(query)}`);
            setSearchResults(res.data.data || []); // Cập nhật kết quả tìm kiếm
        } catch (error) {
            console.error('Error fetching search results:', error);
            setSearchResults([]);
        }
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value.trim()) {
            getSearchResults(value); // Tìm kiếm khi có từ khóa
        } else {
            setSearchResults([]); // Xóa kết quả khi ô tìm kiếm rỗng
        }
    };

    const itemsToDisplay = searchTerm ? searchResults : listItems;
    const handlePageClick = (event) => {
        const selectedPage = event.selected + 1;
        setCurrentPage(selectedPage);
    };

    // const loadMoreItems = () => {
    //     setVisibleItems((prev) => prev + 5);
    // };

    return (
        <>
            {/* <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Nhập từ khóa tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: '8px',
                        width: '300px',
                        border: '1px solid #ccc',
                        borderRadius: '4px',
                    }}
                />
            </div> */}
            <SearchItem searchTerm={searchTerm} handleSearch={handleSearch} />

            <div className="list-item-container">
                {!searchTerm && (
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

                {/* Hiển thị danh sách */}
                <ListItem listItems={itemsToDisplay} visibleItems={visibleItems} />

                {/* Phân trang dưới */}
                {!searchTerm && (
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
            </div>
            <Footer />
        </>
    );
};

export default PaginateList;
