import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  title: '',
  actionType: null,
};

const playlistInfosModalSlice = createSlice({
  name: 'playlistInfosModal',
  initialState,
  reducers: {
    openModal: (state, action) => {
      const validActionsTypes = [null, 'create_playlist', 'edit_playlist'];

      if (!validActionsTypes.includes(action.payload.actionType)) {
        throw new Error(
          `Invalid actionType "${action.payload.actionType}" passed to playlistInfosModalSlice. Valid types are: ${validActionsTypes.join(', ')}.`
        );
      }

      state.isOpen = true;
      state.title = action.payload.title;
      state.actionType = action.payload.actionType;
    },
    closeModal: (state) => {
      state.isOpen = false;
      state.title = '';
      state.actionType = null;
    },
  },
});

export const { openModal, closeModal } = playlistInfosModalSlice.actions;
export default playlistInfosModalSlice.reducer;
