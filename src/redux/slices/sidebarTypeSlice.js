import { createSlice } from '@reduxjs/toolkit';

const validSidebarPanelTypes = ['welcome_panel', 'tracklist_panel', 'artist_panel'];

const sidebarPanelTypeSlice = createSlice({
  name: 'sidebarType',
  initialState: 'welcome_panel',
  reducers: {
    setSidebarPanelType(_, action) {
      if (!validSidebarPanelTypes.includes(action.payload)) {
        throw new Error(
          `Invalid sidebarType "${action.payload}" passed to sidebarTypeSlice. Valid types are: ${validSidebarPanelTypes.join(', ')}.`
        );
      }
      return action.payload;
    },
  },
});

export const { setSidebarPanelType } = sidebarPanelTypeSlice.actions;
export default sidebarPanelTypeSlice.reducer;
