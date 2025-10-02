import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  music,
  setMusicState,
  setBufferProgressPercentage,
  setCurrentSongIndex,
  next,
  prev,
  play,
  pause,
} from '../redux/slices/musicPlayerSlice';
import songDefaultCover from '../assets/images/covers/no-cover.jpg';

export default function useInitilizeAudioEvents() {
  const dispatch = useDispatch();
  const currentSongIndex = useSelector((state) => state.musicPlayer.currentSongIndex);
  const queuelist = useSelector((state) => state.playContext.currentQueuelist);
  const playingState = useSelector((state) => state.musicPlayer.playingState);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const SMTC = 'mediaSession' in window.navigator; // SMTC (System Media Transport Controls):
  // Lets the OS show track info (title, artist, artwork) in the volume/media overlay
  // and handle play/pause/next/prev from hardware/media keys.

  const startMusicInitialLoading = useCallback(
    () => dispatch(setMusicState('initial_loading')),
    [dispatch]
  );
  const startMusicBuffering = useCallback(() => dispatch(setMusicState('buffering')), [dispatch]);
  const startMusicPlaying = useCallback(() => dispatch(setMusicState('playable')), [dispatch]);

  useEffect(() => {
    if (SMTC && currentMusic) {
      window.navigator.mediaSession.metadata = new MediaMetadata({
        title: currentMusic.title,
        artist: currentMusic.artist ?? 'Unknown artist',
        album: currentMusic.album ?? 'Single',
        artwork: [{ src: currentMusic.cover ?? songDefaultCover, type: 'image/*' }],
      });
    }
  }, [SMTC, currentMusic]);

  const getBufferedPercentage = useCallback(() => {
    const duration = music.duration;
    if (duration > 0 && music.buffered.length > 0) {
      const bufferedEnd = music.buffered.end(music.buffered.length - 1);
      const percent = (bufferedEnd / duration) * 100;
      dispatch(setBufferProgressPercentage(percent));
    }
  }, [dispatch]);

  const playStateHandler = useCallback(() => {
    if (playingState === 'repeat_one' || queuelist.length === 1) {
      // replay the current song if playlist has only one song or if it is on 'reoeat_one'.
      dispatch(play());
    } else if (playingState === 'shuffle') {
      // get a random index other than the current song
      let randomIndex = null;
      do {
        randomIndex = Math.floor(Math.random() * queuelist.length);
      } while (randomIndex === currentSongIndex);
      dispatch(setCurrentSongIndex(randomIndex));
    } else {
      dispatch(next());
    }
  }, [dispatch, currentSongIndex, playingState, queuelist]);

  useEffect(() => {
    music.addEventListener('loadstart', startMusicInitialLoading);
    music.addEventListener('waiting', startMusicBuffering);
    music.addEventListener('canplay', startMusicPlaying);
    music.addEventListener('ended', playStateHandler);
    if (!/Firefox/i.test(navigator.userAgent)) {
      // Buffer bar is disabled in Firefox due to inconsistent `audio.buffered` reporting.
      // Firefox often shows only small or partial buffered ranges, which breaks the progress calculation.
      music.addEventListener('progress', getBufferedPercentage);
    }

    if (SMTC) {
      window.navigator.mediaSession.setActionHandler('play', () => dispatch(play()));
      window.navigator.mediaSession.setActionHandler('pause', () => dispatch(pause()));
      window.navigator.mediaSession.setActionHandler('nexttrack', () => dispatch(next()));
      window.navigator.mediaSession.setActionHandler('previoustrack', () => dispatch(prev()));
    }

    return () => {
      music.removeEventListener('loadstart', startMusicInitialLoading);
      music.removeEventListener('waiting', startMusicBuffering);
      music.removeEventListener('canplay', startMusicPlaying);
      music.removeEventListener('ended', playStateHandler);
      music.removeEventListener('progress', getBufferedPercentage);

      if (SMTC) {
        window.navigator.mediaSession.setActionHandler('play', null);
        window.navigator.mediaSession.setActionHandler('pause', null);
        window.navigator.mediaSession.setActionHandler('previoustrack', null);
        window.navigator.mediaSession.setActionHandler('nexttrack', null);
      }
    };
  }, [
    startMusicBuffering,
    startMusicPlaying,
    getBufferedPercentage,
    startMusicInitialLoading,
    playStateHandler,
    dispatch,
    SMTC,
  ]);
}
