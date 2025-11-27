import { createSlice } from '@reduxjs/toolkit';

const mobileGenrePanelSlice = createSlice({
  name: 'mobileGenrePanel',
  initialState: {
    isOpen: false,
  },
  reducers: {
    openMobileGenrePanel: (state) => {
      state.isOpen = true;
    },
    closeMobileGenrePanel: (state) => {
      state.isOpen = false;
    },
    toggleMobileGenrePanel: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openMobileGenrePanel, closeMobileGenrePanel, toggleMobileGenrePanel } =
  mobileGenrePanelSlice.actions;
export default mobileGenrePanelSlice.reducer;
