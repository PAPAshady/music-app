import usePlayBar from '../../../../hooks/usePlayBar';
import PlayBar from '../../../MusicCards/PlayBar/PlayBar';
import PlayBarSkeleton from '../../../MusicCards/PlayBar/PlayBarSkeleton';
import { getGeneratedQueuelistBySongDataQueryOptions } from '../../../../queries/songs';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import PropTypes from 'prop-types';
import useLockScrollbar from '../../../../hooks/useLockScrollbar';

const MotionDiv = motion.div;

function QueuelistTab({ artistId }) {
  const { playTracklist } = usePlayBar(artistId);
  const selectedSong = useSelector((state) => state.playContext.selectedSong);
  const { data: queuelist, isPending: isQueuelistPending } = useQuery(
    getGeneratedQueuelistBySongDataQueryOptions(selectedSong)
  );
  const { isScrollbarLocked, lockScroll, unlockScroll } = useLockScrollbar(true);

  return (
    <AnimatePresence mode="wait">
      <MotionDiv
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
        className={`mt-4 h-full space-y-4 overflow-auto pr-2 pb-2 ${isScrollbarLocked ? 'locked-scroll' : ''}`}
      >
        <div className="text-sm text-slate-300">Coming up</div>
        <MotionDiv
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
                  <MotionDiv
                    key={index}
                    variants={{
                      hidden: { opacity: 0, y: 15 },
                      show: { opacity: 1, y: 0 },
                    }}
                  >
                    <PlayBarSkeleton size="sm" />
                  </MotionDiv>
                ))
            : queuelist.map((song, index) => (
                <MotionDiv
                  key={song.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <PlayBar
                    size="sm"
                    onPlay={playTracklist}
                    song={song}
                    index={index}
                    onDropDownOpen={lockScroll}
                    onDropDownClose={unlockScroll}
                  />
                </MotionDiv>
              ))}
        </MotionDiv>
      </MotionDiv>
    </AnimatePresence>
  );
}

QueuelistTab.propTypes = { artistId: PropTypes.string };

export default QueuelistTab;
