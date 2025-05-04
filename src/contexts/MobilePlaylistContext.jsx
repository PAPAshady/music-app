import { createContext, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const MobilePlaylistContext = createContext();

export function MobilePlaylistProvider({ children }) {
  const [isMobilePlaylistOpen, setIsMobilePlaylistOpen] = useState(false);
  const [selectedPlaylist, setSelectedPlaylist] = useState({});

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
  }, []);

  return (
    <MobilePlaylistContext.Provider
      value={{
        isMobilePlaylistOpen,
        openMobilePlaylist,
        closeMobilePlaylist,
        selectedPlaylist,
        setSelectedPlaylist,
      }}
    >
      {children}
    </MobilePlaylistContext.Provider>
  );
}

MobilePlaylistProvider.propTypes = { children: PropTypes.node.isRequired };
export default MobilePlaylistContext;
