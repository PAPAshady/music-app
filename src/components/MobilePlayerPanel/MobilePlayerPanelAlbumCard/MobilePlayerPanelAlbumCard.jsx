import PropTypes from 'prop-types';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { useDispatch } from 'react-redux';
import musicCover from '../../../assets/images/covers/no-cover.jpg';
import { Link, useLocation } from 'react-router-dom';

function MobilePlayerPanelAlbumCard({ album, onClick }) {
  const { cover, title, release_date } = album;
  const dispatch = useDispatch();
  const pathname = useLocation().pathname;

  const clickHandler = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
    onClick?.();
  };

  return (
    <Link
      className="flex w-37.5 flex-col rounded-xl p-3"
      onClick={clickHandler}
      to={`${pathname}?type=album&id=${album.id}`}
    >
      <img
        src={cover || musicCover}
        alt={title}
        className="mb-2 h-30 w-full cursor-pointer rounded-lg object-cover"
      />
      <h3 className="cursor-pointer truncate text-base font-semibold">{title}</h3>
      <div className="mt-1 flex items-center gap-1 truncate text-sm text-gray-400">
        <span>Album</span>
        <span className="bg-secondary-100 size-0.75 rounded-full"></span>
        <span>{release_date.split('-')[0]}</span>
      </div>
    </Link>
  );
}

MobilePlayerPanelAlbumCard.propTypes = {
  album: PropTypes.object,
  onClick: PropTypes.func,
};

export default MobilePlayerPanelAlbumCard;
