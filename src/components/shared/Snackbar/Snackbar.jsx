import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { InfoCircle, TickCircle, Danger } from 'iconsax-react';

export default function NewSnackbar() {
  const snackbars = useSelector((state) => state.snackbars);

  const iconStyles = {
    success: 'text-green',
    error: 'text-red',
    warning: 'text-yellow',
  };

  return (
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
            <div
              className={`text-primary-50 border-primary-300 xs:w-[340px] z-50 w-[300px] rounded-sm border bg-[#4E6C96]/53 px-3 py-1.5 text-xs backdrop-blur-md transition-all ease-in-out min-[480px]:w-auto sm:text-sm`}
            >
              <div className="flex items-center justify-between gap-3 py-1.5">
                <p className="truncate">
                  {snackbar.message ? snackbar.message : 'Provide a message.'}
                </p>
                <div className={iconStyles[snackbar.type]}>
                  {snackbar.type === 'success' ? (
                    <TickCircle />
                  ) : snackbar.type === 'warning' ? (
                    <InfoCircle />
                  ) : (
                    <Danger />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
