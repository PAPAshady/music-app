import { useDispatch } from 'react-redux';
import artistDefaultCover from '../../../assets/images/Avatar/no-avatar.png';
import PropTypes from 'prop-types';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { setQueries } from '../../../redux/slices/queryStateSlice';

function SmallArtistCard({ artist, size = 'sm', classNames, onClick }) {
  const { image, name } = artist;
  const dispatch = useDispatch();

  const showArtistInfos = () => {
    dispatch(setQueries({ type: 'artist', id: artist.id }));
    dispatch(openMobilePanel('artist'));
    onClick?.();
  };

  return (
    <div
      className={`group flex cursor-pointer flex-col items-center text-center ${classNames}`}
      onClick={showArtistInfos}
    >
      <img
        src={image ?? artistDefaultCover}
        className={`group-hover:outline-primary-50 mb-1 rounded-full object-cover outline-1 outline-transparent transition-colors ${size === 'sm' ? 'size-18' : 'size-24'}`}
      />
      <span className={size === 'sm' && 'text-sm'}>{name}</span>
    </div>
  );
}

SmallArtistCard.propTypes = {
  artist: PropTypes.object.isRequired,
  size: PropTypes.oneOf(['sm', 'md']),
  classNames: PropTypes.string,
  onClick: PropTypes.func,
};

export default SmallArtistCard;
