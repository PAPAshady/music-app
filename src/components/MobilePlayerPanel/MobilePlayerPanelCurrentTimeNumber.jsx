import { music, formatTime } from '../../redux/slices/musicPlayerSlice';
import { useEffect, useState } from 'react';

function MobilePlayerPanelCurrentTimeNumber() {
  const [currentTime, setCurrentTime] = useState('0:00');

  useEffect(() => {
    const updateCurrentTime = () => {
      setCurrentTime(formatTime(music.currentTime));
    };

    music.addEventListener('timeupdate', updateCurrentTime);

    return () => {
      music.removeEventListener('timeupdate', updateCurrentTime);
    };
  }, []);

  return <span className="text-primary-100 text-sm">{currentTime}</span>;
}

export default MobilePlayerPanelCurrentTimeNumber;
