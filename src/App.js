import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, RouterProvider, createBrowserRouter, useLocation } from 'react-router-dom';
import './App.scss';
import Auction from './components/Auction/Auction';
import AuctionDetail from './components/Auction/AuctionDetail/AuctionDetail.jsx';
import AuctionsList from './components/Auction/AuctionsList.jsx';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import BoxNews from './components/News/BoxNews/index.jsx';
import HotNews from './components/News/categorizeNews/HotNews';
import LatestNews from './components/News/categorizeNews/LatestNews';
import GroupNews from './components/News/GroupNews/index.jsx';
import News from './components/News/News';
import PostNews from './components/News/PostNews/index.jsx';
import NotFound from './components/NotFound';
import Detail from './components/Notification/Detail/Detail.js';
import Notification from './components/Notification/Notification';
import VipUpgrade from './components/VipUpgrade/VipUpgrade.jsx';
import './index.css';
import AdminPage from './pages/Admin/Dashboard';
import LayoutAdmin from './pages/Admin/LayoutAdmin';
import TableBox from './pages/Admin/ListBox';
import TableGroup from './pages/Admin/ListGroup';
import TablePost from './pages/Admin/ListPost';
import TableUser from './pages/Admin/ListUser';
import BiddingPage from './pages/Bidding/Bidding.jsx';
import DetailBidding from './pages/Bidding/DetailBidding/DetailBidding.jsx';
import Checkout from './pages/Payment/Checkout.jsx';
import OrderCanceled from './pages/Payment/OrderCanceled.jsx';
import OrderSuccess from './pages/Payment/OrderSuccess.jsx';
import Profile from './pages/ProfileUser/Profile';
import './styles/boundingboxDataList.scss';
import './styles/checkout.scss';
import './styles/coin.scss';
import './styles/landCost.scss';
import './styles/landTable.scss';
import './styles/listRegulation.scss';
import './styles/map.scss';
import './styles/landTable.scss';
import './styles/landAdministration.scss';
import ListPostUser from './components/News/ListPostUser/index.jsx';
import Follow from './components/News/categorizeNews/Follow.jsx';
import SearchNews from './components/News/SearchNews/index.jsx';
import Procurement from './pages/Bidding/Procurement/Procurement.jsx';
import DetailProcurement from './pages/Bidding/Procurement/DetailProcurement/DetailProcurement.jsx';
import 'reactjs-windows/dist/index.css';
import LandCost from './pages/LandCost/LandCost.jsx';
import 'reactjs-windows/dist/index.css';
import LandUsePlan from './pages/LandPlan/LandUsePlan.jsx';
import LandUsePlanDetail from './pages/LandPlan/LandPlanDetail/LandPlanDetail.jsx';
import AboutUs from './pages/AboutUs/AboutUs.jsx';
import AdministrativeMap from './pages/AdministrativeMap/AdministrativeMap.jsx';
import DetailAdministrativeMap from './pages/AdministrativeMap/DetailAdministrativeMap/DetailAdministrativeMap.jsx';
const Layout = () => {
    return (
        <div className="App" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
            <div className="app-header">
                <Header />
            </div>

            <div className="app-content">
                <Outlet />
            </div>

            {/* <Ads /> */}
        </div>
    );
};

const AppRoutes = ({ onLocationChange }) => {
    const location = useLocation();

    useEffect(() => {
        if (onLocationChange) {
            onLocationChange(location.pathname);
        }
    }, [location, onLocationChange]);

    return null;
};

function App() {
    const datauser = useSelector((state) => state.account.dataUser);
    const item = [
        {
            path: '/',
            element: <Layout />,
            // errorElement: <NotFound />,
            // eslint-disable-next-line no-sparse-arrays
            children: [
                {
                    index: true,
                    element: <Home />,
                },
                {
                    path: '/about-us',
                    element: <AboutUs />,
                },
                {
                    path: '/:name',
                    element: <Home />,
                },
                {
                    path: '/list_all_du_an',
                    element: <Notification />,
                },
                {
                    path: '/detail_du_an/:projectId',
                    element: <Detail />,
                },
                {
                    path: '/news',
                    element: <News />,
                    children: [
                        {
                            index: true,
                            element: <BoxNews />,
                        },
                        {
                            path: 'group/:id',
                            element: <GroupNews />,
                        },
                        {
                            path: 'group/post/:id',
                            element: <PostNews />,
                        },
                        {
                            path: 'list-post/:id/:username',
                            element: <ListPostUser />,
                        },
                        {
                            path: 'latest',
                            element: <LatestNews />,
                        },
                        {
                            path: 'hot',
                            element: <HotNews />,
                        },
                        {
                            path: 'follow',
                            element: <Follow />,
                        },
                        {
                            path: 'search-news/:key',
                            element: <SearchNews />,
                        },
                    ],
                },
                {
                    path: '/auctions',
                    element: <Auction />,
                },

                {
                    path: '/landuseplan',
                    element: <LandUsePlan />,
                },
                {
                    path: '/landuseplan/:id',
                    element: <LandUsePlanDetail />,
                },
                {
                    path: 'auctions/:id',
                    element: <AuctionDetail />,
                },
                {
                    path: '/bidding',
                    element: <BiddingPage />,
                },
                {
                    path: '/bidding/procurement',
                    element: <Procurement />,
                },
                {
                    path: '/bidding/procurement/:id',
                    element: <DetailProcurement />,
                },
                {
                    path: '/biddingdetail/:id',
                    element: <DetailBidding />,
                },
                {
                    path: '/userprofile',
                    element: <Profile />,
                },
                ,
                {
                    path: '/vipupgrade',
                    element: <VipUpgrade />,
                },
                {
                    path: '/instruction',
                    element: <Home />,
                },
                {
                    path: '/test',
                    element: <AuctionsList />,
                },
                {
                    path: '/checkout',
                    element: <Checkout />,
                },
                {
                    path: '/order-success',
                    element: <OrderSuccess />,
                },
                {
                    path: '/order-canceled',
                    element: <OrderCanceled />,
                },
                {
                    path: '/land-cost',
                    element: <LandCost />,
                },
                {
                  path: '/administrative-maps',
                  element: <AdministrativeMap />
                },
                {
                  path: '/administrative-maps/:id',
                  element: <DetailAdministrativeMap />
                },
            ],
        },
        {
            path: '/login',
            element: <Login />,
        },
        {
            path: '/register',
            element: <Register />,
        },

        {
            path: '/forgotPassword',
            element: <ForgotPassword />,
        },
    ];

    if (datauser?.role === true) {
        item.unshift({
            path: '/admin',
            element: <LayoutAdmin />,
            errorElement: <NotFound />,
            children: [
                {
                    index: true,
                    element: <AdminPage />,
                },
                {
                    path: '/admin/listbox',
                    element: <TableBox />,
                },
                {
                    path: '/admin/listgroup',
                    element: <TableGroup />,
                },
                {
                    path: '/admin/listpost',
                    element: <TablePost />,
                },
                {
                    path: '/admin/listuser',
                    element: <TableUser />,
                },
            ],
        });
    }

    const router = createBrowserRouter(item);

    const handleLocationChange = (path) => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: path,
                page_title: document.title,
            });
        }
    };
    return (
        <>
            <RouterProvider router={router}>
                <AppRoutes onLocationChange={handleLocationChange} />
            </RouterProvider>
        </>
    );
}

export default App;
