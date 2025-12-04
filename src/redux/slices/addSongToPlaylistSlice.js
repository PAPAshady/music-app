import { createSlice } from '@reduxjs/toolkit';

const addSongToPlaylistSlice = createSlice({
  name: 'addSongToPlaylist',
  initialState: {
    isDropDownOpen: false,
    isMobilePanelOpen: false,
    selectedSongId: null,
  },
  reducers: {
    openDropDown(state, action) {
      state.isDropDownOpen = true;
      state.selectedSongId = action.payload;
    },
    closeDropDown(state) {
      state.isDropDownOpen = false;
      state.selectedSongId = null;
    },
    openMobilePanel(state, action) {
      state.isMobilePanelOpen = true;
      state.selectedSongId = action.payload;
    },
    closeMobilePanel(state) {
      state.isMobilePanelOpen = false;
      state.selectedSongId = null;
    },
  },
});

export const { openDropDown, closeDropDown, openMobilePanel, closeMobilePanel } =
  addSongToPlaylistSlice.actions;
export default addSongToPlaylistSlice.reducer;
