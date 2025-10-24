import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { music } from '../../redux/slices/musicPlayerSlice';
import { Range } from 'react-range';
import PropTypes from 'prop-types';

function PlayerProgressBar({ disabled }) {
  const [musicProgress, setMusicProgress] = useState([0]);
  const bufferProgressPercentage = useSelector(
    (state) => state.musicPlayer.bufferProgressPercentage
  );
  const musicState = useSelector((state) => state.musicPlayer.musicState);
  const isDisabled = disabled || musicState === 'initial_loading';

  useEffect(() => { 
    const updateProgressBar = () => {
      setMusicProgress([Math.floor((music.currentTime / music.duration) * 100)]);
    };
    music.addEventListener('timeupdate', updateProgressBar);
    return () => {
      music.removeEventListener('timeupdate', updateProgressBar);
    };
  }, []);

  return (
    <Range
      values={musicProgress}
      disabled={isDisabled}
      onChange={(values) => {
        music.currentTime = (values[0] / 100) * music.duration;
        setMusicProgress(values);
      }}
      min={0}
      max={100}
      renderTrack={({ props, children }) => (
        <div
          {...props}
          className={`relative flex h-1.5 cursor-pointer items-center rounded-3xl border sm:h-2 ${isDisabled ? 'border-white-700' : 'border-primary-400  md:border-primary-300'}`}
        >
          {/* Buffer bar is disabled in Firefox due to inconsistent `audio.buffered` reporting. */}
          {/* Firefox often shows only small or partial buffered ranges, which breaks the progress calculation. */}
          {!isDisabled && !/Firefox/i.test(navigator.userAgent) && (
            <div
              className="absolute h-1.5 rounded-3xl bg-white/30 transition sm:h-2"
              style={{ width: `${bufferProgressPercentage}%` }}
            ></div>
          )}
          <div
            className={`relative h-1.5 rounded-3xl border transition sm:h-2 ${isDisabled ? 'bg-white-700 border-white-700 hidden' : 'bg-primary-400 md:bg-primary-300 border-primary-400 md:border-primary-300'}`}
            style={{ width: `${musicProgress[0]}%` }}
          ></div>
          {children}
        </div>
      )}
      renderThumb={({ props }) => (
        <div
          className={`bg-primary-300 top-0 size-3 rounded-full transition outline-none sm:size-4 ${isDisabled ? 'hidden' : ''}`}
          {...props}
          key={1}
        ></div>
      )}
    />
  );
}

PlayerProgressBar.propTypes = { disabled: PropTypes.bool };

export default PlayerProgressBar;
