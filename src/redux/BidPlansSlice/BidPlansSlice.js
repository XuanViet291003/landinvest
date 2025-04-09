import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import {
    getAllLDistrictsInProvince,
    getAllProvinces,
    getBidPlansByDistrictApi as fetchBidPlansByDistrict,
    searchBidPlansByTextApi,
} from '../../services/api';

export const getAllProvincesApi = createAsyncThunk('api/getAllProvinces', async (_, { rejectWithValue }) => {
    try {
        const data = await getAllProvinces();
        console.log('API provinces:', data);
        if (!data.dulieu || !Array.isArray(data.dulieu)) {
            throw new Error('Dữ liệu tỉnh/thành phố không hợp lệ');
        }
        return data.dulieu;
    } catch (error) {
        return rejectWithValue(error.message || 'Failed to fetch provinces');
    }
});

export const getAllDistrictsInProvinceApi = createAsyncThunk(
    'api/getAllDistrictsInProvince',
    async (args, { rejectWithValue }) => {
        const id = args;
        try {
            const data = await getAllLDistrictsInProvince(id);
            if (!data.dulieu || !Array.isArray(data.dulieu)) {
                throw new Error('Dữ liệu quận/huyện không hợp lệ');
            }
            return data.dulieu;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch districts');
        }
    }
);

export const getBidPlansByDistrictApi = createAsyncThunk(
    'api/getBidPlansByDistrict',
    async (districtId, { rejectWithValue }) => {
        try {
            console.log('District ID:', districtId);
            const response = await fetchBidPlansByDistrict(districtId);
            if (!response) {
                throw new Error('Không nhận được phản hồi từ API');
            }
            if (!Array.isArray(response.data)) {
                throw new Error('Dữ liệu đấu thầu không hợp lệ');
            }
            return response.data;
        } catch (error) {
            console.log('Error fetching bid plans:', error.message);
            return rejectWithValue(error.message || 'Failed to fetch bid plans');
        }
    }
);

export const fetchBidPlansByTextApi = createAsyncThunk(
    'api/searchBidPlansByTextApi',
    async (searchText, { rejectWithValue }) => {
        try {
            const response = await searchBidPlansByTextApi(searchText);
            if (!response || !Array.isArray(response.data)) {
                throw new Error('Dữ liệu đấu thầu không hợp lệ');
            }
            return response.data;
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to search bid plans');
        }
    }
);

const initialState = {
    provinces: [],
    districts: [],
    bidPlans: [],
    status: {
        provinces: THUNK_API_STATUS.DEFAULT,
        districts: THUNK_API_STATUS.DEFAULT,
        bidPlans: THUNK_API_STATUS.DEFAULT,
    },
};

const bidPlansSlice = createSlice({
    name: 'bidPlans',
    initialState,
    reducers: {
        resetBidPlansState: (state) => {
            state.bidPlans = [];
            state.status.bidPlans = THUNK_API_STATUS.DEFAULT;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProvincesApi.pending, (state) => {
                state.status.provinces = THUNK_API_STATUS.PENDING;
            })
            .addCase(getAllProvincesApi.fulfilled, (state, action) => {
                state.provinces = action.payload;
                state.status.provinces = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllProvincesApi.rejected, (state) => {
                state.status.provinces = THUNK_API_STATUS.REJECTED;
            })
            .addCase(getAllDistrictsInProvinceApi.pending, (state) => {
                state.status.districts = THUNK_API_STATUS.PENDING;
            })
            .addCase(getAllDistrictsInProvinceApi.fulfilled, (state, action) => {
                state.districts = action.payload;
                state.status.districts = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllDistrictsInProvinceApi.rejected, (state) => {
                state.status.districts = THUNK_API_STATUS.REJECTED;
                state.districts = [];
            })
            .addCase(getBidPlansByDistrictApi.pending, (state) => {
                state.status.bidPlans = THUNK_API_STATUS.PENDING;
            })
            .addCase(getBidPlansByDistrictApi.fulfilled, (state, action) => {
                state.bidPlans = action.payload;
                state.status.bidPlans = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getBidPlansByDistrictApi.rejected, (state, action) => {
                console.log('Get bid plans rejected:', action.payload);
                state.status.bidPlans = THUNK_API_STATUS.REJECTED;
            })
            .addCase(fetchBidPlansByTextApi.pending, (state) => {
                state.status.bidPlans = THUNK_API_STATUS.PENDING;
            })
            .addCase(fetchBidPlansByTextApi.fulfilled, (state, action) => {
                state.bidPlans = action.payload;
                state.status.bidPlans = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(fetchBidPlansByTextApi.rejected, (state, action) => {
                console.log('Search bid plans rejected:', action.payload);
                state.status.bidPlans = THUNK_API_STATUS.REJECTED;
            });
    },
});

export const { resetBidPlansState } = bidPlansSlice.actions;

export default bidPlansSlice.reducer;