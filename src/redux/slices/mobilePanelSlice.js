import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setSelectedCollection } from './playContextSlice';

const initialState = {
  isMobilePanelOpen: ['playlist', 'album', 'favorites', 'artist'].includes(
    new URLSearchParams(location.search).get('type')
  ),
  type: null,
};

export const openMobilePanel = createAsyncThunk(
  'mobilePanel/openMobilePanel',
  (payload, { dispatch, getState }) => {
    const isOpen = getState().mobilePanel.isMobilePanelOpen;
    const isLargeTablet = window.matchMedia('(max-width: 1280px)');
    // do not add a history if user is not using a mobile/tablet device or if mobile playlist is already open
    if (!isOpen && isLargeTablet) {
      window.history.pushState({ mobilePanel: true }, '');
    }
    dispatch(openPanel(payload));
  }
);

export const closeMobilePanel = createAsyncThunk(
  'mobilePanel/closeMobilePanel',
  (_, { dispatch, getState }) => {
    const panelType = getState().mobilePanel.type;
    window.history.back();

    dispatch(closePanel());
    if (['playlist', 'album', 'favorites'].includes(panelType)) {
      const currentCollection = getState().playContext.currentCollection;
      // After viewing a different tracklist's details, reset selectedCollection to the currently playing one.
      // This ensures that the next time the user opens the mobile tracklist panel, it shows the correct (current) tracklist info.
      dispatch(setSelectedCollection(currentCollection));
    }
  }
);

export const toggleMobilePanel = createAsyncThunk(
  'mobilePanel/toggleMobilePanel',
  (_, { dispatch, getState }) => {
    const isOpen = getState().mobilePanel.isMobilePanelOpen;
    dispatch(isOpen ? closeMobilePanel() : openMobilePanel());
  }
);

const mobilePanelSlice = createSlice({
  name: 'mobilePanel',
  initialState,
  reducers: {
    openPanel: (state, action) => {
      state.type = action.payload;
      state.isMobilePanelOpen = true;
    },
    closePanel: (state) => {
      state.isMobilePanelOpen = false;
      state.type = null;
    },
  },
});

export const { closePanel, openPanel } = mobilePanelSlice.actions;
export default mobilePanelSlice.reducer;
