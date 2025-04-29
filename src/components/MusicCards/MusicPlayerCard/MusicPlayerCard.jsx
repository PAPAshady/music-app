import IconButton from '../../Buttons/IconButton/IconButton';
import { Heart } from 'iconsax-react';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { BASE_URL } from '../../../services/api';
import PropTypes from 'prop-types';

export default function MusicPlayerCard({
  title,
  artists = [{ name: 'Unkown artist' }],
  time,
  isFavorite,
  musiccover = noCoverImg,
  isPlaying,
  onClick,
  classNames,
  id,
}) {
  return (
    <div
      className={`border-secondary-300 hover:border-secondary-50 flex items-center gap-2 overflow-hidden rounded-lg border-2 p-2 transition-all duration-300 ${classNames} ${isPlaying ? 'bg-secondary-600/40 backdrop-blur-xs' : '!border-transparent'}`}
    >
      <img
        onClick={() => onClick(id)}
        src={musiccover ? `${BASE_URL}${musiccover}` : musiccover}
        alt={title}
        className={`size-24 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors duration-300 ${!isPlaying ? 'hover:border-secondary-300' : ''}`}
      />
      <div
        className={`grow overflow-hidden transition-all duration-300 ${isPlaying ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="mb-2">
          <h3
            onClick={() => onClick(id)}
            className="text-primary-50 mb-1 cursor-pointer truncate text-base"
            title={title}
          >
            {title}
          </h3>
          <p className="text-primary-100 truncate text-sm" title={artists[0].name}>
            {artists[0].name}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-primary-100 text-sm">{time}</span>
          <IconButton icon={<Heart className={isFavorite ? 'fill-red text-red' : ''} />} />
        </div>
      </div>
    </div>
  );
}

MusicPlayerCard.propTypes = {
  title: PropTypes.string.isRequired,
  artists: PropTypes.array,
  time: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
  musiccover: PropTypes.string,
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
  classNames: PropTypes.string,
  id: PropTypes.number.isRequired,
};
