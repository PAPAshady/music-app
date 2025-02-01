import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Heart, Play } from 'iconsax-react';

const PlaylistCard = memo(({ title, numberOfTracks, image = noCoverImg, isFavorite }) => {
  return (
    <div
      className="overflow-hidde group relative flex size-36 items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[2px_2px_15px_rgba(0,0,0,0.5)] outline outline-transparent transition-all duration-300 hover:outline-white lg:h-48 lg:w-[152px] lg:outline-none"
      style={{ backgroundImage: `url(${image})` }}
    >
      <div className="flex size-full flex-col justify-between bg-gradient-to-t from-[rgba(0,0,0,.7)] to-transparent p-2">
        <div className="text-end">
          <button className="size-4 lg:size-6">
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
          <h3 className="text-white-50 mb-1 cursor-pointer text-sm lg:text-base">{title}</h3>
          <p className="text-xs text-white">{numberOfTracks} Tracks</p>
        </div>
      </div>
    </div>
  );
});

PlaylistCard.propTypes = {
  title: PropTypes.string.isRequired,
  numberOfTracks: PropTypes.number.isRequired,
  image: PropTypes.string,
  isFavorite: PropTypes.bool,
};

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;
