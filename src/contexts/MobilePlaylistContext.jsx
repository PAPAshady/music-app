import { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import useMusicPlayer from '../hooks/useMusicPlayer';

const MobilePlaylistContext = createContext();

export function MobilePlaylistProvider({ children }) {
  const [isMobilePlaylistOpen, setIsMobilePlaylistOpen] = useState(false);
  const { setSelectedPlaylist, playlist } = useMusicPlayer();

  useEffect(() => {
    const handlePopState = () => {
      if (isMobilePlaylistOpen) {
        setIsMobilePlaylistOpen(false);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isMobilePlaylistOpen]);

  const openMobilePlaylist = useCallback(() => {
    setIsMobilePlaylistOpen(true);
    // if user clicks on back button of their device, mobilePlaylist will close
    !isMobilePlaylistOpen && window.history.pushState({ mobilePlaylist: true }, '');
  }, [isMobilePlaylistOpen]);

  const closeMobilePlaylist = useCallback(() => {
    window.history.back();
    setIsMobilePlaylistOpen(false);
    
    // After viewing a different playlist's details, reset selectedPlaylist to the currently playing one.
    // This ensures that the next time the user opens the mobile playlist, it shows the correct (current) playlist info.
    setSelectedPlaylist(playlist);
  }, [playlist, setSelectedPlaylist]);
  

  const toggleMobilePlaylist = useCallback(() => {
    isMobilePlaylistOpen ? closeMobilePlaylist() : openMobilePlaylist();
  }, [isMobilePlaylistOpen, closeMobilePlaylist, openMobilePlaylist]);

  return (
    <MobilePlaylistContext.Provider
      value={{
        isMobilePlaylistOpen,
        openMobilePlaylist,
        closeMobilePlaylist,
        setSelectedPlaylist,
        toggleMobilePlaylist,
      }}
    >
      {children}
    </MobilePlaylistContext.Provider>
  );
}

MobilePlaylistProvider.propTypes = { children: PropTypes.node.isRequired };
export default MobilePlaylistContext;
