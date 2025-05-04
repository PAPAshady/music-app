import { useContext } from 'react';
import MobilePlaylistContext from '../contexts/MobilePlaylistContext';

export default function useMobilePlaylist() {
  const context = useContext(MobilePlaylistContext);

  if (!context) {
    throw new Error('"useMobilePlaylist" must be used within "MobilePlaylistProvider"');
  }

  return context;
}
