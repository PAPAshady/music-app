import { createSlice } from '@reduxjs/toolkit';

const mobileSearchPanelSlice = createSlice({
  name: 'mobileSearchPanel',
  initialState: {
    isOpen: true,
  },
  reducers: {
    openMobileSearchPanel: (state) => {
      state.isOpen = true;
    },
    closeMobileSearchPanel: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openMobileSearchPanel, closeMobileSearchPanel } = mobileSearchPanelSlice.actions;
export default mobileSearchPanelSlice.reducer;
