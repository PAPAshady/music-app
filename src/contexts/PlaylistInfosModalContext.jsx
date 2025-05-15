import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const PlaylistInfosModalContext = createContext();
PlaylistInfosModalContext._providerName = 'PlaylistInfosModalProvider';
PlaylistInfosModalContext._hookName = 'usePlaylistInfosModal';

export function PlaylistInfosModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [onConfirm, setOnConfirm] = useState(null);

  const openPlaylistModal = (modalTitle, onConfirmHandler) => {
    if (!modalTitle) {
      throw new Error('modalTitle is required');
    }

    if (!onConfirmHandler || typeof onConfirmHandler !== 'function') {
      throw new Error('onConfirm must be a function');
    }

    setModalTitle(modalTitle);
    setOnConfirm(() => onConfirmHandler);
    setIsOpen(true);
  };

  const closePlaylistModal = () => {
    setOnConfirm(null);
    setIsOpen(false);
  };

  return (
    <PlaylistInfosModalContext.Provider
      value={{
        isOpen,
        modalTitle,
        setModalTitle,
        openPlaylistModal,
        closePlaylistModal,
        onConfirm,
      }}
    >
      {children}
    </PlaylistInfosModalContext.Provider>
  );
}

PlaylistInfosModalProvider.propTypes = { children: PropTypes.node.isRequired };

export default PlaylistInfosModalContext;
