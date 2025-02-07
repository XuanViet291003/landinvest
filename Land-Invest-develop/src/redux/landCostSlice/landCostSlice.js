import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { LAND_COST_KEY } from '../../constants/LandCostKey';
import { THUNK_API_STATUS } from '../../constants/thunkApiStatus';
import {
    getAllLandCost,
    getAllLandCostInDistrict,
    getAllLandCostInLocality,
    getAllLandCostInProvince,
    getAllLDistrictsInProvince,
    getAllLocalitiesInDistrict,
    getAllProvinces,
    getDistrictAndProvinceByLocation,
    getLocationInBoudingBox,
} from '../../services/api';

const getAllProvincesApi = createAsyncThunk('api/getAllProvinces', async (_, { rejectWithValue }) => {
    try {
        const data = await getAllProvinces();
        return data.dulieu;
    } catch (error) {
        rejectWithValue(error);
    }
});

const getAllLandCostApi = createAsyncThunk('api/getAllLandCost', async (args, { rejectWithValue }) => {
    const { id, type } = args;
    try {
        switch (type) {
            case LAND_COST_KEY.PROVINCE:
                const provinces = await getAllLandCostInProvince(id);
                return provinces.dulieu;
            case LAND_COST_KEY.DISTRICT:
                const districts = await getAllLandCostInDistrict(id);
                return districts.dulieu;
            case LAND_COST_KEY.LOCALITY:
                const localities = await getAllLandCostInLocality(id);
                return localities.dulieu;
            default:
                const data = await getAllLandCost();
                return data.dulieu;
        }
    } catch (error) {
        rejectWithValue(error);
    }
});
const getAllDistrictsInProvinceApi = createAsyncThunk(
    'api/getAllDistrictsInProvince',
    async (args, { rejectWithValue }) => {
        const id = args;
        try {
            const data = await getAllLDistrictsInProvince(id);
            return data.dulieu;
        } catch (error) {
            rejectWithValue(error);
        }
    },
);
const getAllLocalitiesInDistrictApi = createAsyncThunk(
    'api/getAllLocalitiesInDistrict',
    async (args, { rejectWithValue }) => {
        const id = args;

        try {
            const data = await getAllLocalitiesInDistrict(id);

            return data.dulieu;
        } catch (error) {
            rejectWithValue(error);
        }
    },
);

const getDistrictIdApi = createAsyncThunk('api/getDistrictId', async (args, { rejectWithValue }) => {
    const { lat, lng } = args;
    try {
        const data = await getLocationInBoudingBox(lat, lng);
        return {
            province: data.provinces,
            district: data.district,
            quyhoach: data.quyhoach,
        };
    } catch (error) {
        rejectWithValue(error);
    }
});

// districtId, provinceId,location nên được tách riêng ra để sử dụng
const initialState = {
    allProvinces: [],
    allLandCost: [],
    allDistricts: [],
    allLocalities: [],
    districtId: 0,
    provinceId: 0,
    location: {
        lat: 0,
        lng: 0,
    },
    page: 1,
    pageSize: 5,
    filterSelected: {
        province: null,
        district: null,
        locality: null,
    },
    provincesStatus: THUNK_API_STATUS.DEFAULT,
    allLandCostStatus: THUNK_API_STATUS.DEFAULT,
    allDistrictsStatus: THUNK_API_STATUS.DEFAULT,
    allLocalitiesStatus: THUNK_API_STATUS.DEFAULT,
};

