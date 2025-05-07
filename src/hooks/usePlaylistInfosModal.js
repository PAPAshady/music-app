import { useContext } from 'react';
import PlaylistInfosModalContext from '../contexts/PlaylistInfosModalContext';

export default function usePlaylistInfosModal() {
  const context = useContext(PlaylistInfosModalContext);

  if (!context) {
    throw new Error('"usePlaylistInfosModal" must we used within "PlaylistInfosModalContext"');
  }

  return context;
}
