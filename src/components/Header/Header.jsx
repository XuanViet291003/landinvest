import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../assets/channels4_profile.jpg';

import { usePayOS } from '@payos/payos-checkout';
import { Avatar, Button, Card, Dropdown, List, message, Modal, notification, Space, Spin, Tooltip } from 'antd';
import axios from 'axios';
import { memo, useEffect, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { CiSquarePlus } from 'react-icons/ci';
import { FaCoins } from 'react-icons/fa';
import { IoIosNotifications, IoIosRadioButtonOff, IoIosRadioButtonOn } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'use-debounce';
import { icons } from '../../assets';
import { coinPackage } from '../../constants/order';
import fetchProvinceName from '../../function/findProvince';
import { getPolygonsQuanHuyen, getPolygonsTinh } from '../../function/getPolygonByName';
import { decodeJWT } from '../../function/JwtDecode';
import { generateHMAC } from '../../function/Payment/generateHMAC';
import { toVndCurrency } from '../../function/Payment/toVndCurrency';
import useWindowSize from '../../hooks/useWindowSise';
import { doLogoutAction, getCoins } from '../../redux/account/accountSlice';
import { doSearch } from '../../redux/search/searchSlice';
import {
    callLogout,
    cancelCheckout,
    createCheckout,
    createCheckoutInfo,
    fetchAccount,
    getCheckoutInfo,
    getWardPolygon,
    searchPost,
} from '../../services/api';
import ModalNotification from '../Auth/ModalNotification';
import { ActionIcon, HomeIcon, NewsIcon, NotificationIcon, SearchIcon, SearchNavbarIcon } from '../Icons';
import './Header.scss';
import { searchDefault, searchNews } from '../../redux/checkSearch/checkSearchSlice';
import ReactPaginate from 'react-paginate';
import { InfoCircleOutlined } from '@ant-design/icons';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org/search?';
const SEARCH_BASE_URL = 'https://api.quyhoach.xyz/search_diachi';
const params = {
    format: 'json',
    addressdetails: 1,
    polygon_geojson: 1,
    countrycodes: 'VN',
    bounded: 1,
    viewbox: '102.14441,8.17966,109.4696,23.3934', // bonding box viet nam
    // limit: 10,
};
// params['accept-language'] = 'vi';

const iconAvatar =
    'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isAuthenticated = useSelector((state) => state.account.isAuthenticated);
    const datauser = useSelector((state) => state.account.dataUser);
    const user = useSelector((state) => state.account.Users);
    const [isShowModalLogin, setIsShowModalLogin] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [debouncedInputSearch] = useDebounce(searchQuery, 600);
    const [isLoading, setIsLoading] = useState(false);
    const [apiUser, setApiUser] = useState([]);
    const windowSize = useWindowSize();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const [userId, setUserId] = useState('');
    const [messageApi, contextHolder] = message.useMessage();
    const [isPayOsOpen, setIsPayOsOpen] = useState();
    const [coin, setCoin] = useState(1);
    const description = `Thanh toan #${userId}`;
    const accessToken = window.localStorage.getItem('access_token');
    const jwtData = decodeJWT(accessToken);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const element = useRef();
    const [payOSConfig, setPayOSConfig] = useState({
        RETURN_URL: window.location.origin,
        cancelUrl: window.location.origin,
        ELEMENT_ID: 'embedded-payment-container',
        CHECKOUT_URL: '',
        embedded: false,
        onCancel: async (event) => {
            messageApi.open({ type: 'success', content: 'Hủy thanh toán thành công!' });
            setIsModalOpen(false);
            setIsCheckoutLoading(false);
            setIsPayOsOpen(false);
            setCoin(1);
            setTotalPrice(0);
        },
    });
    const [totalPrice, setTotalPrice] = useState(0);
    const [coinPackageSelected, setCoinPackageSelected] = useState(null);

    const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
    const coins = useSelector((state) => state.account.coins);

    const { open, exit } = usePayOS(payOSConfig);
    const [isOverlay, setIsOverlay] = useState(false);
    const [locationData, setLocationData] = useState([]);
    const currentLocation = useLocation();
    const checkSearch = useSelector((state) => state.checkSearch);
    const [totalPage, setTotalPage] = useState(0);
    let items = [
        {
            label: <Link to="/userprofile">Trang profile</Link>,
            key: 'userprofile',
        },

        {
            label: (
                <label style={{ cursor: 'pointer' }} onClick={() => handleLogOut()}>
                    Đăng xuất
                </label>
            ),
            key: 'logout',
        },
    ];
    if (datauser?.role === true) {
        items.unshift({
            label: <Link to="/admin">Trang quản trị</Link>,
            key: 'admin',
        });
    }

    const handleClose = () => {
        setIsShowModalLogin(false);
    };

    const handleLogOut = async () => {
        const { Username, Password } = user;
        const res = await callLogout(Username, Password);
        if (res) {
            dispatch(doLogoutAction());
            navigate('/');
            message.success('Đăng xuất thành công!');
        } else {
            notification.error({
                message: 'Có lỗi xáy ra',
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message[1],
                duration: 5,
            });
        }
    };

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;
        try {
            setIsLoading(true);
            const response = await axios.get(SEARCH_BASE_URL, {
                params: { search: debouncedInputSearch },
            });
            // const filteredData = data.filter((item) => item.geojson?.type === 'Polygon');
            // console.log(data);

            handleSearchDispatch(response.data.data[0]);
            setSearchQuery('');
            setIsLoading(false);
            setIsOverlay(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setIsLoading(false);
        } finally {
            setIsLoading(false);
        }
    };
    // Search
    // const handleSearchDispatch = async (item) => {
    //     if (!item) return;
    //     try {
    //         // const info = await fetchProvinceName(item.lat, item.lon);
    //         dispatch(
    //             doSearch({
    //                 displayName: item.display_name,
    //                 lat: item.lat,
    //                 lon: item.lon,
    //                 coordinates: item.geojson.coordinates,
    //                 boundingbox: item.boundingbox,
    //                 // provinceName: info.provinceName,
    //                 // districtName: info.districtName,
    //             }),
    //         );
    //         searchParams.set('vitri', `${item.lat},${item.lon}`);
    //         // navigate({ search: searchParams.toString() });
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     }
    // };

    const handleSearchDispatch = async (item) => {
        if (!item) return;
        try {
            const centerLat =
                item.Type === 'SEARCH_MAPS' || item.Type === 'DIADIEM_MAPS'
                    ? item.lat
                    : (item.bounding_box.north + item.bounding_box.south) / 2;
            const centerLon =
                item.Type === 'SEARCH_MAPS' || item.Type === 'DIADIEM_MAPS'
                    ? item.long
                    : (item.bounding_box.east + item.bounding_box.west) / 2;

            let coordinates = [];
            if (item.Type === 'QUAN_HUYEN') {
                coordinates = await getPolygonsQuanHuyen(item.DistrictID);
            } else if (item.Type === 'TINH') {
                coordinates = await getPolygonsTinh(item.ProvinceID);
            } else if (item.Type === 'XA_PHUONG') {
                coordinates = await getWardPolygon(item.WandID);
                console.log(coordinates);
            }

            const info = await fetchProvinceName(centerLat, centerLon);
            dispatch(
                doSearch({
                    displayName: item.WandName ? `${item.WandName} , ${item.name_diachi}` : item.name_diachi,
                    lat: centerLat,
                    lon: centerLon,
                    coordinates: coordinates.length > 0 ? coordinates : [],
                    boundingbox: item.bounding_box,
                    provinceName: info.provinceName,
                    districtName: info.districtName,
                }),
            );
            searchParams.set('vitri', `${centerLat},${centerLon}`);
            navigate(`/?${searchParams.toString()}`);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleItemClick = (e, item) => {
        e.stopPropagation();
        if (item) {
            handleSearchDispatch(item);
        }
        setIsOverlay(false);
        setSearchQuery('');
        // window.history.pushState({}, '', `/${item.name}`);
        // navigate(`/${item.name}`);
    };

    const handleCheckout = () => {
        navigate('/vipupgrade');
    };

    const handleGetPaymentLink = async (item) => {
        setIsCheckoutLoading(true);
        const orderCode = Number(String(Date.now()).slice(-6));
        const returnUrl = `${window.location.origin}`;
        const cancelUrl = `${window.location.origin}`;
        let amount = 0;
        let itemData = {};

        // if item is coin package
        if (typeof item === 'object') {
            itemData = {
                name: item.package,
                quantity: 1,
                price: item.cost,
            };
            amount = item.cost;
        }
        const signatureData = `amount=${amount}&cancelUrl=${cancelUrl}&description=${description}&orderCode=${orderCode}&returnUrl=${returnUrl}`;
        const signature = generateHMAC(signatureData);
        const dataCheckout = {
            orderCode,
            amount,
            description,
            item: [itemData],
            cancelUrl,
            returnUrl,
            expiredAt: Math.floor(Date.now() / 1000) + 5 * 60,
            signature,
        };

        if (!isAuthenticated || !userId) {
            messageApi.open({ type: 'info', content: 'Bạn chưa đăng nhập!' });
        }

        exit();
        const { data, code } = await createCheckout(dataCheckout);

        if (code === '00') {
            setPayOSConfig((oldConfig) => ({
                ...oldConfig,
                CHECKOUT_URL: data.checkoutUrl,
                onSuccess: async (event) => {
                    messageApi.open({ type: 'success', content: 'Thanh toán thành công!' });
                    setIsModalOpen(false);
                    setIsCheckoutLoading(false);
                    setIsPayOsOpen(false);
                    setCoin(1);
                    setTotalPrice(0);
                    try {
                        const { data } = await getCheckoutInfo(event.orderCode);
                        const transactions = data?.transactions?.[0];
                        const formData = new FormData();
                        formData.append('orderCode', event.orderCode);
                        formData.append('code', event.code);
                        formData.append('desc', description);
                        formData.append('success', 'success');
                        formData.append('currency', 'VND');
                        formData.append('amount', data.amount);
                        formData.append('paymentLinkId', event.id);
                        formData.append('description', transactions.description);
                        formData.append('reference', transactions.reference);
                        formData.append('accountNumber', transactions.accountNumber);
                        formData.append('transactionDateTime', transactions.transactionDateTime);
                        formData.append('counterAccountBankId', transactions.counterAccountBankId);
                        formData.append('counterAccountName', transactions.counterAccountName);
                        formData.append('counterAccountBankName', transactions.counterAccountBankName ?? '');
                        formData.append('counterAccountNumber', transactions.counterAccountNumber);
                        formData.append('virtualAccountName', transactions.virtualAccountName ?? '');
                        formData.append('virtualAccountNumber', transactions.virtualAccountNumber ?? '');
                        formData.append('coin', coin || totalPrice / 1000);
                        await createCheckoutInfo(formData);
                    } catch (error) {
                        console.log(error);
                    }
                },
                onExit: async () => {
                    setIsPayOsOpen(false);
                    setIsCheckoutLoading(false);
                    setCoin(1);
                    setTotalPrice(0);
                    await cancelCheckout(orderCode);
                },
            }));
        } else {
            setIsCheckoutLoading(false);
            setIsPayOsOpen(false);
            messageApi.open({ type: 'error', content: 'Có lỗi xảy ra!' });
        }
    };

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleSelectedCoinPackage = (item, index) => {
        const price = item.cost;
        setCoinPackageSelected(index);
        setTotalPrice(price);
    };
    const handleCloseSearch = () => {
        setSearchResult([]);
        setIsOverlay(false);
    };

    //User
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (datauser?.UserID) {
                    const response = await fetchAccount();
                    const fetchedUser = response.find((user) => user?.userid === datauser?.UserID);
                    fetchedUser && setApiUser(fetchedUser);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                notification.error({
                    message: 'Error',
                    description: 'Failed to fetch user data',
                });
            }
        };
        fetchUserData();
    }, [datauser?.UserID]);

    useEffect(() => {
        const handleGetData = async () => {
            if (debouncedInputSearch.trim() === '') {
                setSearchResult([]);
                return;
            }
            if (debouncedInputSearch) {
                if (!checkSearch) {
                    setIsLoading(true);
                    try {
                        const response = await axios.get(SEARCH_BASE_URL, {
                            params: { search: debouncedInputSearch },
                        });

                        setSearchResult(response.data.data);
                        setIsLoading(false);
                    } catch (error) {
                        console.error('Error fetching data:', error);
                        setIsLoading(false);
                    } finally {
                        setIsLoading(false);
                    }
                }
            } else {
                setSearchResult([]);
            }
            setIsOverlay(true);
        };
        setIsLoading(false);
        handleGetData();
    }, [debouncedInputSearch]);
    useEffect(() => {
        // if (!isAuthenticated) {
        //     message.open({ type: 'info', content: 'Bạn chưa đăng nhập!' });
        //     navigate('/login');
        // }
        if (accessToken) {
            setUserId(jwtData.sub.UserID);
        }
    }, []);

    useEffect(() => {
        if (payOSConfig.CHECKOUT_URL !== '') {
            open();
        }
    }, [payOSConfig]);

    useEffect(() => {
        if (userId) {
            dispatch(getCoins(userId));
        }
    }, [userId]);
    useEffect(() => {
        const check = currentLocation.pathname.includes('/news');
        if (check) {
            if (!checkSearch) {
                dispatch(searchNews());
            }
        } else {
            if (checkSearch) {
                dispatch(searchDefault());
            }
        }
    }, [currentLocation]);
    return (
        <>
            {contextHolder}
            {windowSize.windowWidth > 768 ? (
                <Navbar bg="#262D34" className="header-container" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">
                            <div className="header-logo">
                                <img
                                    src={logo}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top header-logo-img"
                                    alt="React Bootstrap logo"
                                />
                                <span className="header-logo-content ml-2">LAND INVEST</span>
                            </div>
                        </Navbar.Brand>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="list-item-icon">
                                <NavLink to="/" className="nav-link">
                                    <HomeIcon />
                                </NavLink>
                                <NavLink to="/list_all_du_an" className="nav-link">
                                    <NotificationIcon />
                                </NavLink>
                                <NavLink to="/news" className="nav-link">
                                    <NewsIcon />
                                </NavLink>
                                <NavLink to="/bidding?page=1&limit=10" className="nav-link">
                                    <SearchNavbarIcon />
                                </NavLink>
                                <NavLink to="/auctions" className="nav-link">
                                    <ActionIcon />
                                </NavLink>
                                <NavLink to="/land-cost" className="nav-link">
                                    <img src={icons.landCostIcon} alt="" width={30} height={30} />
                                </NavLink>
                                <NavLink to="/about-us" className="nav-link">
                                    <InfoCircleOutlined style={{ fontSize: 20 }} />
                                </NavLink>
                            </Nav>
                            <form
                                className="header-search"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!checkSearch) handleSearchSubmit(e);
                                    else {
                                        if (searchQuery.trim() !== '') {
                                            navigate(`/news/search-news/${searchQuery}`);
                                        } else return;
                                    }
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder={checkSearch ? 'Tìm bình luận và bài viết' : 'Tìm địa chỉ..'}
                                    value={searchQuery}
                                    className="header-search-input"
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                {isLoading && <AiOutlineLoading3Quarters className="loading" />}
                                <button type="submit">
                                    <SearchIcon />
                                </button>
                                {searchResult.length > 0 && (
                                    <div
                                        className={`header-search-overlay ${isOverlay ? 'active' : ''}`}
                                        onClick={() => {
                                            if (!checkSearch) handleCloseSearch();
                                        }}
                                    >
                                        {searchResult.length > 0 && (
                                            <List
                                                bordered
                                                className="list--search"
                                                dataSource={searchResult}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        className="list--item"
                                                        onClick={(e) => handleItemClick(e, item)}
                                                    >
                                                        {item.WandName
                                                            ? `${item.WandName} , ${item.name_diachi}`
                                                            : item.name_diachi}
                                                    </List.Item>
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                            </form>

                            <div className="header-right">
                                <div className="header-notification">
                                    <IoIosNotifications size={24} />
                                </div>
                                {!isAuthenticated ? (
                                    <button className="btn" onClick={() => setIsShowModalLogin(true)}>
                                        Đăng nhập
                                    </button>
                                ) : (
                                    <Dropdown menu={{ items }} trigger={['click']}>
                                        <button
                                            style={{
                                                color: '#fff',
                                                cursor: 'pointer',
                                                background: 'none',
                                                border: 'none',
                                            }}
                                            onClick={(e) => e.preventDefault()}
                                        >
                                            <Space>
                                                <Avatar src={apiUser?.avatarLink || iconAvatar} />
                                                {apiUser?.FullName || 'Tên người dùng'}
                                            </Space>
                                        </button>
                                    </Dropdown>
                                )}
                                <div className="header-payment" onClick={handleCheckout}>
                                    <img src={icons.vipIcon} alt="vip icon" />
                                </div>
                                <div className="header-payment coins" onClick={showModal}>
                                    <CiSquarePlus className="" size={20} color="#fff" />
                                    {isAuthenticated && (
                                        <Tooltip title="coins" placement="top">
                                            <div className="header-coins">
                                                <span>{coins || 0}</span>
                                            </div>
                                        </Tooltip>
                                    )}
                                    <FaCoins color="#fff" size={20} />
                                </div>
                            </div>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            ) : (
                <>
                    <div
                        style={{ background: '#262D34', display: 'flex', padding: '0 20px', zIndex: 999 }}
                        className="h-[100%] flex items-center justify-between"
                    >
                        <div className="flex items-center py-3">
                            <img src={logo} width="20" height="20" className="header-logo-img" alt="Logo" />
                            <span
                                className="text-[10px]"
                                style={{ color: 'orange', padding: '7px', fontWeight: '700' }}
                            >
                                LAND INVEST
                            </span>
                        </div>
                        <div>
                            <form
                                className="flex items-center"
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    if (!checkSearch) handleSearchSubmit(e);
                                    else {
                                        if (searchQuery.trim() !== '') {
                                            navigate(`/news/search-news/${searchQuery}`);
                                        } else return;
                                    }
                                }}
                            >
                                <input
                                    type="text"
                                    placeholder={checkSearch ? 'Tìm bài viết và bình luận' : 'Tìm địa chỉ...'}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                    style={{ width: '150px', padding: '8px', fontSize: '16px', borderRadius: '20px' }}
                                />
                                <button type="submit">
                                    <SearchIcon />
                                </button>
                            </form>
                            <div
                                style={{
                                    position: 'fixed',
                                    backgroundColor: 'white',
                                    borderRadius: 4,
                                    boxShadow: '#ff571a',
                                    zIndex: '999999999',
                                    width: '100%',
                                    left: '0 ',
                                }}
                            >
                                {searchResult.length > 0 && (
                                    <div
                                        className={`header-search-overlay ${isOverlay ? 'active' : ''}`}
                                        onClick={handleCloseSearch}
                                    >
                                        {searchResult.length > 0 && (
                                            <List
                                                bordered
                                                className="list--search"
                                                dataSource={searchResult}
                                                renderItem={(item) => (
                                                    <List.Item
                                                        className="list--item"
                                                        onClick={(e) => handleItemClick(e, item)}
                                                    >
                                                        {item.WandName
                                                            ? `${item.WandName} , ${item.name_diachi}`
                                                            : item.name_diachi}
                                                    </List.Item>
                                                )}
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div
                        className="py-4"
                        style={{
                            height: '3vh',
                            background: '#262D34',
                            display: 'flex',
                            justifyContent: 'space-evenly',
                            alignItems: 'center',
                        }}
                    >
                        <NavLink to="/" className="nav-link">
                            <HomeIcon />
                        </NavLink>
                        <NavLink to="/notifications" className="nav-link">
                            <NotificationIcon />
                        </NavLink>
                        <NavLink to="/news" className="nav-link">
                            <NewsIcon />
                        </NavLink>
                        <NavLink to="/search" className="nav-link">
                            <SearchNavbarIcon />
                        </NavLink>
                        <NavLink to="/auctions" className="nav-link">
                            <ActionIcon />
                        </NavLink>
                        <NavLink to="/" className="nav-link">
                            <IoIosNotifications style={{ color: 'white' }} />
                        </NavLink>

                        {!isAuthenticated ? (
                            <button
                                className="text-[12px]"
                                style={{
                                    color: 'white',
                                    background: '#ff571a',
                                    borderRadius: '5px',
                                    border: '1px solid #ff571a',
                                }}
                                onClick={() => setIsShowModalLogin(true)}
                            >
                                Đăng nhập
                            </button>
                        ) : (
                            <Dropdown menu={{ items }} trigger={['click']}>
                                <button
                                    style={{ color: '#fff', cursor: 'pointer' }}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    <Space>
                                        <Avatar src={apiUser?.avatarLink || iconAvatar} />
                                        {apiUser?.FullName}
                                    </Space>
                                </button>
                            </Dropdown>
                        )}
                    </div>
                </>
            )}

            <ModalNotification show={isShowModalLogin} handleClose={handleClose} />
            <Modal
                footer={null}
                width={'50vw'}
                centered
                destroyOnClose
                onOk={handleOk}
                open={isModalOpen}
                onCancel={handleCancel}
                className="coin-upgrade-modal"
            >
                {isAuthenticated && userId && (
                    <>
                        <div className="coin-upgrade">
                            <Card title="Chọn gói dưới đây:" bordered={false}>
                                <List
                                    itemLayout="horizontal"
                                    dataSource={coinPackage}
                                    size="small"
                                    renderItem={(item, index) => (
                                        <List.Item
                                            onClick={() => handleSelectedCoinPackage(item, index)}
                                            className="coin-package-item"
                                        >
                                            <List.Item.Meta
                                                avatar={
                                                    coinPackageSelected === index ? (
                                                        <IoIosRadioButtonOn size={22} color="#19c719" />
                                                    ) : (
                                                        <IoIosRadioButtonOff size={22} />
                                                    )
                                                }
                                                title={<span>{item.package}</span>}
                                                description={toVndCurrency(item.cost)}
                                            />
                                        </List.Item>
                                    )}
                                />
                                <div className="deposit-coin-total-price">
                                    Tổng: <span>{toVndCurrency(totalPrice)}</span>
                                </div>
                            </Card>
                            <div className="coin-upgrade-checkout">
                                <Button
                                    type="primary"
                                    loading={isCheckoutLoading}
                                    disabled={isCheckoutLoading || isPayOsOpen}
                                    onClick={() => {
                                        if (coinPackageSelected) {
                                            handleGetPaymentLink(coinPackage[coinPackageSelected]);
                                        } else {
                                            handleGetPaymentLink(totalPrice);
                                        }
                                    }}
                                >
                                    Thanh toán
                                </Button>
                            </div>
                        </div>
                        <div id="embedded-payment-container"></div>
                    </>
                )}

                {(!isAuthenticated || !userId) && (
                    <div className="coin-upgrade-locked">
                        <span className="coin-upgrade-locked-message">Bạn vui lòng đăng nhập trước</span>
                        <div className="coin-upgrade-locked-wrapper-btn">
                            <Button
                                type="primary"
                                className="coin-upgrade-locked-wrapper-btn-signin"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>
                            <span className="coin-upgrade-locked-or">or</span>
                            <Button
                                type="dashed"
                                className="coin-upgrade-locked-wrapper-btn-signup"
                                onClick={() => navigate('/register')}
                            >
                                Đăng kí
                            </Button>
                        </div>
                        <div className="coin-upgrade-locked-forgot-password">
                            <Link to={'/forgotPassword'} className="vip-upgrade-locked-forgot-password-text">
                                Quên mật khẩu?
                            </Link>
                        </div>
                    </div>
                )}
            </Modal>
            <div id="embedded-payment-container"></div>
        </>
    );
};

export default memo(Header);
