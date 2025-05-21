import { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import MusicPlayerContext from './MusicPlayerContext';
import useSafeContext from '../hooks/useSafeContext';
import useMediaQuery from '../hooks/useMediaQuery';

const MobilePlaylistContext = createContext();
MobilePlaylistContext._providerName = 'MobilePlaylistProvider';
MobilePlaylistContext._hookName = 'useMobilePlaylist';

export function MobilePlaylistProvider({ children }) {
  const [isMobilePlaylistOpen, setIsMobilePlaylistOpen] = useState(false);
  const { setSelectedPlaylist, playlist } = useSafeContext(MusicPlayerContext);
  const isLargeTablet = useMediaQuery('(max-width: 1280px)');

  useEffect(() => {
    const handlePopState = () => {
      if (isMobilePlaylistOpen) {
        setIsMobilePlaylistOpen(false);
      }
    };
    // if user clicks on back button of their device, mobilePlaylist will close
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [isMobilePlaylistOpen]);

  const openMobilePlaylist = useCallback(() => {
    setIsMobilePlaylistOpen(true);

    // do not add a history if user is not using a mobile/tablet device or if mobile playlist is already open
    if (!isMobilePlaylistOpen && isLargeTablet) {
      window.history.pushState({ mobilePlaylist: true }, '');
    }
  }, [isMobilePlaylistOpen, isLargeTablet]);

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
