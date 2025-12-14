import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { useSelector, useDispatch } from 'react-redux';

import { getPlaylistByIdQueryOptions } from '../queries/playlists';
import { getAlbumByIdQueryOptions } from '../queries/albums';
import { getSongByIdQueryOptions } from '../queries/songs';
import useMediaQuery from './useMediaQuery';
import {
  setSelectedCollection,
  setSelectedSong,
  setSingleSong,
  favoriteSongsInfos,
  resetPlayContext,
} from '../redux/slices/playContextSlice';
import { setCurrentMusic, music, resetPlayer } from '../redux/slices/musicPlayerSlice';
import {
  openPanel as openPlayerPanel,
  closePanel as closePlayerPanel,
} from '../redux/slices/playerPanelSlice';
import { openMobileGenrePanel, closeMobileGenrePanel } from '../redux/slices/mobileGenrePanelSlice';

// Custom hook to fetch music data based on query strings
// and store it in Redux as the initial state after page load
function useLoadInitialMedia() {
  const dispatch = useDispatch();
  const mediaId = useSelector((state) => state.queryState.id);
  const mediaType = useSelector((state) => state.queryState.type);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);

  const isMobile = useMediaQuery('(max-width: 1023px)');

  const { data: playlist } = useQuery({
    ...getPlaylistByIdQueryOptions(mediaId),
    enabled: mediaType === 'playlist' && !!mediaId,
  });
  const { data: album } = useQuery({
    ...getAlbumByIdQueryOptions(mediaId),
    enabled: mediaType === 'album' && !!mediaId,
  });
  const { data: track } = useQuery({
    ...getSongByIdQueryOptions(mediaId),
    enabled: mediaType === 'track' && !!mediaId,
  });

  const isFavorites = mediaType === 'favorites';
  const isGenre = mediaType === 'genre';

  // -----------------------------
  // INITIAL LOAD
  // -----------------------------
  useEffect(() => {
    if (!mediaId || !mediaType) return;

    if (playlist) {
      dispatch(setSelectedCollection(playlist));
      return;
    }

    if (album) {
      dispatch(setSelectedCollection(album));
      return;
    }

    if (isFavorites) {
      dispatch(setSelectedCollection(favoriteSongsInfos));
      return;
    }

    if (isGenre) {
      dispatch(openMobileGenrePanel());
      return;
    }

    // only run when track exists and currentMusic is not set (this prevents re-runnuing when user changes the track)
    if (track && !currentMusic) {
      dispatch(setSingleSong(track));
      dispatch(setSelectedSong(track));
      dispatch(setCurrentMusic(track));

      if (isMobile) dispatch(openPlayerPanel());

      music.src = track.song_url;
    }
  }, [
    mediaId,
    mediaType,
    playlist,
    album,
    track,
    isFavorites,
    isGenre,
    isMobile,
    dispatch,
    currentMusic,
  ]);

  // -----------------------------
  // CLEANUP ON UNMOUNT ONLY
  // -----------------------------
  useEffect(() => {
    return () => {
      dispatch(resetPlayContext());
      dispatch(resetPlayer());
      dispatch(closePlayerPanel());
      dispatch(closeMobileGenrePanel());
    };
  }, [dispatch]);
}

export default useLoadInitialMedia;
