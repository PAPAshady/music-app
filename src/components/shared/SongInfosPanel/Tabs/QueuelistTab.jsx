import usePlayBar from '../../../../hooks/usePlayBar';
import PlayBar from '../../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../../MusicCards/PlayBar/PlayBarSkeleton';
import { getGeneratedQueuelistBySongDataQueryOptions } from '../../../../queries/musics';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';

function QueuelistTab({ artistId }) {
  const { playTracklist } = usePlayBar(artistId);
  const selectedSong = useSelector((state) => state.playContext.selectedSong);
  const { data: queuelist, isPending: isQueuelistPending } = useQuery(
    getGeneratedQueuelistBySongDataQueryOptions(selectedSong)
  );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={selectedSong.id}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 15 },
          transition: { duration: 0.6 },
        }}
        className="mt-4 h-full space-y-4 overflow-auto pr-2 pb-2"
      >
        <div className="text-sm text-slate-300">Coming up</div>
        <motion.div
          initial="hidden"
          animate="show"
          exit="hidden"
          variants={{
            show: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: 0.1,
              },
            },
          }}
          className="mt-2 space-y-3"
        >
          {isQueuelistPending
            ? Array(10)
                .fill()
                .map((_, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <PlayBarSkeleton size="sm" />
                  </motion.div>
                ))
            : queuelist.map((song, index) => (
                <motion.div
                  key={song.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <PlayBar size="sm" onPlay={playTracklist} song={song} index={index} />
                </motion.div>
              ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

QueuelistTab.propTypes = { artistId: PropTypes.string };

export default QueuelistTab;
