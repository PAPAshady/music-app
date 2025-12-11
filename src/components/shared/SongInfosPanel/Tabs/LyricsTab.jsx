import useLyrics from '../../../../hooks/useLyrics';
import { setAutoLyricsTracker } from '../../../../redux/slices/musicPlayerSlice';
import { Music } from 'iconsax-react';
import PropTypes from 'prop-types';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import getRandomNoLyricsMessage from '../../../../utils/getRandomNoLyricsMessage';

function LyricsTab({ songId, lyrics }) {
  const dispatch = useDispatch();
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);
  const lineRefs = useRef([]);
  const containerRef = useRef(null);
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const { title, description } = getRandomNoLyricsMessage();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={songId}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={{
          initial: { opacity: 0, y: 15 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: 15 },
          transition: { duration: 0.6 },
        }}
        className="flex h-full grow flex-col overflow-hidden"
      >
        <div className="my-4 flex items-center justify-between">
          <div className="text-sm text-slate-300">Lyrics</div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-slate-300">
              <input
                type="checkbox"
                className="accent-indigo-400"
                checked={shouldAutoTrackLyrics}
                onChange={() => dispatch(setAutoLyricsTracker(!shouldAutoTrackLyrics))}
              />
              Auto-Sync
            </label>
          </div>
        </div>
        <div className="h-full grow overflow-auto pr-2 pb-2" ref={containerRef}>
          {lyrics ? (
            <div className="space-y-4">
              {lyrics.map((lyric, index) => (
                <p
                  ref={(el) => (lineRefs.current[index] = el)}
                  key={index}
                  className={`leading-7 transition-all ${index === currentLineIndex ? 'font-semibold text-[#fff]' : 'text-slate-400'}`}
                >
                  {lyric.text || '\u00A0'}
                </p>
              ))}
            </div>
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-neutral-400 px-2 text-center">
              <Music size={55} className="text-secondary-300" />
              <p className="mt-2 px-4 font-semibold text-white">{title}</p>
              <p className="text-sm">{description}</p>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

LyricsTab.propTypes = { songId: PropTypes.string, lyrics: PropTypes.array };

export default LyricsTab;
