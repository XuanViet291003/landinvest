import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { HashRouter, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import 'reactjs-windows/dist/index.css';
import './App.scss';
import './index.css';
import './styles/boundingboxDataList.scss';
import './styles/checkout.scss';
import './styles/coin.scss';
import './styles/landAdministration.scss';
import './styles/landCost.scss';
import './styles/BidPlans.scss';
import './styles/landTable.scss';
import './styles/listRegulation.scss';
import './styles/map.scss';

import Header from './components/Header/Header';
import Home from './components/Home/Home';
import NotFound from './components/NotFound';
import Login from './components/Auth/Login/Login';
import Register from './components/Auth/Register/Register';
import ForgotPassword from './components/Auth/ForgotPassword/ForgotPassword';

import News from './components/News/News';
import BoxNews from './components/News/BoxNews';
import GroupNews from './components/News/GroupNews';
import PostNews from './components/News/PostNews';
import ListPostUser from './components/News/ListPostUser';
import LatestNews from './components/News/categorizeNews/LatestNews';
import HotNews from './components/News/categorizeNews/HotNews';
import Follow from './components/News/categorizeNews/Follow';
import SearchNews from './components/News/SearchNews';

import Auction from './components/Auction/Auction';
import AuctionDetail from './components/Auction/AuctionDetail/AuctionDetail';
import AuctionsList from './components/Auction/AuctionsList';

import Notification from './components/Notification/Notification';
import Detail from './components/Notification/Detail/Detail';

import VipUpgrade from './components/VipUpgrade/VipUpgrade';
import AboutUs from './pages/AboutUs/AboutUs';
import ThinkDiff from './pages/ThinkDiff/ThinkDiff';

import LayoutAdmin from './pages/Admin/LayoutAdmin';
import AdminPage from './pages/Admin/Dashboard';
import TableBox from './pages/Admin/ListBox';
import TableGroup from './pages/Admin/ListGroup';
import TablePost from './pages/Admin/ListPost';
import TableUser from './pages/Admin/ListUser';

import BiddingPage from './pages/Bidding/Bidding';
import DetailBidding from './pages/Bidding/DetailBidding/DetailBidding';
import Procurement from './pages/Bidding/Procurement/Procurement';
import DetailProcurement from './pages/Bidding/Procurement/DetailProcurement/DetailProcurement';

import LandUsePlan from './pages/LandPlan/LandUsePlan';
import LandUsePlanDetail from './pages/LandPlan/LandPlanDetail/LandPlanDetail';
import LandCost from './pages/LandCost/LandCost';
import BidPlans from './pages/BidPlans/BidPlans';

import AdministrativeMap from './pages/AdministrativeMap/AdministrativeMap';
import DetailAdministrativeMap from './pages/AdministrativeMap/DetailAdministrativeMap/DetailAdministrativeMap';

import Checkout from './pages/Payment/Checkout';
import OrderSuccess from './pages/Payment/OrderSuccess';
import OrderCanceled from './pages/Payment/OrderCanceled';

import Profile from './pages/ProfileUser/Profile';
import LoginUserPage from './pages/LoginUser/LoginUser';
import Investor from './pages/Investor/Investor';
import DetailInvestor from './pages/Investor/DetailInvestor/DetailInvestor';
import ProFileNews from './pages/ProfileNews';

const Layout = () => (
    <div className="App" style={{ position: 'relative', height: '100vh', width: '100%', overflow: 'hidden' }}>
        <div className="app-header">
            <Header />
        </div>
        <div className="app-content">
            <Outlet />
        </div>
    </div>
);

const AppRoutes = () => {
    const location = useLocation();

    useEffect(() => {
        if (window.gtag) {
            window.gtag('event', 'page_view', {
                page_path: location.pathname,
                page_title: document.title,
            });
        }
    }, [location]);

    return null;
};

function App() {
    const datauser = useSelector((state) => state.account.dataUser);

    return (
        <HashRouter>
            <AppRoutes />
            <Routes>
                {/* Admin routes */}
                {datauser?.role === true && (
                    <Route path="/admin" element={<LayoutAdmin />}>
                        <Route index element={<AdminPage />} />
                        <Route path="listbox" element={<TableBox />} />
                        <Route path="listgroup" element={<TableGroup />} />
                        <Route path="listpost" element={<TablePost />} />
                        <Route path="listuser" element={<TableUser />} />
                    </Route>
                )}

                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="about-us" element={<AboutUs />} />
                    <Route path=":name" element={<Home />} />

                    <Route path="list_all_du_an" element={<Notification />} />
                    <Route path="detail_du_an/:projectId" element={<Detail />} />
                    <Route path="profile/:id" element={<ProFileNews />} />

                    <Route path="news" element={<News />}>
                        <Route index element={<BoxNews />} />
                        <Route path="group/:id" element={<GroupNews />} />
                        <Route path="group/post/:id" element={<PostNews />} />
                        <Route path="list-post/:id/:username" element={<ListPostUser />} />
                        <Route path="latest" element={<LatestNews />} />
                        <Route path="hot" element={<HotNews />} />
                        <Route path="follow" element={<Follow />} />
                        <Route path="search-news/:key" element={<SearchNews />} />
                    </Route>

                    <Route path="auctions" element={<Auction />} />
                    <Route path="auctions/:id" element={<AuctionDetail />} />
                    <Route path="test" element={<AuctionsList />} />

                    <Route path="landuseplan" element={<LandUsePlan />} />
                    <Route path="landuseplan/:id" element={<LandUsePlanDetail />} />

                    <Route path="bidding" element={<BiddingPage />} />
                    <Route path="bidding/procurement" element={<Procurement />} />
                    <Route path="bidding/procurement/:id" element={<DetailProcurement />} />
                    <Route path="biddingdetail/:id" element={<DetailBidding />} />

                    <Route path="userprofile" element={<Profile />} />
                    <Route path="vipupgrade" element={<VipUpgrade />} />
                    <Route path="instruction" element={<Home />} />

                    <Route path="checkout" element={<Checkout />} />
                    <Route path="order-success" element={<OrderSuccess />} />
                    <Route path="order-canceled" element={<OrderCanceled />} />

                    <Route path="land-cost" element={<LandCost />} />
                    <Route path="bid-plans" element={<BidPlans />} />

                    <Route path="administrative-maps" element={<AdministrativeMap />} />
                    <Route path="administrative-maps/:id" element={<DetailAdministrativeMap />} />

                    <Route path="investor" element={<Investor />} />
                    <Route path="investor/:orgCode" element={<DetailInvestor />} />
                    <Route path="login-user" element={<LoginUserPage />} />
                </Route>

                {/* Auth & other pages */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgotPassword" element={<ForgotPassword />} />
                <Route path="/thinkdiff" element={<ThinkDiff />} />

                {/* 404 fallback */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </HashRouter>
    );
}

export default App;
