import { setSelectedCollection } from '../../redux/slices/playContextSlice';
import { openMobilePanel } from '../../redux/slices/mobilePanelSlice';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import defaultCover from '../../assets/images/covers/no-cover.jpg';
import { Link, useLocation } from 'react-router-dom';

function PlaylistCard({ playlist }) {
  const dispatch = useDispatch();
  const { title, totaltracks, cover, tracklistType } = playlist;
  const pathname = useLocation().pathname;

  const showSelectedPlaylist = () => {
    dispatch(setSelectedCollection(playlist));
    dispatch(openMobilePanel('playlist'));
  };

  return (
    <Link
      className="flex w-27.5 flex-col rounded-xl"
      to={`${pathname}?type=playlist&id=${playlist.id}`}
    >
      <img
        src={cover || defaultCover}
        alt={title}
        className="mb-2 h-25 w-full cursor-pointer rounded-lg object-cover"
        onClick={showSelectedPlaylist}
      />
      <h3 className="cursor-pointer truncate text-sm font-semibold" onClick={showSelectedPlaylist}>
        {title}
      </h3>
      <div className="mt-1 flex items-center gap-1 truncate text-xs text-gray-400">
        <span className="capitalize">{tracklistType}</span>
        <span className="bg-secondary-100 size-0.75 rounded-full"></span>
        <span>
          {`${totaltracks ? (totaltracks > 1 ? `${totaltracks} tracks` : '1 track') : 'No tracks'}`}
        </span>
      </div>
    </Link>
  );
}

PlaylistCard.propTypes = {
  playlist: PropTypes.object.isRequired,
};

export default PlaylistCard;
