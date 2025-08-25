import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import useInitilizeAudioEvents from './hooks/useInitilizeAudioEvents';
import useInitilizeAuth from './hooks/useinitilizeAuth';
import queryClient from './queryClient';
import { AnimatePresence, motion } from 'framer-motion';
import Snackbar from './components/shared/Snackbar/Snackbar';
import routes from './Router';
import './App.css';

const router = createBrowserRouter(routes);

function App() {
  const snackbars = useSelector((state) => state.snackbars);
  useInitilizeAudioEvents(); // initilize all audio events globally.
  useInitilizeAuth(); // initilize app's authentication

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* snackbar container template */}
      <div className="fixed top-4 left-2 z-[60] space-y-2 sm:left-5 lg:left-6">
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
    </QueryClientProvider>
  );
}

export default App;
