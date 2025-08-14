import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {
  music,
  setSongTotalDurations,
  formatTime,
  setMusicState,
} from '../redux/slices/musicPlayerSlice';

export default function useInitilizeAudioEvents() {
  const dispatch = useDispatch();

  // calculate the duration of the new song
  const formatSongDuration = useCallback(() => {
    dispatch(
      setSongTotalDurations({
        rawDuration: music.duration,
        formatedDuration: formatTime(music.duration),
      })
    );
  }, [dispatch]);

  const startMusicInitialLoading = useCallback(
    () => dispatch(setMusicState('initial_loading')),
    [dispatch]
  );
  const startMusicBuffering = useCallback(() => dispatch(setMusicState('buffering')), [dispatch]);
  const startMusicPlaying = useCallback(() => dispatch(setMusicState('playable')), [dispatch]);

  useEffect(() => {
    music.addEventListener('loadedmetadata', formatSongDuration);
    music.addEventListener('loadstart', startMusicInitialLoading);
    music.addEventListener('waiting', startMusicBuffering);
    music.addEventListener('canplay', startMusicPlaying);
    return () => {
      music.removeEventListener('loadedmetadata', formatSongDuration);
      music.removeEventListener('loadstart', startMusicInitialLoading);
      music.removeEventListener('waiting', startMusicBuffering);
      music.removeEventListener('canplay', startMusicPlaying);
    };
  }, [formatSongDuration, startMusicBuffering, startMusicPlaying, startMusicInitialLoading]);
}
