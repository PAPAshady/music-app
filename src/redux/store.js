import { configureStore } from '@reduxjs/toolkit';
import listenerMiddleware from './listenerMiddleware';
import hamburgerMenuReducer from '../redux/slices/hamburgerMenuSlice';
import snackbarsReducer from '../redux/slices/snackbarSlice';
import authReducer from '../redux/slices/authSlice';
import playlistInfosModalReducer from '../redux/slices/playlistInfosModalSlice';
import musicPlayerReducer from '../redux/slices/musicPlayerSlice';
import confirmModalReducer from '../redux/slices/confirmModalSlice';
import playContextReducer from '../redux/slices/playContextSlice';
import mobilePanelReducer from './slices/mobilePanelSlice';
import MobileSearchPanelReducer from './slices/mobileSearchPanelSlice';
import PlayerPanelReducer from './slices/playerPanelSlice';
import QueryStateReducer from './slices/queryStateSlice';

export default configureStore({
  reducer: {
    hamburgerMenu: hamburgerMenuReducer,
    snackbars: snackbarsReducer,
    auth: authReducer,
    playlistInfosModal: playlistInfosModalReducer,
    musicPlayer: musicPlayerReducer,
    confirmModal: confirmModalReducer,
    playContext: playContextReducer,
    mobilePanel: mobilePanelReducer,
    mobileSearchPanel: MobileSearchPanelReducer,
    playerPanel: PlayerPanelReducer,
    queryState: QueryStateReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});
