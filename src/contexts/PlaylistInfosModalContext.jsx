import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const PlaylistInfosModalContext = createContext();

export function PlaylistInfosModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  const openPlaylistModal = (modalTitle) => {
    if (!modalTitle) {
      throw new Error('Playlist infos modal must have a title');
    }
    setModalTitle(modalTitle);
    setIsOpen(true);
  };

  const closePlaylistModal = () => setIsOpen(false);

  return (
    <PlaylistInfosModalContext.Provider
      value={{
        isOpen,
        setIsOpen,
        modalTitle,
        setModalTitle,
        openPlaylistModal,
        closePlaylistModal,
      }}
    >
      {children}
    </PlaylistInfosModalContext.Provider>
  );
}

PlaylistInfosModalProvider.propTypes = { children: PropTypes.node.isRequired };

export default PlaylistInfosModalContext;
