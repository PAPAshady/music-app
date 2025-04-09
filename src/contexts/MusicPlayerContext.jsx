import { useState, createContext, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const MusicPlayerContext = createContext();
const music = new Audio();

export function MusicPlayerProvider({ children }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const currentSongIndex = useRef(0);

  useEffect(() => {
    music.src = playlist[currentSongIndex.current]?.musicFile;
  }, [playlist]);

  function play() {
    music.play();
    setIsPlaying(true);
  }

  function pause() {
    music.pause();
    setIsPlaying(false);
  }

  const next = () => {
    if (currentSongIndex.current === playlist.length - 1) {
      currentSongIndex.current = 0;
    } else {
      currentSongIndex.current++;
    }
    music.src = playlist[currentSongIndex.current]?.musicFile;
    play();
  };

  const prev = () => {
    if (currentSongIndex.current === 0) {
      currentSongIndex.current = playlist.length - 1;
    } else {
      currentSongIndex.current--;
    }
    music.src = playlist[currentSongIndex.current]?.musicFile;
    play();
  };

  return (
    <MusicPlayerContext.Provider value={{ music, play, pause, isPlaying, next, prev }}>
      {children}
    </MusicPlayerContext.Provider>
  );
}

MusicPlayerProvider.propTypes = { children: PropTypes.node.isRequired };

export default MusicPlayerContext;
