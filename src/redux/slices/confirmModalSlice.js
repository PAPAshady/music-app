import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpen: false,
  title: '',
  message: '',
  buttons: { confirm: true, cancel: false },
  buttonsClassNames: { confirm: '', cancel: '' },
  actionType: null,
};

const confirmModalSlice = createSlice({
  name: 'confirmModal',
  initialState,
  reducers: {
    setIsOpen(state, action) {
      state.isOpen = action.payload;
    },
    openModal(_, action) {
      const { title, message, actionType, ...rest } = action.payload;
      const validActionTypes = ['delete_playlist'];

      if (!title?.trim() || !message?.trim() || !actionType) {
        throw new Error("ConfirmModal requires 'title' and 'message' and 'actionType'.");
      }

      if (!validActionTypes.includes(actionType)) {
        throw new Error(
          `Invalid actionType "${actionType}" passed to confirmModalSlice. Valid types are: ${validActionTypes.join(', ')}.`
        );
      }

      // use initial values in case they're undefiend, and if they are not undefiend, overwrite them with ...rest
      return { ...initialState, isOpen: true, title, message, actionType, ...rest };
    },
    closeModal() {
      return initialState;
    },
  },
});

export const { openModal, closeModal, setIsOpen } = confirmModalSlice.actions;
export default confirmModalSlice.reducer;
