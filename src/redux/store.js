import { configureStore } from '@reduxjs/toolkit';
import listenerMiddleware from './listenerMiddleware';
import hamburgerMenuReducer from '../redux/slices/hamburgerMenuSlice';
import snackbarsReducer from '../redux/slices/snackbarSlice';
import authReducer from '../redux/slices/authSlice';
import playlistInfosModalReducer from '../redux/slices/playlistInfosModalSlice';
import mobilePlaylistReducer from '../redux/slices/mobilePlaylistSlice';
import musicPlayerReducer from '../redux/slices/musicPlayerSlice';

export default configureStore({
  reducer: {
    hamburgerMenu: hamburgerMenuReducer,
    snackbars: snackbarsReducer,
    auth: authReducer,
    playlistInfosModal: playlistInfosModalReducer,
    mobilePlaylist: mobilePlaylistReducer,
    musicPlayer: musicPlayerReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});
