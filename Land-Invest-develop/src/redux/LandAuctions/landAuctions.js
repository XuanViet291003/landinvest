import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TAB_KEYS } from '../../constants/LandAuctionKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import { getAllLandAutions, searchLandAutions } from '../../services/api';

const getLandAuctionsInfoApi = createAsyncThunk('api/getAllLandAuctions', async (args, { rejectWithValue }) => {
    try {
        const { page } = args;

        const res = await getAllLandAutions(page);
        return res;
    } catch (error) {
        rejectWithValue(error);
    }
});
const searchLandAuctionsInfoApi = createAsyncThunk('api/searchLandAuctions', async (args, { rejectWithValue }) => {
    try {
        const { page, formData } = args;
        const res = await searchLandAutions(formData, page);
        return res || [];
    } catch (error) {
        rejectWithValue(error);
    }
});

const initialState = {
    allLandAuctions: [],
    status: THUNK_API_STATUS.DEFAULT,
    page: 1,
    tabKey: TAB_KEYS.ALL,
    totalPage: 0,
    totalDocs: 0,
    limit: 50,
};

const landAuctionsSlice = createSlice({
    name: 'landAuctions',
    initialState,
    reducers: {
        setCurrentPage: (state, action) => {
            state.page = action.payload;
        },
        setTabKey: (state, action) => {
            state.tabKey = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLandAuctionsInfoApi.pending, (state) => {
                state.status = THUNK_API_STATUS.PENDING;
            })
            .addCase(getLandAuctionsInfoApi.fulfilled, (state, action) => {
                state.status = THUNK_API_STATUS.FULFILLED;
                state.allLandAuctions = action.payload.data;
                state.totalPage = Math.ceil(action.payload.total_page);
                state.limit = Math.ceil(action.payload.number_item);
            })
            .addCase(getLandAuctionsInfoApi.rejected, (state) => {
                state.status = THUNK_API_STATUS.REJECTED;
            })
            .addCase(searchLandAuctionsInfoApi.pending, (state) => {
                state.status = THUNK_API_STATUS.PENDING;
            })
            .addCase(searchLandAuctionsInfoApi.fulfilled, (state, action) => {
                state.status = THUNK_API_STATUS.FULFILLED;
                state.allLandAuctions = action.payload?.data || [];
                state.totalPage = Math.ceil(action.payload.total_page);
                state.totalDocs = action.payload.total_item;
                state.limit = action.payload.limit;
            })
            .addCase(searchLandAuctionsInfoApi.rejected, (state) => {
                state.status = THUNK_API_STATUS.REJECTED;
            });
    },
});

export { getLandAuctionsInfoApi, searchLandAuctionsInfoApi };
export const { setCurrentPage, setTabKey } = landAuctionsSlice.actions;
const landAuctions = landAuctionsSlice.reducer;

export default landAuctions;
