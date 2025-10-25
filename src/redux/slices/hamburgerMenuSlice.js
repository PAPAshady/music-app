import { createSlice } from '@reduxjs/toolkit';

const hamburgerMenuSlice = createSlice({
  name: 'hamburgerMenu',
  initialState: { isOpen: false },
  reducers: {
    setIsHamburgerMenuOpen: (state, action) => {
      state.isOpen = action.payload; // payload must always be a boolean value.
    },
  },
});

export const { setIsHamburgerMenuOpen } = hamburgerMenuSlice.actions;
export default hamburgerMenuSlice.reducer;