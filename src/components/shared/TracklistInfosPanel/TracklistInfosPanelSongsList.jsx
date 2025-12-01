import PlayBar from '../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../MusicCards/PlayBar/PlayBarSkeleton';
import usePlayBar from '../../../hooks/usePlayBar';
import { AnimatePresence, motion } from 'framer-motion';
import { Music } from 'iconsax-react';
import PropTypes from 'prop-types';

function TracklistInfosPanelSongsList({ songs, isPending, tracklist, tracklistId }) {
  const { playTracklist } = usePlayBar();

  const listVariants = {
    show: {
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={tracklistId}
        variants={listVariants}
        initial="hidden"
        animate="show"
        exit="hidden"
        className={`flex grow flex-col gap-2 pe-2 pt-[2px] ${songs?.length || isPending ? 'overflow-y-auto' : 'overflow-visible'}`}
      >
        {isPending ? (
          Array(10)
            .fill()
            .map((_, index) => (
              <motion.div key={index} variants={itemVariants}>
                <PlayBarSkeleton size="sm" />
              </motion.div>
            ))
        ) : songs.length ? (
          songs.map((song, index) => (
            <motion.div key={song.id} variants={itemVariants}>
              <PlayBar size="sm" index={index} song={song} onPlay={playTracklist} />
            </motion.div>
          ))
        ) : (
          <motion.div
            variants={itemVariants}
            className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 text-center"
          >
            <Music size={68} className="text-secondary-300" />
            <p className="mt-2 text-xl font-semibold text-white">
              This {tracklist?.tracklistType} is empty
            </p>
            <p>Let the music begin...</p>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}

TracklistInfosPanelSongsList.propTypes = {
  songs: PropTypes.array,
  isPending: PropTypes.bool.isRequired,
  tracklist: PropTypes.object,
  tracklistId: PropTypes.string,
};

export default TracklistInfosPanelSongsList;
