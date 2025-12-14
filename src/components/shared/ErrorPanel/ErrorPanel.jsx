import { motion, AnimatePresence } from 'framer-motion';
import PropTypes from 'prop-types';
import { Music, Musicnote } from 'iconsax-reactjs';
import Logo from '../../Logo/Logo';

const MotionDiv = motion.div;

export default function ErrorPanel() {
  return (
    <div className="sticky top-10 hidden xl:block">
      <AnimatePresence mode="wait">
        <MotionDiv
          variants={{
            initial: { opacity: 0, y: 15 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 15 },
            transition: { duration: 0.2 },
          }}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.2 }}
          className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-175 min-h-107.5 w-67.5 flex-col overflow-y-auto rounded-xl border bg-linear-to-b from-slate-700 to-slate-900 px-3 pt-5 pb-4 xl:w-77.5 2xl:h-[calc(100dvh-200px)]"
        >
          {/* Background Illustrations */}
          <Music className="text-secondary-500 absolute top-20 left-5 h-32 w-32 -rotate-12" />
          <Musicnote className="animate-spin-slow text-secondary-500 absolute right-5 bottom-30 h-30 w-30 rotate-12" />

          <div className="z-10 flex grow flex-col items-center justify-center gap-6 px-6 text-center">
            <h1 className="text-secondary-50 mb-3 text-4xl font-bold">Not Found</h1>
            <Logo size="lg" />

            <p className="text-primary-200 mb-6 max-w-md">
              We couldn’t find the media you were looking for. Maybe the link is broken, or it has
              been removed.
            </p>
          </div>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}

ErrorPanel.propTypes = {
  error: PropTypes.object,
};
