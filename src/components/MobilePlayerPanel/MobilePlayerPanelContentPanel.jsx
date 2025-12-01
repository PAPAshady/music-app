import ShimmerOverlay from '../ShimmerOverlay/ShimmerOverlay';
import { useDispatch, useSelector } from 'react-redux';
import { Pause, Play } from 'iconsax-react';
import { pause, play } from '../../redux/slices/musicPlayerSlice';
import musicCover from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

function MobilePlayerPanelContentPanel({ song, isPending, onClose }) {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);

  return (
    <div className="bg-secondary-800/50 flex origin-top items-center p-2">
      <div className="flex grow items-center gap-2" onClick={onClose}>
        {isPending ? (
          <>
            <div className="relative size-11 overflow-hidden rounded-lg bg-gray-600/60">
              <ShimmerOverlay />
            </div>
            <div className="flex grow flex-col gap-2">
              <div className="relative h-2 w-1/2 overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
              <div className="relative h-2 w-1/3 overflow-hidden rounded-full bg-gray-600/60">
                <ShimmerOverlay />
              </div>
            </div>
          </>
        ) : (
          <>
            <img
              src={song?.cover || musicCover}
              alt={song?.title}
              className="size-11 rounded-lg object-cover"
            />
            <div>
              <p className="text-sm font-semibold">{song?.title}</p>
              <p className="text-xs text-slate-300">{song?.artist}</p>
            </div>
          </>
        )}
      </div>
      <button onClick={() => dispatch(isPlaying ? pause() : play())} className="px-3 py-2">
        {isPlaying ? <Pause /> : <Play />}
      </button>
    </div>
  );
}

MobilePlayerPanelContentPanel.propTypes = {
  song: PropTypes.object,
  isPending: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default MobilePlayerPanelContentPanel;
