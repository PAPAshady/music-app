import { setAutoLyricsTracker } from '../../../redux/slices/musicPlayerSlice';
import useLyrics from '../../../hooks/useLyrics';
import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Music } from 'iconsax-react';

function LyricsTab() {
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);
  const dispatch = useDispatch();
  const containerRef = useRef(null);
  const lineRefs = useRef([]);
  const { currentLineIndex } = useLyrics(lineRefs, containerRef);
  const shouldAutoTrackLyrics = useSelector((state) => state.musicPlayer.autoLyricsTracker);

  return (
    <div className="flex h-full flex-col">
      <div className="border-secondary-400 mb-6 flex items-center justify-between border-b pt-2 pb-4">
        <h2 className="text-xl font-bold">Lyrics</h2>
        <label className="flex items-center gap-2">
          <span>Auto-sync</span>
          <input
            type="checkbox"
            checked={shouldAutoTrackLyrics}
            onChange={() => dispatch(setAutoLyricsTracker(!shouldAutoTrackLyrics))}
          />
        </label>
      </div>

      <div className="h-full grow overflow-auto pr-2 pb-2" ref={containerRef}>
        {currentMusic?.lyrics ? (
          <div className="space-y-8">
            {currentMusic.lyrics.map((lyric, index) => (
              <p
                ref={(el) => (lineRefs.current[index] = el)}
                key={index}
                className={`text-2xl leading-8 transition-all ${index === currentLineIndex ? 'font-semibold text-[#fff]' : 'text-slate-400'}`}
              >
                {lyric.text || '\u00A0'}
              </p>
            ))}
          </div>
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 rounded-md border-neutral-400 pt-10 text-center">
            <Music size={64} className="text-secondary-300" />
            <p className="mt-2 px-4 text-xl font-semibold text-white">
              No lyrics available at the moment.
            </p>
            <p className="text-lg">Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LyricsTab;
