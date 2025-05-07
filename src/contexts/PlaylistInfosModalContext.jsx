import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

const PlaylistInfosModalContext = createContext();

export function PlaylistInfosModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState('');

  return (
    <PlaylistInfosModalContext.Provider value={{ isOpen, setIsOpen, modalTitle, setModalTitle }}>
      {children}
    </PlaylistInfosModalContext.Provider>
  );
}

PlaylistInfosModalProvider.propTypes = { children: PropTypes.node.isRequired };

export default PlaylistInfosModalContext;
