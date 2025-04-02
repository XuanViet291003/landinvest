import { Button, Select, Spin, Row, Col, Input, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import Banner from '../../components/Banner';
import BidPlansTable from '../../components/BidPlansTable/BidPlansTable';

const { Option } = Select;
const { Search } = Input;

const BidPlans = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState({
        districts: false,
        data: false
    });
    const [error, setError] = useState(null);
    
    const [provinceInput, setProvinceInput] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [searchTriggered, setSearchTriggered] = useState(false);

    // Debounce effect for province input
    useEffect(() => {
        if (provinceInput.trim() === '') {
            setDistricts([]);
            setSelectedDistrict(null);
            return;
        }

        const timerId = setTimeout(() => {
            if (provinceInput && searchTriggered) {
                fetchDistricts();
            }
        }, 500);

        return () => clearTimeout(timerId);
    }, [provinceInput, searchTriggered]);

    const fetchDistricts = async () => {
        if (!provinceInput.trim()) return;
        
        try {
            setLoading(prev => ({ ...prev, districts: true }));
            setError(null);
            
            let allResults = [];
            let page = 1;
            let hasMore = true;

            // Fetch first page to check if we need to load more
            const initialResponse = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(provinceInput)}?page=${page}`);
            const initialData = await initialResponse.json();
            
            if (!initialData.data || initialData.data.length === 0) {
                message.warning(`Không tìm thấy dữ liệu cho "${provinceInput}"`);
                return;
            }

            allResults = [...initialData.data];
            
            // Check if we need to load more pages (assuming > 10 items means more pages)
            if (initialData.data.length >= 1000) {
                message.info('Đang tải toàn bộ dữ liệu, vui lòng chờ...');
                
                // Load additional pages
                while (hasMore) {
                    page++;
                    const response = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(provinceInput)}?page=${page}`);
                    const data = await response.json();
                    
                    if (!data.data || data.data.length === 0) {
                        hasMore = false;
                    } else {
                        allResults = [...allResults, ...data.data];
                    }
                }
            }

            // Process unique districts
            const uniqueDistricts = Array.from(
                new Map(
                    allResults.flatMap(item => item.DistrictID)
                        .map(district => [district.districtCode, district])
                ).values()
            );
            
            setDistricts(uniqueDistricts);
            message.success(`Tìm thấy ${uniqueDistricts.length} huyện/quận`);
            
        } catch (error) {
            console.error("Lỗi khi tải danh sách huyện:", error);
            setError("Không thể tải danh sách huyện/quận");
            message.error("Lỗi khi tải danh sách huyện/quận");
        } finally {
            setLoading(prev => ({ ...prev, districts: false }));
        }
    };

    const fetchData = async () => {
        if (!selectedDistrict || !provinceInput) return;
        
        try {
            setLoading(prev => ({ ...prev, data: true }));
            setError(null);
            setShowTable(false);
            
            let allResults = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(provinceInput)}?page=${page}`);
                const data = await response.json();
                
                if (!data.data || data.data.length === 0) {
                    hasMore = false;
                } else {
                    const filtered = data.data.filter(item => 
                        item.DistrictID.some(d => d.districtCode === selectedDistrict)
                    );
                    allResults = [...allResults, ...filtered];
                    page++;
                }
            }

            if (allResults.length > 0) {
                setSearchResults(allResults);
                setShowTable(true);
                message.success(`Tìm thấy ${allResults.length} kết quả`);
            } else {
                message.warning("Không tìm thấy kết quả phù hợp");
            }
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu:", error);
            setError("Không thể tải dữ liệu đấu thầu");
            message.error("Lỗi khi tải dữ liệu đấu thầu");
        } finally {
            setLoading(prev => ({ ...prev, data: false }));
        }
    };

    const handleProvinceSearch = () => {
        if (!provinceInput.trim()) {
            message.warning("Vui lòng nhập tên tỉnh/thành phố");
            return;
        }
        setSearchTriggered(true);
    };

    const resetSearch = () => {
        setProvinceInput('');
        setSelectedDistrict(null);
        setDistricts([]);
        setSearchResults([]);
        setShowTable(false);
        setSearchTriggered(false);
    };

    return (
        <Container className="bid-plans-container">
            <Banner />
            <div className="bid-plans__content">
                <h1 className="bid-plans__title">Kế hoạch đấu thầu theo huyện</h1>
                
                <Row gutter={16} className="bid-plans__search">
                    <Col xs={24} sm={12} md={8}>
                        <Search
                            placeholder="Nhập tỉnh/thành phố"
                            enterButton="Tải huyện"
                            value={provinceInput}
                            onChange={(e) => {
                                setProvinceInput(e.target.value);
                                setSearchTriggered(false);
                            }}
                            onSearch={handleProvinceSearch}
                            loading={loading.districts}
                            allowClear
                        />
                    </Col>
                    
                    <Col xs={24} sm={12} md={8}>
                        <Select
                            className="bid-plans__select"
                            placeholder="Chọn huyện/quận"
                            value={selectedDistrict}
                            onChange={setSelectedDistrict}
                            disabled={districts.length === 0 || loading.districts}
                            loading={loading.districts}
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.children.toLowerCase().includes(input.toLowerCase())
                            }
                        >
                            {districts.map(d => (
                                <Option key={d.districtCode} value={d.districtCode}>
                                    {d.districtName}
                                </Option>
                            ))}
                        </Select>
                    </Col>
                    
                    <Col xs={24} sm={12} md={8}>
                        <Button
                            type="primary"
                            onClick={fetchData}
                            disabled={!selectedDistrict || loading.data}
                            loading={loading.data}
                            block
                        >
                            Tìm kiếm đấu thầu
                        </Button>
                    </Col>
                </Row>

                {loading.districts && (
                    <div className="bid-plans__loading">
                        <Spin tip="Đang tải danh sách huyện/quận..." size="large" />
                    </div>
                )}

                {error && (
                    <div className="bid-plans__error">
                        <p>{error}</p>
                    </div>
                )}

                {showTable && (
                    <div className="bid-plans__results">
                        <div className="results-header">
                            <h3>
                                Kết quả tìm kiếm: {districts.find(d => d.districtCode === selectedDistrict)?.districtName}
                            </h3>
                            <Button onClick={resetSearch}>Đóng kết quả</Button>
                        </div>
                        <BidPlansTable data={searchResults} />
                    </div>
                )}
            </div>
        </Container>
    );
};

export default BidPlans;