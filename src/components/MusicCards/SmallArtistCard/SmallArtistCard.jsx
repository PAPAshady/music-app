import { useDispatch } from 'react-redux';
import { setSelectedArtist } from '../../../redux/slices/artistSlice';
import artistDefaultCover from '../../../assets/images/Avatar/no-avatar.png';
import PropTypes from 'prop-types';

function SmallArtistCard({ artist, size = 'sm', classNames }) {
  const { image, name } = artist;
  const dispatch = useDispatch();

  return (
    <div
      className={`group flex cursor-pointer flex-col items-center text-center ${classNames}`}
      onClick={() => dispatch(setSelectedArtist(artist))}
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
};

export default SmallArtistCard;
