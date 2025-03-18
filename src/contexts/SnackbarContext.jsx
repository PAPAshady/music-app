import { useState, createContext } from 'react';
import Snackbar from '../components/shared/Snackbar/Snackbar';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

const SnackbarContext = createContext();

export function SnackbarProvider({ children }) {
  const [snackbars, setSnackbars] = useState([]);

  const showNewSnackbar = (message, type, hideDuration = 3000) => {
    const newSnackbar = {
      id: Date.now(),
      message,
      type,
    };

    setSnackbars((prev) => [...prev, newSnackbar]);

    setTimeout(() => {
      setSnackbars((prev) => prev.filter((snackbar) => snackbar.id !== newSnackbar.id));
    }, hideDuration);
  };

  const closeAllSnackbars = () => setSnackbars([]);

  return (
    <SnackbarContext.Provider value={{ showNewSnackbar, closeAllSnackbars }}>
      {children}
      <div className="fixed top-4 left-2 z-50 space-y-2 sm:left-5 lg:left-6">
        <AnimatePresence>
          {snackbars.map((snackbar) => (
            <motion.div
              key={snackbar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Snackbar {...snackbar} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </SnackbarContext.Provider>
  );
}

SnackbarProvider.propTypes = { children: PropTypes.node.isRequired };

export default SnackbarContext;
