import PropTypes from 'prop-types';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { setQueries } from '../../../redux/slices/queryStateSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { useDispatch } from 'react-redux';
import musicCover from '../../../assets/images/covers/no-cover.jpg';

function MobilePlayerPanelAlbumCard({ album, onClick }) {
  const { cover, title, release_date } = album;
  const dispatch = useDispatch();

  const clickHandler = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
    dispatch(setQueries({ type: 'album', id: album.id }));
    onClick?.();
  };

  return (
    <div className="flex w-[150px] flex-col rounded-xl p-3" onClick={clickHandler}>
      <img
        src={cover || musicCover}
        alt={title}
        className="mb-2 h-[120px] w-full cursor-pointer rounded-lg object-cover"
      />
      <h3 className="cursor-pointer truncate text-sm font-semibold">{title}</h3>
      <div className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400">
        <span>Album</span>
        <span className="bg-secondary-100 size-0.75 rounded-full"></span>
        <span>{release_date.split('-')[0]}</span>
      </div>
    </div>
  );
}

MobilePlayerPanelAlbumCard.propTypes = {
  album: PropTypes.object,
  onClick: PropTypes.func,
};

export default MobilePlayerPanelAlbumCard;
