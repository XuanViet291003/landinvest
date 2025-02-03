import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import accountReducer from '../redux/account/accountSlice';
import allPlansByProvinceSlice from './apiCache/allPlansByProvinceSlice';
import treePlans from './apiCache/treePlans';
import boundingboxReducer from './boundingMarkerBoxSlice/boundingMarkerBoxSlice';
import filterReducer from './filter/filterSlice';
import filterSliceTable from './filterSliceTable/filterSliceTable';
import listGroupReducer from './getId/getIDSlice';
import getQuyHoachSliceReducer from './getQuyHoach/getQuyHoachSlice';
import listBoxReducer from './listForum/lisForumSlice';
import listMarkerReducer from './listMarker/listMarkerSllice';
import locationReducer from './LocationSlice/locationSlice';
import planMapReducer from './planMap/planMapSlice';
import plansSelected from './plansSelected/plansSelected';
import { planTableExtend } from './planTableExtend/planTableExtend';
import setPolygonsReducer from './polygonSlice/polygonSlice';
import searchQueryReducer from './search/searchSlice';
// import baseApi from './apis/baseApi';
import allPlannings from './AllPlansSlice/AllPlansSlice';
import landAuctions from './LandAuctions/landAuctions';
import landBidding from './landBiddingSlice/landBiddingSlice';
import landCost from './landCostSlice/landCostSlice';
import listRegulationReducer from './ListRegulations/ListRegulationsSlice';
import mapLayer from './mapLayer/mapLayerSlice';
import checkSearchReducer from './checkSearch/checkSearchSlice';
import landUsePlan from './landUsePlanSlice/lanUsePlanSlice';
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    blacklist: [
        'plansSelected',
        'treePlans',
        'boundingboxSlice',
        'listRegulationsSlice',
        'searchQuery',
        'landAuctions',
        'checkSearchReducer',
    ],
};

const rootReducer = combineReducers({
    // [baseApi.reducerPath]: baseApi.reducer,
    account: accountReducer,
    listbox: listBoxReducer,
    getid: listGroupReducer,
    getquyhoach: getQuyHoachSliceReducer,
    searchQuery: searchQueryReducer,
    filter: filterReducer,
    map: planMapReducer,
    listMarker: listMarkerReducer,
    polygonsStore: setPolygonsReducer,
    filterSliceTable: filterSliceTable.reducer,
    planTableExtend: planTableExtend.reducer,
    plansSelected: plansSelected.reducer,
    treePlans: treePlans,
    allPlansByProvinceSlice: allPlansByProvinceSlice,
    boundingboxSlice: boundingboxReducer,
    locationSlice: locationReducer,
    listRegulationsSlice: listRegulationReducer,
    allPlannings,
    mapLayer,
    landCost,
    landBidding,
    landUsePlan,
    landAuctions,
    checkSearch: checkSearchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});

const persistor = persistStore(store);

export { persistor, store };
