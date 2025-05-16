// import axios from 'axios';
// import React, { useCallback, useEffect, useState } from 'react';
// import { GrCaretNext, GrCaretPrevious } from 'react-icons/gr';
// import ReactPaginate from 'react-paginate';
// import { fetchAllListProject } from '../../services/api';
// import Footer from './Footer';
// import ListItem from './ListItem';
// import './Notification.scss';
// import SearchItem from './SearchItem';
// import { useSearchParams } from 'react-router-dom';
// import instance from '../../utils/axios-customize'; // Import instance
// import Loading from './Loading';

// const PaginateList = () => {
//     const [listItems, setListItems] = useState([]);
//     const [totalPage, setTotalPage] = useState(0);
//     const [visibleItems, setVisibleItems] = useState(5); // Mặc định hiển thị 5 phần tử
//     const [searchParms, setSearchParam] = useSearchParams();
//     const [currentPage, setCurrentPage] = useState(parseInt(useSearchParams()[0].get('page') || '1'));
//     const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
//     const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
//     const [loading, setLoading] = useState(false);
//     const [searchLoading, setSearchLoading] = useState(false);

//     const PaginateList = () => {
//         const [totalPage, setTotalPage] = useState(0);
//         const [visibleItems, setVisibleItems] = useState(5); // Mặc định hiển thị 5 phần tử
//         const [currentPage, setCurrentPage] = useState(parseInt(useSearchParams()[0].get('page') || '1'));
//         const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
//         const [searchResults, setSearchResults] = useState([]); // Kết quả tìm kiếm
//         const [searchParms, setSearchParam] = useSearchParams();
//         const [loading, setLoading] = useState(false);
//         const [searchLoading, setSearchLoading] = useState(false);
//         const [listItems, setListItems] = useState([]);

//         useEffect(() => {
//             const fetchData = async () => {
//                 setLoading(true);
//                 try {
//                     const res = await fetchAllListProject(currentPage);
//                     if (res) {
//                         setListItems(res.data);
//                         setTotalPage(Math.ceil(+res.page_numer));
//                     } else {
//                         setListItems([]);
//                         setTotalPage(0);
//                     }
//                 } catch (error) {
//                     console.error('Lỗi khi lấy danh sách dự án:', error);
//                     setListItems([]);
//                     setTotalPage(0);
//                 } finally {
//                     setLoading(false);
//                 }
//             };

//             if (!searchTerm) {
//                 fetchData();
//             }
//         }, [currentPage, searchTerm, fetchAllListProject]);
//     };

//     const getSearchResults = useCallback(async (query) => {
//         setSearchLoading(true);
//         try {
//             const res = await instance.get(`/search_du_an?search=${encodeURIComponent(query)}`);
//             setSearchResults(res.data.data || []); // Cập nhật kết quả tìm kiếm
//         } catch (error) {
//             console.error('Lỗi khi tìm kiếm dự án:', error);
//             setSearchResults([]);
//         } finally {
//             setSearchLoading(false);
//         }
//     }, []); // instance đã ổn định, không cần thêm vào dependency array

//     const handleSearch = (e) => {
//         const value = e.target.value;
//         setSearchTerm(value);
//         if (value.trim()) {
//             getSearchResults(value); // Tìm kiếm khi có từ khóa
//         } else {
//             setSearchResults([]); // Xóa kết quả khi ô tìm kiếm rỗng
//         }
//         setCurrentPage(1); // Reset về trang 1 khi thực hiện tìm kiếm mới
//         searchParms.delete('page');
//         setSearchParam(searchParms);
//     };

//     const itemsToDisplay = searchTerm ? searchResults : listItems;

//     const handlePageClick = (event) => {
//         const selectedPage = event.selected + 1;
//         searchParms.set('page', selectedPage);
//         setSearchParam(searchParms);
//         setCurrentPage(selectedPage);
//     };

//     // useEffect để xử lý việc đọc tham số page từ URL khi component mount
//     useEffect(() => {
//         const initialPage = parseInt(searchParms.get('page') || '1');
//         setCurrentPage(initialPage);
//     }, [searchParms]);

//     return (
//         <>
//             <SearchItem searchTerm={searchTerm} handleSearch={handleSearch} loading={searchLoading} />

//             <div className="list-item-container">
//                 {loading ? (
//                     <div className="loading-indicator">Đang tải...</div>
//                 ) : (
//                     <>
//                         {!searchTerm && totalPage > 1 && (
//                             <ReactPaginate
//                                 nextLabel={<GrCaretNext />}
//                                 onPageChange={handlePageClick}
//                                 pageRangeDisplayed={3}
//                                 marginPagesDisplayed={2}
//                                 pageCount={totalPage}
//                                 previousLabel={<GrCaretPrevious />}
//                                 pageClassName="page-item"
//                                 pageLinkClassName="page-link"
//                                 previousClassName="page-item"
//                                 previousLinkClassName="page-link"
//                                 nextClassName="page-item"
//                                 nextLinkClassName="page-link"
//                                 breakLabel="..."
//                                 breakClassName="page-item"
//                                 breakLinkClassName="page-link"
//                                 containerClassName="pagination"
//                                 activeClassName="active"
//                                 forcePage={currentPage - 1}
//                                 renderOnZeroPageCount={null}
//                                 initialPage={parseInt(searchParms.get('page') || '1') - 1}
//                             />
//                         )}

