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
    togglePanel: (state) => {
      console.log(33);
      state.isOpen = !state.isOpen;
    },
  },
});

export const { openPanel, closePanel, togglePanel } = playerPanelSlice.actions;
export default playerPanelSlice.reducer;
