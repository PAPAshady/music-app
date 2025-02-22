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
  classNames,
}) {
  return (
    <div
      className={`border-secondary-300 hover:border-secondary-50 flex max-w-[325px] items-center overflow-hidden rounded-lg border transition-colors duration-300 ${classNames}`}
    >
      <img src={cover} alt={title} className="size-28 object-cover" />
      <div className="grow overflow-hidden px-2">
        <div className="mb-2">
          <h3 className="text-primary-50 mb-2 truncate text-lg" title={title}>
            {title}
          </h3>
          <p className="text-primary-100 truncate text-sm">{artist}</p>
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
  classNames: PropTypes.string,
};
