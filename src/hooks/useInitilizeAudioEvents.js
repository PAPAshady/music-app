import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  music,
  setSongTotalDurations,
  formatTime,
  setMusicState,
  setBufferProgressPercentage,
  setCurrentSongIndex,
  next,
  play,
} from '../redux/slices/musicPlayerSlice';

export default function useInitilizeAudioEvents() {
  const dispatch = useDispatch();
  const currentSongIndex = useSelector((state) => state.musicPlayer.currentSongIndex);
  const playingTracklist = useSelector((state) => state.playContext.playingContext);
  const playingState = useSelector((state) => state.musicPlayer.playingState);

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

  const getBufferedPercentage = useCallback(() => {
    const duration = music.duration;
    if (duration > 0 && music.buffered.length > 0) {
      const bufferedEnd = music.buffered.end(music.buffered.length - 1);
      const percent = (bufferedEnd / duration) * 100;
      dispatch(setBufferProgressPercentage(percent));
    }
  }, [dispatch]);

  const playStateHandler = useCallback(() => {
    if (playingState === 'repeat_one' || playingTracklist.musics?.length === 1) {
      // replay the current song if playlist has only one song or if it is on 'reoeat_one'.
      dispatch(play());
    } else if (playingState === 'shuffle') {
      // get a random index other than the current song
      let randomIndex = null;
      do {
        randomIndex = Math.floor(Math.random() * playingTracklist.musics?.length);
      } while (randomIndex === currentSongIndex);
      dispatch(setCurrentSongIndex(randomIndex));
    } else {
      dispatch(next());
    }
  }, [dispatch, currentSongIndex, playingState, playingTracklist]);

  useEffect(() => {
    music.addEventListener('loadedmetadata', formatSongDuration);
    music.addEventListener('loadstart', startMusicInitialLoading);
    music.addEventListener('waiting', startMusicBuffering);
    music.addEventListener('canplay', startMusicPlaying);
    music.addEventListener('ended', playStateHandler);
    if (!/Firefox/i.test(navigator.userAgent)) {
      // Buffer bar is disabled in Firefox due to inconsistent `audio.buffered` reporting.
      // Firefox often shows only small or partial buffered ranges, which breaks the progress calculation.
      music.addEventListener('progress', getBufferedPercentage);
    }
    return () => {
      music.removeEventListener('loadedmetadata', formatSongDuration);
      music.removeEventListener('loadstart', startMusicInitialLoading);
      music.removeEventListener('waiting', startMusicBuffering);
      music.removeEventListener('canplay', startMusicPlaying);
      music.removeEventListener('ended', playStateHandler);
      music.removeEventListener('progress', getBufferedPercentage);
    };
  }, [
    formatSongDuration,
    startMusicBuffering,
    startMusicPlaying,
    getBufferedPercentage,
    startMusicInitialLoading,
    playStateHandler,
  ]);
}