const landCostSlice = createSlice({
    name: 'landCost',
    initialState,
    reducers: {
        resetData: (state, action) => {
            const { type } = action.payload;
            state.allLocalities = [];
            switch (type) {
                case LAND_COST_KEY.DISTRICT:
                    state.allDistricts = [];
                    break;
                case LAND_COST_KEY.LOCALITY:
                    state.allLocalities = [];
                    break;
                default:
                    state.allDistricts = [];
                    state.allLocalities = [];
                    break;
            }
        },
        setCurrentPage: (state, action) => {
            state.page = action.payload;
        },
        setCurrentPageSize: (state, action) => {
            state.pageSize = action.payload;
        },
        setFilterSeletecd: (state, action) => {
            state.filterSelected = { ...state.filterSelected, ...action.payload };
        },
        setAllLandCost: (state, action) => {
            state.allLandCost = action.payload;
        },
        setDistrictId: (state, action) => {
            state.districtId = action.payload;
        },
        setProvinceId: (state, action) => {
            if (state.provinceId !== action.payload) {
                state.districtId = "";
            }
            state.provinceId = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAllProvincesApi.pending, (state) => {
                state.provincesStatus = THUNK_API_STATUS.PENDING;
            })
            .addCase(getAllProvincesApi.fulfilled, (state, action) => {
                state.allProvinces = action.payload;
                state.provincesStatus = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllProvincesApi.rejected, (state) => {
                state.provincesStatus = THUNK_API_STATUS.REJECTED;
            })
            .addCase(getAllLandCostApi.pending, (state) => {
                state.allLandCostStatus = THUNK_API_STATUS.PENDING;
            })
            .addCase(getAllLandCostApi.fulfilled, (state, action) => {
                state.allLandCost = action.payload;
                state.allLandCostStatus = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllLandCostApi.rejected, (state) => {
                state.allLandCostStatus = THUNK_API_STATUS.REJECTED;
            })
            .addCase(getAllDistrictsInProvinceApi.pending, (state) => {
                state.allDistrictsStatus = THUNK_API_STATUS.PENDING;
            })
            .addCase(getAllDistrictsInProvinceApi.fulfilled, (state, action) => {
                state.allDistricts = action.payload;
                state.allDistrictsStatus = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllDistrictsInProvinceApi.rejected, (state) => {
                state.allDistrictsStatus = THUNK_API_STATUS.REJECTED;
            })
            .addCase(getAllLocalitiesInDistrictApi.pending, (state) => {
                state.allLocalitiesStatus = THUNK_API_STATUS.PENDING;
                state.allLocalities = [];
            })
            .addCase(getAllLocalitiesInDistrictApi.fulfilled, (state, action) => {
                state.allLocalities = action.payload;
                state.allLocalitiesStatus = THUNK_API_STATUS.FULFILLED;
            })
            .addCase(getAllLocalitiesInDistrictApi.rejected, (state) => {
                state.allLocalitiesStatus = THUNK_API_STATUS.REJECTED;
            })
            .addCase(getDistrictIdApi.pending, (state) => {})
            .addCase(getDistrictIdApi.fulfilled, (state, action) => {
                const location = action.payload?.quyhoach?.map((item) => item.boundingbox.split(','));
                state.districtId = action.payload.district;
                state.provinceId = action.payload.province;

                if (location) {
                    let minLat = 0;
                    let maxLat = 0;
                    let minLng = 0;
                    let maxLng = 0;
                    const everage = location.length * 2;

                    location.forEach((item) => {
                        minLat += Number(item[1]);
                        maxLat += Number(item[3]);
                        minLng += Number(item[0]);
                        maxLng += Number(item[2]);
                    });

                    const lat = (minLat + maxLat) / everage;
                    const lng = (minLng + maxLng) / everage;
                    state.location = { lat, lng };
                }
            })
            .addCase(getDistrictIdApi.rejected, (state) => {});
    },
});

export {
    getAllDistrictsInProvinceApi,
    getAllLandCostApi,
    getAllLocalitiesInDistrictApi,
    getAllProvincesApi,
    getDistrictIdApi,
};

export const {
    resetData,
    setCurrentPage,
    setFilterSeletecd,
    setCurrentPageSize,
    setAllLandCost,
    setDistrictId,
    setProvinceId,
} = landCostSlice.actions;
const landCost = landCostSlice.reducer;

export default landCost;
