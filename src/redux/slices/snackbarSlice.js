import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const showNewSnackbar = createAsyncThunk(
  'snackbars/showNewSnackbar',
  ({ message, type, hideDuration = 3000 }, { dispatch }) => {
    const id = crypto.randomUUID();
    dispatch(addNewSnackbar({ message, type, id }));
    setTimeout(() => dispatch(removeSnackbar(id)), hideDuration);
  }
);

const snackbarSlice = createSlice({
  name: 'snackbars',
  initialState: [], // a list of current visible snackbars
  reducers: {
    addNewSnackbar: (snackbars, action) => {
      snackbars.push({
        id: action.payload.id,
        message: action.payload.message,
        type: action.payload.type,
      });
    },
    removeSnackbar: (snackbars, action) => {
      return snackbars.filter((snackbar) => snackbar.id !== action.payload);
    },
    closeAllSnackbars: () => [],
  },
});

export const { addNewSnackbar, removeSnackbar, closeAllSnackbars } = snackbarSlice.actions;
export default snackbarSlice.reducer;
