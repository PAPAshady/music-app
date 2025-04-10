import { useState, createContext, useEffect, useRef } from 'react';
import { BASE_URL } from '../services/api';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();
const music = new Audio();

export function MusicPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [durations, setDurations] = useState({ rawDuration: 0, formatedDuration: '0:00' });
  const prevSongIndex = useRef(0);

  // get song's full duration
  useEffect(() => {
    function formatSongDuration() {
      const seconds = Math.floor(music.duration % 60);
      const mins = Math.floor(music.duration / 60);
      const formatedDuration = `${mins}:${seconds < 10 ? `0${seconds}` : seconds}`;
      setDurations({ rawDuration: music.duration, formatedDuration });
    }

    music.addEventListener('loadedmetadata', formatSongDuration);

    return () => music.removeEventListener('loadedmetadata', formatSongDuration);
  }, []);

  // update music src everytime currentSongIndex changes
  useEffect(() => {
    music.src = `${BASE_URL}${playlist[currentSongIndex]?.musicfile}`;

    // make sure to play the song only if user went for the next/prev song and not on the first render.
    if (prevSongIndex.current !== currentSongIndex) {
      prevSongIndex.current = currentSongIndex;
      play();
    }
  }, [currentSongIndex, playlist]);

  function play() {
    music.play();
    setIsPlaying(true);
  }

  function pause() {
    music.pause();
    setIsPlaying(false);
  }

  const next = () => {
    if (currentSongIndex === playlist.length - 1) {
      setCurrentSongIndex(0);
    } else {
      setCurrentSongIndex((prev) => ++prev);
    }
  };

  const prev = () => {
    if (currentSongIndex === 0) {
      setCurrentSongIndex(playlist.length - 1);
    } else {
      setCurrentSongIndex((prev) => --prev);
    }
  };

  // calculate current time of song and return it in a readable format
  const getCurrentTime = () => {
    const seconds = Math.round(music.currentTime % 60);
    const mins = Math.round(music.currentTime / 60);
    return `${mins}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

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
        currentMusic: playlist[currentSongIndex],
        durations,
        getCurrentTime,
        playlist,
        setCurrentSongIndex,
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

MusicPlayerProvider.propTypes = { children: PropTypes.node.isRequired };

export default MusicPlayerContext;
