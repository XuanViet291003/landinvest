import { Button, Select, Spin, Row, Col, Input, message, Form } from "antd";
import React, { useState, useEffect } from "react";
import { Container } from "react-bootstrap";
import Banner from "../../components/Banner";
import BidPlansTable from "../../components/BidPlansTable/BidPlansTable";

const { Option } = Select;
const { Search } = Input;

const BidPlans = () => {
    const [provinces, setProvinces] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState(null);
    const [districts, setDistricts] = useState([]);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [searchResults, setSearchResults] = useState([]);
    const [showTable, setShowTable] = useState(false);
    const [loading, setLoading] = useState({ provinces: false, districts: false, data: false });
    const [error, setError] = useState(null);
    const [searchText, setSearchText] = useState("");

    useEffect(() => {
        fetchProvinces();
    }, []);

    const fetchProvinces = async () => {
        setLoading(prev => ({ ...prev, provinces: true }));
        try {
            const response = await fetch("https://api.quyhoach.xyz/all_provinces");
            const data = await response.json();
            const provincesList = data.dulieu.map(province => ({
                name: province.ProvinceName,
                code: province.ProvinceCode
            }));
            setProvinces(provincesList);
        } catch (error) {
            console.error("Lỗi khi tải danh sách tỉnh/thành phố:", error);
            message.error("Không thể tải danh sách tỉnh/thành phố");
        } finally {
            setLoading(prev => ({ ...prev, provinces: false }));
        }
    };

    const fetchDistricts = async (provinceName) => {
        if (!provinceName) return;
        setLoading(prev => ({ ...prev, districts: true }));
        setError(null);
        setDistricts([]);
        setSelectedDistrict(null);
        setShowTable(false);

        try {
            let allDistricts = [];
            let page = 1;
            let totalPages = 1;

            while (page <= totalPages) {
                const response = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(provinceName)}?page=${page}`);
                const data = await response.json();

                if (!data.data || data.data.length === 0) break;

                allDistricts = [...allDistricts, ...data.data.flatMap(item => item.DistrictID)];
                totalPages = data.totalPages || 1;
                page++;
            }

            const uniqueDistricts = Array.from(new Map(allDistricts.map(d => [d.districtCode, d])).values());
            setDistricts(uniqueDistricts);
            message.success(`Tìm thấy ${uniqueDistricts.length} huyện/quận`);
        } catch (error) {
            console.error("Lỗi khi tải danh sách huyện/quận:", error);
            setError("Không thể tải danh sách huyện/quận");
            message.error("Lỗi khi tải danh sách huyện/quận");
        } finally {
            setLoading(prev => ({ ...prev, districts: false }));
        }
    };

    const fetchDataByDistrict = async () => {
        if (!selectedDistrict || !selectedProvince) return;
        setLoading(prev => ({ ...prev, data: true }));
        setShowTable(false);
        setError(null);

        try {
            let allResults = [];
            let page = 1;
            let hasMore = true;

            while (hasMore) {
                const response = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(selectedProvince)}?page=${page}`);
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
            console.error("Lỗi khi tải dữ liệu đấu thầu:", error);
            setError("Không thể tải dữ liệu đấu thầu");
            message.error("Lỗi khi tải dữ liệu đấu thầu");
        } finally {
            setLoading(prev => ({ ...prev, data: false }));
        }
    };

    const fetchDataByText = async () => {
        if (!searchText.trim()) {
            message.warning("Vui lòng nhập từ khóa tìm kiếm");
            return;
        }
        
        setLoading(prev => ({ ...prev, data: true }));
        setShowTable(false);
        setError(null);

        try {
            const response = await fetch(`https://api.quyhoach.xyz/dbht_search_text/${encodeURIComponent(searchText)}`);
            const data = await response.json();

            if (data.data && data.data.length > 0) {
                setSearchResults(data.data);
                setShowTable(true);
                message.success(`Tìm thấy ${data.data.length} kết quả`);
            } else {
                message.warning("Không tìm thấy kết quả phù hợp");
                setSearchResults([]);
                setShowTable(false);
            }
        } catch (error) {
            console.error("Lỗi khi tìm kiếm:", error);
            setError("Không thể thực hiện tìm kiếm");
            message.error("Lỗi khi tìm kiếm");
        } finally {
            setLoading(prev => ({ ...prev, data: false }));
        }
    };

    const handleProvinceChange = (value) => {
        setSelectedProvince(value);
        setSelectedDistrict(null);
        setDistricts([]);
        setSearchResults([]);
        setShowTable(false);
        fetchDistricts(value);
    };

    const resetSearch = () => {
        setSelectedProvince(null);
        setSelectedDistrict(null);
        setDistricts([]);
        setSearchResults([]);
        setShowTable(false);
        setSearchText("");
    };

    return (
        <Container className="bid-plans-container">
            <Banner />
            <div className="bid-plans__content">
                <h1 className="bid-plans__title">Kế hoạch đấu thầu</h1>

                <Form layout="vertical">
                    {/* Ô tìm kiếm theo text */}
                    <Row gutter={16} className="bid-plans__search">
                        <Col xs={24} md={18}>
                            <Search
                                placeholder="Nhập từ khóa tìm kiếm (tên dự án, số hiệu kế hoạch...)"
                                enterButton="Tìm kiếm"
                                size="large"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                onSearch={fetchDataByText}
                                loading={loading.data}
                            />
                        </Col>
                        <Col xs={24} md={6}>
                            <Button 
                                type="default" 
                                size="large" 
                                onClick={resetSearch}
                                style={{ width: '100%', height: '40px' }}
                            >
                                Đặt lại
                            </Button>
                        </Col>
                    </Row>

                    <div className="search-divider">
                        <span>HOẶC</span>
                    </div>

                    {/* Tìm kiếm theo tỉnh/huyện */}
                    <Row gutter={16} className="bid-plans__search">
                        <Col xs={24} sm={12} md={8}>
                            <Select
                                className="bid-plans__select"
                                placeholder="Chọn tỉnh/thành phố"
                                value={selectedProvince}
                                onChange={handleProvinceChange}
                                loading={loading.provinces}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                size="large"
                            >
                                {provinces.map(province => (
                                    <Option key={province.code} value={province.name}>
                                        {province.name}
                                    </Option>
                                ))}
                            </Select>
                        </Col>

                        <Col xs={24} sm={12} md={8}>
                            <Select
                                className="bid-plans__select"
                                placeholder={selectedProvince ? "Chọn huyện/quận" : "Vui lòng chọn tỉnh trước"}
                                value={selectedDistrict}
                                onChange={setSelectedDistrict}
                                disabled={!selectedProvince || districts.length === 0 || loading.districts}
                                loading={loading.districts}
                                showSearch
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toLowerCase().includes(input.toLowerCase())
                                }
                                size="large"
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
                                onClick={fetchDataByDistrict}
                                disabled={!selectedDistrict || loading.data}
                                loading={loading.data}
                                size="large"
                                block
                            >
                                Tìm theo huyện
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {showTable && (
                    <div className="bid-plans__results">
                        <div className="results-header">
                            <h3>
                                {searchText 
                                    ? `Kết quả tìm kiếm: "${searchText}"`
                                    : `Kết quả tìm kiếm: ${districts.find(d => d.districtCode === selectedDistrict)?.districtName}`}
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