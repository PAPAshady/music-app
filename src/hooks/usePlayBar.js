import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSingleSong,
  setCurrentQueuelist,
  setCurrentCollection,
} from '../redux/slices/playContextSlice';
import { setCurrentSongIndex } from '../redux/slices/musicPlayerSlice';
import { setSidebarPanelType } from '../redux/slices/sidebarTypeSlice';
import { getPopularSongsByArtistIdQueryOptions } from '../queries/musics';
import { useQuery } from '@tanstack/react-query';

function usePlayBar(artistId) {
  const dispatch = useDispatch();
  const playingTracklistId = useSelector((state) => state.playContext.currentCollection?.id);
  const selectedTracklist = useSelector((state) => state.playContext.selectedCollection);
  const currentMusicId = useSelector((state) => state.musicPlayer.currentMusic?.id);
  const { data: artistPopularSongs } = useQuery(getPopularSongsByArtistIdQueryOptions(artistId));

  const playSingleSong = useCallback(
    (song) => {
      dispatch(setSingleSong(song));
      dispatch(setCurrentQueuelist([song]));
      dispatch(setCurrentSongIndex(0));
      dispatch(setSidebarPanelType('song_panel'));
    },
    [dispatch]
  );

  const playTracklist = useCallback(
    (song, songIndex) => {
      if (playingTracklistId !== selectedTracklist.id) {
        dispatch(setCurrentCollection(selectedTracklist));
      }
      // dont change the song index if user clicked on the current song which is playing because it will
      // cause the song to replay from the start
      if (currentMusicId !== song.id) {
        dispatch(setCurrentSongIndex(songIndex));
      }
    },
    [dispatch, currentMusicId, playingTracklistId, selectedTracklist]
  );

  const playArtistSongs = useCallback(
    (_, songIndex) => {
      dispatch(setCurrentQueuelist(artistPopularSongs));
      dispatch(setCurrentSongIndex(songIndex));
    },
    [dispatch, artistPopularSongs]
  );

  return { playSingleSong, playTracklist, playArtistSongs };
}

export default usePlayBar;
