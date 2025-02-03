import { createSlice } from '@reduxjs/toolkit';
const initialState = false;

export const checkSearchSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        searchNews: (state, action) => {
            return true;
        },
        searchDefault: (state, action) => {
            return false;
        },
    },
});

export const { searchNews, searchDefault } = checkSearchSlice.actions;
export default checkSearchSlice.reducer;
