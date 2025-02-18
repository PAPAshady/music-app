import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Heart, Play } from 'iconsax-react';

const PlaylistCard = memo(
  ({ title, numberOfTracks, image = noCoverImg, isFavorite, classNames }) => {
    return (
      <div
        className={`overflow-hidde group relative flex h-36 min-w-36 items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[2px_2px_15px_rgba(0,0,0,0.5)] outline outline-transparent transition-all duration-300 hover:outline-white lg:h-48 lg:min-w-[152px] lg:outline-none xl:min-w-[140px] ${classNames}`}
        style={{ backgroundImage: `url(${image})` }}
      >
        <div className="flex size-full flex-col justify-between bg-gradient-to-t from-[rgba(0,0,0,.7)] to-transparent p-2">
          <div className="p-1 text-end">
            <button className="size-6 lg:size-[26px]">
              <Heart
                size="100%"
                className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
              />
            </button>
          </div>

          <div className="text-white-50 hidden items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 lg:flex">
            <button>
              <Play size={32} />
            </button>
          </div>

          <div>
            <h3 className="text-white-50 mb-1 cursor-pointer text-base">{title}</h3>
            <p className="text-sm text-white">{numberOfTracks} Tracks</p>
          </div>
        </div>
      </div>
    );
  }
);

PlaylistCard.propTypes = {
  title: PropTypes.string.isRequired,
  numberOfTracks: PropTypes.number.isRequired,
  image: PropTypes.string,
  isFavorite: PropTypes.bool,
  classNames: PropTypes.string,
};

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;
