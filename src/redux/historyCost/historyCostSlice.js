import { createSlice } from '@reduxjs/toolkit';

const persistedHistoryCost = localStorage.getItem('history-cost');
const initialState = {
  value: persistedHistoryCost !== null ? JSON.parse(persistedHistoryCost) : true, 
};

const historyCostSlice = createSlice({
  name: 'historyCost',
  initialState,
  reducers: {
    toggleHistoryCost: (state) => {
      state.value = !state.value;
      localStorage.setItem("history-cost", JSON.stringify(state.value));
    },
    setHistoryCost: (state, action) => {
      state.value = action.payload;
      localStorage.setItem("history-cost", JSON.stringify(action.payload));
    },
  },
});

export const { toggleHistoryCost, setHistoryCost } = historyCostSlice.actions;
export default historyCostSlice.reducer;