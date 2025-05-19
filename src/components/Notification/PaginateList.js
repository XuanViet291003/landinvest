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
import Loading from './Loading';

const PaginateList = () => {
    const [totalPage, setTotalPage] = useState(0);
    const [visibleItems, setVisibleItems] = useState(5); // Mặc định hiển thị 5 phần tử
    const [currentPage, setCurrentPage] = useState(parseInt(useSearchParams()[0].get('page') || '1'));
    const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
    const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
    const [searchParms, setSearchParam] = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    const [listItems, setListItems] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchAllListProject(currentPage);
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
        };

        if (!searchTerm) {
            fetchData();
        }
    }, [currentPage, searchTerm, fetchAllListProject]);
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


// };



// import React, { useEffect, useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Loading from './Loading';
// import './Notification.scss';

// const PaginateList = () => {
//     const [listItems, setListItems] = useState([]);
//     const [totalPage, setTotalPage] = useState(0);
//     const [visibleItems] = useState(6);
//     const [searchParams, setSearchParams] = useSearchParams();
//     const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
//     const [searchTerm, setSearchTerm] = useState('');
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         const fetchPageData = async () => {
//             setLoading(true);
//             try {
//                 const query = searchTerm ? `&search=${encodeURIComponent(searchTerm)}` : '';
//                 const res = await fetch(`https://landinvest.thinkdiff.us/list_all_du_an?page=${currentPage}&limit=${visibleItems}${query}`);
//                 const json = await res.json();

//                 setListItems(json.data || []);
//                 // Lưu lại tổng số trang từ API
//                 const pageCount = Math.ceil(json.page_numer || 1);
//                 setTotalPage(pageCount);
//             } catch (error) {
//                 console.error('Lỗi khi fetch:', error);
//                 setListItems([]);
//                 setTotalPage(0);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchPageData();
//     }, [currentPage, searchTerm]);

//     const handleSearch = (e) => {
//         const term = e.target.value;
//         setSearchTerm(term);
//         setCurrentPage(1);
//         setSearchParams({ page: '1' });
//     };

//     const handlePageClick = (page) => {
//         setCurrentPage(page);
//         setSearchParams({ page: page.toString() });
//     };
//     console.log("Tổng số trang:", totalPage);

//     const renderPagination = () => {
//         const pages = [];
//         const totalNumbers = 5; // Số nút số chính giữa
//         const totalBlocks = totalNumbers + 2; // Thêm 2 cho trang đầu và cuối

//         // Nút Trang trước
//         pages.push(
//             <button
//                 key="prev"
//                 disabled={currentPage === 1}
//                 onClick={() => handlePageClick(currentPage - 1)}
//                 className="px-3 py-1 border rounded mx-1 bg-green-600 text-white disabled:opacity-50"
//             >
//                 Trang trước
//             </button>
//         );

//         if (totalPage <= totalBlocks) {
//             // Nếu tổng số trang ít, hiển thị tất cả
//             for (let i = 1; i <= totalPage; i++) {
//                 pages.push(
//                     <button
//                         key={i}
//                         onClick={() => handlePageClick(i)}
//                         className={`px-3 py-1 border rounded mx-1 ${currentPage === i ? 'active-page' : 'bg-green-600 text-white'}`}
//                     >
//                         {i}
//                     </button>
//                 );
//             }
//         } else {
//             const startPage = Math.max(2, currentPage - Math.floor(totalNumbers / 2));
//             const endPage = Math.min(totalPage - 1, currentPage + Math.floor(totalNumbers / 2));

//             // Trang 1
//             pages.push(
//                 <button
//                     key={1}
//                     onClick={() => handlePageClick(1)}
//                     className={`px-3 py-1 border rounded mx-1 ${currentPage === 1 ? 'active-page' : 'bg-green-600 text-white'}`}
//                 >
//                     1
//                 </button>
//             );

//             // Dấu ...
//             if (startPage > 2) {
//                 pages.push(<span key="start-ellipsis" className="mx-1 pagination-ellipsis">...</span>);
//             }

//             // Các trang chính giữa
//             for (let i = startPage; i <= endPage; i++) {
//                 pages.push(
//                     <button
//                         key={i}
//                         onClick={() => handlePageClick(i)}
//                         className={`px-3 py-1 border rounded mx-1 ${currentPage === i ? 'active-page' : 'bg-green-600 text-white'}`}
//                     >
//                         {i}
//                     </button>
//                 );
//             }

//             // Dấu ...
//             if (endPage < totalPage - 1) {
//                 pages.push(<span key="end-ellipsis" className="mx-1 pagination-ellipsis">...</span>);
//             }

//             // Trang cuối
//             pages.push(
//                 <button
//                     key={totalPage}
//                     onClick={() => handlePageClick(totalPage)}
//                     className={`px-3 py-1 border rounded mx-1 ${currentPage === totalPage ? 'active-page' : 'bg-green-600 text-white'}`}
//                 >
//                     {totalPage}
//                 </button>
//             );
//         }

//         // Nút Trang sau
//         pages.push(
//             <button
//                 key="next"
//                 disabled={currentPage === totalPage}
//                 onClick={() => handlePageClick(currentPage + 1)}
//                 className="px-3 py-1 border rounded mx-1 bg-green-600 text-white disabled:opacity-50"
//             >
//                 Trang sau
//             </button>
//         );

//         return pages;
//     };

//     return (
//         <div className="p-4" style={{marginBottom: '55px'}}>
//             <input
//                 type="text"
//                 placeholder="Tìm kiếm dự án..."
//                 value={searchTerm}
//                 onChange={handleSearch}
//                 className="border px-3 py-2 rounded w-full my-4"
//             />

//             {loading ? (
//                 <Loading />
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//                     {listItems.map((item) => (
//                         <div key={item.id} className="border rounded shadow p-4 bg-white mb-1">
//                             <img
//                                 src={item.image || '/default-thumbnail.jpg'}
//                                 loading="lazy"
//                                 alt={item.tenDuAn}
//                                 className="w-full h-48 object-cover rounded mb-3"
//                             />
//                             <h3 className="text-lg font-semibold">{item.tenDuAn}</h3>
//                             <p className="text-sm text-gray-700">{item.viTri}</p>
//                             <p className="text-sm">Diện tích: {item.dienTich}</p>
//                             <p className="text-sm">Trạng thái: {item.trangThai}</p>
//                         </div>
//                     ))}
//                 </div>
//             )}

//             {totalPage > 1 && (
//                 <div className="mb-5 flex justify-center flex-wrap gap-1" style={{marginTop: '30px'}}>
//                     {renderPagination()}
//                 </div>
//             )}
//         </div>
//     );
// };

export default PaginateList;