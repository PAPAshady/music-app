import { createSlice } from '@reduxjs/toolkit';

const addSongToPlaylistSlice = createSlice({
  name: 'addSongToPlaylist',
  initialState: {
    isDropDownOpen: false,
    isMobilePanelOpen: false,
    selectedSongId: null,
    position: { left: 0, top: 0 },
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
    setPosition(state, action) {
      state.position = action.payload;
    },
    toggleDropDown(state, action) {
      state.isDropDownOpen = !state.isDropDownOpen;
      state.selectedSongId = action.payload ?? null;
    },
  },
});

export const {
  openDropDown,
  closeDropDown,
  openMobilePanel,
  closeMobilePanel,
  setPosition,
  toggleDropDown,
} = addSongToPlaylistSlice.actions;
export default addSongToPlaylistSlice.reducer;
