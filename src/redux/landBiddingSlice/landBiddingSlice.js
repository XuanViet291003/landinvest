import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import instance from '../../utils/axios-customize';

const getLandBiddingApi = createAsyncThunk('api/getLandBidding', async (args, { rejectWithValue }) => {
    const { currentPage, idDistrict, searchText } = args;
    const formdata = new FormData();
    const fields = {
        text_search: searchText,
        idDistrict: idDistrict,
        limit: 15
    };
    Object.entries(fields).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value.length !== 0) {
            formdata.append(key, value);
        }
    });
    try {
        const { data } = await instance.post(`/timkiem_dauthau?page=${currentPage}`, formdata);
        return { data, currentPage };
    } catch (error) {
        rejectWithValue(error);
    }
});

const initialState = {
    landBidding: {
        docs: [],
        currentPage: 1,
        totalPage: 1,
        totalDocs: 0,
        limit: 10,
    },
    landBiddingStatus: THUNK_API_STATUS.DEFAULT,
};

const landBiddingSlice = createSlice({
    name: 'landBidding',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getLandBiddingApi.pending, (state) => {
                state.landBiddingStatus = THUNK_API_STATUS.PENDING;
            })
            .addCase(getLandBiddingApi.fulfilled, (state, action) => {
                console.log(action.payload.data)
                const totalPage = Math.ceil(action.payload.data.dauthau_info.total_page);
                const totalDocs = totalPage * action.payload.data.dauthau_info.data.length;
                const currentPage = action.payload.currentPage;
                state.landBidding = {
                    docs: action.payload.data.dauthau_info.data,
                    currentPage,
                    totalPage,
                    totalDocs,
                    limit: 10,
                };
                state.landBiddingStatus = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getLandBiddingApi.rejected, (state) => {
                state.landBiddingStatus = THUNK_API_STATUS.REJECTED;
            });
    },
});
export { getLandBiddingApi };
const landBidding = landBiddingSlice.reducer;
export default landBidding;
