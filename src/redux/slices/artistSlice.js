import { createSlice } from '@reduxjs/toolkit';

const artistSlice = createSlice({
  name: 'artistSlice',
  initialState: null,
  reducers: {
    setSelectedArtist(_, action) {
      return action.payload;
    },
  },
});

export const { setSelectedArtist } = artistSlice.actions;
export default artistSlice.reducer;
