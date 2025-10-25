import { createSlice } from '@reduxjs/toolkit';

const playerPanelSlice = createSlice({
  name: 'playerPanel',
  initialState: { isOpen: false },
  reducers: {
    openPanel: (state) => {
      state.isOpen = true;
    },
    closePanel: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openPanel, closePanel } = playerPanelSlice.actions;
export default playerPanelSlice.reducer;
