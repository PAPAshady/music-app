import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentQueuelist,
  setCurrentCollection,
  setSelectedCollection,
  setSelectedSong,
  favoriteSongsInfos,
} from '../redux/slices/playContextSlice';
import { setCurrentSongIndex } from '../redux/slices/musicPlayerSlice';
import { getPopularSongsByArtistIdQueryOptions } from '../queries/musics';
import { useQuery } from '@tanstack/react-query';
import { getFavoriteSongsQueryOptions } from '../queries/musics';
import { openPanel as openPlayerPanel } from '../redux/slices/playerPanelSlice';
import { useLocation, useNavigate } from 'react-router-dom';

function usePlayBar(artistId) {
  const dispatch = useDispatch();
  const playingTracklistId = useSelector((state) => state.playContext.currentCollection?.id);
  const selectedTracklist = useSelector((state) => state.playContext.selectedCollection);
  const currentMusicId = useSelector((state) => state.musicPlayer.currentMusic?.id);
  const { data: artistPopularSongs } = useQuery(getPopularSongsByArtistIdQueryOptions(artistId));
  const { data: favoriteSongs } = useQuery(getFavoriteSongsQueryOptions());
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const playSingleSong = useCallback(
    (song) => {
      dispatch(setCurrentQueuelist([song]));
      dispatch(setCurrentSongIndex(0));
      dispatch(openPlayerPanel());
      dispatch(setSelectedSong(song));
      navigate(`${pathname}?type=track&id=${song.id}`);
    },
    [dispatch, navigate, pathname]
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

  const playFavoriteSongs = useCallback(
    (_, songIndex) => {
      dispatch(setCurrentCollection(favoriteSongsInfos));
      dispatch(setSelectedCollection(favoriteSongsInfos));
      dispatch(setCurrentQueuelist(favoriteSongs));
      dispatch(setCurrentSongIndex(songIndex));
      navigate(`${pathname}?type=favorites`);
    },
    [dispatch, favoriteSongs, navigate, pathname]
  );

  return { playSingleSong, playTracklist, playArtistSongs, playFavoriteSongs };
}

export default usePlayBar;