//                         {/* Hiển thị danh sách */}
//                         <ListItem listItems={itemsToDisplay} visibleItems={visibleItems} loading={loading || searchLoading} />

//                         {/* Phân trang dưới */}
//                         {!searchTerm && totalPage > 1 && (
//                             <ReactPaginate
//                                 nextLabel={<GrCaretNext />}
//                                 onPageChange={handlePageClick}
//                                 pageRangeDisplayed={3}
//                                 marginPagesDisplayed={2}
//                                 pageCount={totalPage}
//                                 previousLabel={<GrCaretPrevious />}
//                                 pageClassName="page-item"
//                                 pageLinkClassName="page-link"
//                                 previousClassName="page-item"
//                                 previousLinkClassName="page-link"
//                                 nextClassName="page-item"
//                                 nextLinkClassName="page-link"
//                                 breakLabel="..."
//                                 breakClassName="page-item"
//                                 breakLinkClassName="page-link"
//                                 containerClassName="pagination"
//                                 activeClassName="active"
//                                 forcePage={currentPage - 1}
//                                 renderOnZeroPageCount={null}
//                             />
//                         )}
//                         {searchTerm && searchResults.length === 0 && !searchLoading && (
//                             <div className="no-results">Không tìm thấy kết quả nào.</div>
//                         )}
//                     </>
//                 )}
//             </div>
//             <Footer />
//         </>
//     );
// };



import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchAllListProject } from '../../services/api';
import Loading from './Loading';
import './Notification.scss';

const PaginateList = () => {
    const [listItems, setListItems] = useState([]);
    const [totalPage, setTotalPage] = useState(0);
    const [visibleItems] = useState(6);
    const [searchParams, setSearchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page') || '1'));
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    // Fetch dự án theo trang
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetchAllListProject(currentPage);
                if (res?.data) {
                    setListItems(res.data);
                    setTotalPage(Math.ceil((res.total || res.data.length) / visibleItems));
                } else {
                    setListItems([]);
                    setTotalPage(0);
                }
            } catch (error) {
                console.error('Lỗi khi lấy danh sách dự án:', error);
                setListItems([]);
            } finally {
                setLoading(false);
            }
        };

        // Chỉ fetch nếu không tìm kiếm
        if (!searchTerm) {
            fetchData();
        }
    }, [currentPage, searchTerm, visibleItems]);

    // Tìm kiếm
    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1);
        setSearchParams({ page: '1' });
    };

    // Chuyển trang
    const handlePageClick = (page) => {
        setCurrentPage(page);
        setSearchParams({ page: page.toString() });
    };

    // Lọc client-side nếu có tìm kiếm
    const filteredItems = searchTerm
        ? listItems.filter((item) =>
            item.tenDuAn?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        : listItems;

    // Hiển thị 6 item đầu tiên
    const displayedItems = filteredItems.slice((currentPage - 1) * visibleItems, currentPage * visibleItems);


    return (
        <div className="p-4">
            <input
                type="text"
                placeholder="Tìm kiếm dự án..."
                value={searchTerm}
                onChange={handleSearch}
                className="border px-3 py-2 rounded w-full my-4"
            />

            {loading ? (
                <Loading />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedItems.map((item) => (
                        <div key={item.id} className="border rounded shadow p-4 bg-white">
                            <img
                                src={item.image || '/default-thumbnail.jpg'}
                                loading="lazy"
                                alt={item.tenDuAn}
                                className="w-full h-48 object-cover rounded mb-3"
                            />
                            <h3 className="text-lg font-semibold">{item.tenDuAn}</h3>
                            <p className="text-sm text-gray-700">{item.viTri}</p>
                            <p className="text-sm">Diện tích: {item.dienTich}</p>
                            <p className="text-sm">Trạng thái: {item.trangThai}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Phân trang khi không tìm kiếm */}
            {!searchTerm && totalPage > 1 && (
                <div className="mt-5 mb-5 flex justify-center flex-wrap gap-2">
                    {Array.from({ length: totalPage }, (_, i) => {
                        const page = i + 1;
                        return (
                            <button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                style={{marginBottom: '120px', marginRight: '2px'}}
                                className={`px-4 py-2 border rounded mb-5 transition ${currentPage === page
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-black hover:bg-gray-200'
                                    }`}
                            >
                                {page}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PaginateList;