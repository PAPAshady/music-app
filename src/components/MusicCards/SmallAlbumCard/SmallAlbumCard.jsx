import { useDispatch } from 'react-redux';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import defaultSongCover from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';
import useQueryState from '../../../hooks/useQueryState';

function SmallAlbumCard(album) {
  const dispatch = useDispatch();
  const { title, cover } = album;
  const { setQuery } = useQueryState();

  const showAlbumInfos = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
    setQuery({ type: 'album', id: album.id });
  };

  return (
    <div className="flex items-center gap-2 overflow-hidden rounded-md p-2 hover:bg-white/3">
      <img
        src={cover ?? defaultSongCover}
        alt={title}
        className="size-14 cursor-pointer rounded-md object-cover"
        onClick={showAlbumInfos}
      />
      <div>
        <p className="mb-1 cursor-pointer text-sm text-[#fff]" onClick={showAlbumInfos}>
          {title}
        </p>
        <p className="text-primary-100 text-xs">2019 . Album</p>
      </div>
    </div>
  );
}

SmallAlbumCard.propTypes = { album: PropTypes.object };
export default SmallAlbumCard;
