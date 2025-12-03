import { createSlice } from '@reduxjs/toolkit';

const addSongToPlaylistMobilePanel = createSlice({
  name: 'addSongToPlaylistMobilePanel',
  initialState: {
    isOpen: false,
    selectedSongId: null,
  },
  reducers: {
    openAddSongToPlaylistMobilePanel(state, action) {
      state.selectedSongId = action.payload;
      state.isOpen = true;
    },
    closeAddSongToPlaylistMobilePanel(state) {
      state.selectedSongId = null;
      state.isOpen = false;
    },
  },
});

export const { openAddSongToPlaylistMobilePanel, closeAddSongToPlaylistMobilePanel } =
  addSongToPlaylistMobilePanel.actions;
export default addSongToPlaylistMobilePanel.reducer;
