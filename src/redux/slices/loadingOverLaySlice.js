import { createSlice } from '@reduxjs/toolkit';

const loadingOverLaySlice = createSlice({
  name: 'loadingOverlay',
  initialState: {
    isLoading: true,
  },
  reducers: {
    showLoadingOverlay: (state) => {
      state.isLoading = true;
    },
    hideLoadingOverlay: (state) => {
      state.isLoading = false;
    },
  },
});

export const { showLoadingOverlay, hideLoadingOverlay } = loadingOverLaySlice.actions;
export default loadingOverLaySlice.reducer;
