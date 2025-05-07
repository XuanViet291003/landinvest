import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { THUNK_API_STATUS } from "../../constants/thunkApiStatus"
import {instance, thinkDiffus }from "../../utils/axios-customize"

const getLandUsePlan = createAsyncThunk('api/getLandUsePlan', async(arg,{rejectWithValue})=>{
    const {idDistrict} = arg
    try {
        const {data} = await instance.get(`/kehoach_sudung_dat_district/${idDistrict}/2025`)
        return data
    } catch (error) {
        rejectWithValue(error)
    }
})

const getLandUsePlan2 = createAsyncThunk('api/getLandUsePlan2', async (arg, { rejectWithValue }) => {
    const { idDistrict } = arg;
    try {
        const { data } = await thinkDiffus.get(`/dotbien-hatang/${idDistrict}.json`);
        return data;
    } catch (error) {
        return rejectWithValue(error);
    }
});


const initialState = {
    isDrawerOpen: false,
    LandUsePlan: null,
    statusLandUsePlan: THUNK_API_STATUS.DEFAULT,
    LandUsePlan2: null,
    statusLandUsePlan2: THUNK_API_STATUS.DEFAULT 
}

const landUsePlanSlice = createSlice({
    name: 'landUsePlan',
    initialState,
    reducers: {
        onChangeDrawer:(state, action)=>{
            state.isDrawerOpen = action.payload
        }
    },
    extraReducers: (builder)=>{
        builder.addCase(getLandUsePlan.pending, (state)=> {
            state.statusLandUsePlan = THUNK_API_STATUS.PENDING
        }).addCase(getLandUsePlan.fulfilled,(state, action)=>{
            state.LandUsePlan = action.payload
            state.statusLandUsePlan =  THUNK_API_STATUS.FULFILLED
        }).addCase(getLandUsePlan.rejected, (state)=>{
            state.LandUsePlan = null
            state.statusLandUsePlan = THUNK_API_STATUS.REJECTED
        })
        .addCase(getLandUsePlan2.pending, (state) => {
            state.statusLandUsePlan2 = THUNK_API_STATUS.PENDING;
        })
        .addCase(getLandUsePlan2.fulfilled, (state, action) => {
            state.LandUsePlan2 = action.payload;
            state.statusLandUsePlan2 = THUNK_API_STATUS.FULFILLED;
        })
        .addCase(getLandUsePlan2.rejected, (state) => {
            state.LandUsePlan2 = null;
            state.statusLandUsePlan2 = THUNK_API_STATUS.REJECTED;
        });
    }
})
export { getLandUsePlan, getLandUsePlan2 };
export const { onChangeDrawer } = landUsePlanSlice.actions;
const landUsePlan = landUsePlanSlice.reducer;
export default landUsePlan;