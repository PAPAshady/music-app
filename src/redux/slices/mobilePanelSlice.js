import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setSelectedCollection } from './playContextSlice';

const validMobilePanelTypes = [null, 'tracklist', 'artist'];

export const openMobilePanel = createAsyncThunk(
  'mobilePanel/openMobilePanel',
  (payload, { dispatch, getState }) => {
    if (!validMobilePanelTypes.includes(payload.type)) {
      throw new Error(
        `Invalid actionType "${payload.type}" passed to mobilePanelTypeSlice. Valid types are: ${validMobilePanelTypes.join(', ')}.`
      );
    }
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
    if (panelType === 'tracklist') {
      const currentCollection = getState().playContext.currentCollection;
      // After viewing a different playlist's details, reset selectedPlaylist to the currently playing one.
      // This ensures that the next time the user opens the mobile playlist, it shows the correct (current) playlist info.
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
  initialState: {
    isMobilePanelOpen: false,
    type: null,
    title: '',
    description: '',
    image: null,
  },
  reducers: {
    openPanel: (state, action) => {
      const { type, title, description, image } = action.payload;
      state.type = type;
      state.title = title;
      state.description = description;
      if (image) state.image = image;
      state.isMobilePanelOpen = true;
    },
    closePanel: (state) => {
      state.isMobilePanelOpen = false;
      state.type = null;
      state.title = '';
      state.description = '';
      state.image = null;
    },
  },
});

export const { closePanel, openPanel } = mobilePanelSlice.actions;
export default mobilePanelSlice.reducer;
