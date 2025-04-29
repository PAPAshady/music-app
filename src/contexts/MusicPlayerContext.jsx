import { useState, createContext, useEffect, useRef, useCallback } from 'react';
import { BASE_URL } from '../services/api';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();
const music = new Audio();
const playStateOptions = ['repeat_all', 'repeat_one', 'shuffle'];

export function MusicPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState({});
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [durations, setDurations] = useState({ rawDuration: 0, formatedDuration: '0:00' });
  const [playState, setPlayState] = useState(playStateOptions[0]);
  const prevSongIndex = useRef(0);

  // if playlist has only one song, play it again in case user clicks on prev/next buttons
  const handleSingleSongPlaylist = useCallback(() => {
    if (playlist.musics?.length === 1) {
      music.currentTime = 0;
      play();
      return true;
    }
    return false;
  }, [playlist]);

  const next = useCallback(() => {
    if (handleSingleSongPlaylist()) return;

    if (currentSongIndex === playlist.musics?.length - 1) {
      setCurrentSongIndex(0);
    } else {
      setCurrentSongIndex((prev) => ++prev);
    }
  }, [currentSongIndex, playlist, handleSingleSongPlaylist]);

  const prev = () => {
    if (handleSingleSongPlaylist()) return;

    if (currentSongIndex === 0) {
      setCurrentSongIndex(playlist.musics?.length - 1);
    } else {
      setCurrentSongIndex((prev) => --prev);
    }
  };

  useEffect(() => {
    const formatSongDuration = () => {
      const seconds = Math.floor(music.duration % 60);
      const mins = Math.floor(music.duration / 60);
      const formatedDuration = `${mins}:${seconds < 10 ? `0${seconds}` : seconds}`;
      setDurations({ rawDuration: music.duration, formatedDuration });
    };

    const playStateHandler = () => {
      if (playState === 'repeat_one' || playlist.musics?.length === 1) {
        // replay the current song if playlist has only one song or if it is on 'reoeat_one'.
        play();
      } else if (playState === 'shuffle') {
        // get a random index other than the current song
        let randomIndex = null;
        do {
          randomIndex = Math.floor(Math.random() * playlist.musics?.length);
        } while (randomIndex === currentSongIndex);
        setCurrentSongIndex(randomIndex);
      } else {
        next();
      }
    };

    music.addEventListener('loadedmetadata', formatSongDuration);
    music.addEventListener('ended', playStateHandler);

    return () => {
      music.removeEventListener('loadedmetadata', formatSongDuration);
      music.removeEventListener('ended', playStateHandler);
    };
  }, [playState, playlist, next, currentSongIndex]);

  // update music src everytime currentSongIndex changes
  useEffect(() => {
    music.src = `${BASE_URL}/media/${playlist.musics?.[currentSongIndex]?.musicfile}`;
    prevSongIndex.current = currentSongIndex;
    playlist.musics?.length && play(); // dont try to play music onMount
  }, [currentSongIndex, playlist]);

  function play() {
    music.play();
    setIsPlaying(true);
  }

  function pause() {
    music.pause();
    setIsPlaying(false);
  }

  // calculate current time of song and return it in a readable format
  const getCurrentTime = () => {
    const seconds = Math.round(music.currentTime % 60);
    const mins = Math.round(music.currentTime / 60);
    return `${mins}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const togglePlayStates = useCallback(() => {
    const currentPlayStateIndex = playStateOptions.indexOf(playState);
    if (currentPlayStateIndex === playStateOptions.length - 1) {
      setPlayState(playStateOptions[0]);
    } else {
      setPlayState(playStateOptions[currentPlayStateIndex + 1]);
    }
  }, [playState]);

  return (
    <MusicPlayerContext.Provider
      value={{
        music,
        play,
        pause,
        isPlaying,
        next,
        prev,
        setPlaylist,
        currentMusic: playlist.musics?.[currentSongIndex],
        durations,
        getCurrentTime,
        playlist,
        setCurrentSongIndex,
        currentSongIndex,
        prevSongIndex: prevSongIndex.current,
        playState,
        togglePlayStates,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

MusicPlayerProvider.propTypes = { children: PropTypes.node.isRequired };

export default MusicPlayerContext;
