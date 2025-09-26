import { useDispatch } from 'react-redux';
import { setSelectedArtist } from '../../../redux/slices/artistSlice';
import artistDefaultCover from '../../../assets/images/Avatar/no-avatar.png';
import PropTypes from 'prop-types';
import { setSidebarPanelType } from '../../../redux/slices/sidebarTypeSlice';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';

function SmallArtistCard({ artist, size = 'sm', classNames }) {
  const { image, name } = artist;
  const dispatch = useDispatch();

  const showArtistInfos = () => {
    dispatch(setSelectedArtist(artist));
    dispatch(setSidebarPanelType('artist_panel'));
    dispatch(
      openMobilePanel({
        type: 'artist',
        title: artist.name,
        description: artist.bio,
        image: artist.image,
      })
    );
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
};

export default SmallArtistCard;
