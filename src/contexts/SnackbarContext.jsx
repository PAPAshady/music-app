import { useState, createContext } from 'react';
import PropTypes from 'prop-types';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('info'); // should be on of the followings : [error, success, warning]
  const [hideDuration, setHideDuration] = useState(3000); // in milliseconds

  return (
    <SnackbarContext.Provider
      value={{
        isOpen,
        setIsOpen,
        message,
        setMessage,
        messageType,
        setMessageType,
        hideDuration,
        setHideDuration,
      }}
    >
      {children}
    </SnackbarContext.Provider>
  );
}

SnackbarProvider.propTypes = { children: PropTypes.node.isRequired };

export default SnackbarContext;
