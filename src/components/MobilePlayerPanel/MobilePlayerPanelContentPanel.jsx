import { useDispatch, useSelector } from 'react-redux';
import { Pause, Play } from 'iconsax-react';
import { pause, play } from '../../redux/slices/musicPlayerSlice';
import musicCover from '../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

function MobilePlayerPanelContentPanel({ onClose }) {
  const dispatch = useDispatch();
  const isPlaying = useSelector((state) => state.musicPlayer.isPlaying);
  const currentMusic = useSelector((state) => state.musicPlayer.currentMusic);

  return (
    <div className="bg-secondary-800/50 flex origin-top items-center px-2 py-3">
      <div className="flex grow items-center gap-3" onClick={onClose}>
        <img
          src={currentMusic?.cover || musicCover}
          alt={currentMusic?.title}
          className="size-13 rounded-lg object-cover"
        />
        <div>
          <p className="font-semibold">{currentMusic?.title}</p>
          <p className="text-sm text-slate-300">{currentMusic?.artist}</p>
        </div>
      </div>
      <button onClick={() => dispatch(isPlaying ? pause() : play())} className="px-3 py-2">
        {isPlaying ? <Pause size={32} /> : <Play size={32} />}
      </button>
    </div>
  );
}

MobilePlayerPanelContentPanel.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MobilePlayerPanelContentPanel;
