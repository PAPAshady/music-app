import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';
import { AnimatePresence, motion } from 'framer-motion';
import Snackbar from './components/shared/Snackbar/Snackbar';
import routes from './Router';
import './App.css';

const router = createBrowserRouter(routes);

function App() {
  const snackbars = useSelector((state) => state.snackbars);
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {/* snackbar container template */}
      <div className="fixed top-4 z-[60] w-[95%] max-w-[550px] min-[1200px]:!w-1/3 sm:w-[70%] md:w-1/2 lg:w-[40%]">
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
