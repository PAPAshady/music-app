import { useDispatch } from 'react-redux';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';

function SmallAlbumCard(album) {
  const dispatch = useDispatch();
  const { title, cover } = album;
  const pathname = useLocation().pathname;

  const showAlbumInfos = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
  };

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-md p-2 hover:bg-white/3">
      <Link to={`${pathname}?type=album&id=${album.id}`}>
        <img
          src={cover ?? defaultSongCover}
          alt={title}
          className="size-14 cursor-pointer rounded-md object-cover"
          onClick={showAlbumInfos}
        />
      </Link>
      <div>
        <Link
          className="mb-1 cursor-pointer text-sm text-[#fff]"
          onClick={showAlbumInfos}
          to={`${pathname}?type=album&id=${album.id}`}
        >
          {title}
        </Link>
        <p className="text-primary-100 text-xs">2019 . Album</p>
      </div>
    </div>
  );
}

SmallAlbumCard.propTypes = { album: PropTypes.object };
export default SmallAlbumCard;
