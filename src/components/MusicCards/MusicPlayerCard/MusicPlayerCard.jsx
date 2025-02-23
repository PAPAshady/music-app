import IconButton from '../../Buttons/IconButton/IconButton';
import { Heart } from 'iconsax-react';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

export default function MusicPlayerCard({
  title,
  artist = 'Unkown artist',
  time,
  isFavorite,
  cover = noCoverImg,
  isPlaying,
  onClick,
  classNames,
}) {
  return (
    <div
      className={`border-secondary-300 hover:border-secondary-50 flex items-center gap-2 overflow-hidden rounded-lg border-2 p-2 transition-all duration-300 ${classNames} ${isPlaying ? '' : '!border-transparent'}`}
    >
      <img
        onClick={onClick}
        src={cover}
        alt={title}
        className={`size-24 cursor-pointer rounded-md border-2 border-transparent object-cover transition-colors duration-300 ${!isPlaying ? 'hover:border-secondary-300' : ''}`}
      />
      <div
        className={`grow overflow-hidden transition-all duration-300 ${isPlaying ? 'visible opacity-100' : 'invisible opacity-0'}`}
      >
        <div className="mb-2">
          <h3
            onClick={onClick}
            className="text-primary-50 mb-1 cursor-pointer truncate text-base"
            title={title}
          >
            {title}
          </h3>
          <p className="text-primary-100 truncate text-sm" title={artist}>
            {artist}
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
  artist: PropTypes.string,
  time: PropTypes.string.isRequired,
  isFavorite: PropTypes.bool,
  cover: PropTypes.string,
  isPlaying: PropTypes.bool,
  onClick: PropTypes.func,
  classNames: PropTypes.string,
};
