import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { Music, Musicnote, ArrowLeft } from 'iconsax-react';
import Logo from '../../Logo/Logo';
import { Link } from 'react-router-dom';

export default function ErrorPanel() {
  return (
    <div className="sticky top-10 hidden xl:block">
      <div className="border-secondary-200 flex h-[calc(100dvh-100px)] max-h-[700px] min-h-[430px] w-[270px] flex-col overflow-y-auto rounded-xl border bg-gradient-to-b from-slate-700 to-slate-900 px-3 pt-5 pb-4 xl:w-[310px] 2xl:h-[calc(100dvh-200px)]">
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

          <Link>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-secondary-500 flex items-center gap-2 rounded-2xl px-6 py-3 font-medium text-white shadow-lg transition"
            >
              <ArrowLeft className="h-5 w-5" />
              Go Back
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
}

ErrorPanel.propTypes = {
  error: PropTypes.object,
};
