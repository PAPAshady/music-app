import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const setQueries = createAsyncThunk('queryState/setQuery', (newQueries, { dispatch }) => {
  const params = new URLSearchParams(window.location.search);

  for (const [key, value] of Object.entries(newQueries)) {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  }
  dispatch(bindQueries(Object.fromEntries(params.entries())));
});

const queryStateSlice = createSlice({
  name: 'queryState',
  initialState: Object.fromEntries(new URLSearchParams(window.location.search).entries()),
  reducers: {
    bindQueries: (_, action) => {
      return action.payload;
    },
  },
});

export default queryStateSlice.reducer;
export const { bindQueries } = queryStateSlice.actions;
