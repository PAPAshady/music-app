import { memo } from 'react';
import { Heart, Menu, Play } from 'iconsax-react';
import IconButton from '../../Buttons/IconButton/IconButton';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import PropTypes from 'prop-types';

const PlayBar = memo(
  ({
    size,
    title,
    cover = noCoverImg,
    artist = 'Unknown artist',
    time,
    album = 'Unknown album',
    isFavorite,
    clickHandler,
    classNames,
  }) => {
    const musicTitleSizes = {
      lg: 'text-base lg:text-xl',
      md: 'paragraph-1',
      sm: 'text-xs',
    };

    const albumNameSizes = {
      lg: 'text-base',
      md: 'text-sm',
      sm: 'hidden',
    };

    return (
      <div
        className={`bg-primary-800/60 hover:inset-shadow-secondary-400 border-primaty-10 group hover:bg-primary-700/40 lg:hover:bg-primary-800 flex max-w-[285px] items-center justify-between gap-4 rounded-lg border p-1 inset-shadow-transparent transition-all duration-300 lg:inset-shadow-[2px_2px_15px] ${size === 'lg' ? 'lg:max-w-[890px]' : 'lg:max-w-[510px]'} ${classNames}`}
      >
        <div className="flex grow gap-2">
          <button className="relative overflow-hidden rounded-md" onClick={clickHandler}>
            <img
              src={cover}
              className={`size-12 object-cover ${size !== 'sm' ? 'lg:size-14' : ''}`}
              alt={title}
            />
            <span
              className={`absolute top-1/2 left-1/2 flex size-full -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-transparent opacity-0 transition-all duration-300 group-hover:bg-black/60 group-hover:opacity-100`}
            >
              <span className="size-6 lg:size-8">
                <Play size="100%" />
              </span>
            </span>
          </button>
          <div className="flex flex-col">
            <button
              className={`text-white-50 grow text-start ${musicTitleSizes[size]}`}
              onClick={clickHandler}
            >
              {title}
            </button>
            <span
              className={`text-secondary-200 grow ${size === 'lg' ? 'text-xs lg:text-sm' : 'caption-2'}`}
            >
              {artist}
            </span>
          </div>
        </div>

        <div
          className={`flex items-center justify-between gap-4 pe-3 ${size !== 'sm' ? 'lg:grow-3' : ''}`}
        >
          {size !== 'sm' && (
            <>
              <p className={`hidden lg:block ${albumNameSizes[size]}`}>{album}</p>
              <span
                className={`text-secondary-200 pe-3 text-xs lg:p-0 ${size === 'lg' ? 'lg:text-sm' : 'hidden lg:block'}`}
              >
                {time}
              </span>
            </>
          )}
          <div className={`flex items-center gap-2 ${size !== 'sm' ? 'lg:gap-4' : ''}`}>
            <div className={` ${size === 'md' ? 'block lg:hidden' : 'block'}`}>
              <IconButton
                icon={
                  <Heart
                    size={size === 'sm' ? 16 : 24}
                    className={`transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
                  />
                }
              />
            </div>
            <div
              className={`${size === 'md' ? 'hidden lg:block' : ''} ${size === 'sm' ? 'hidden lg:block' : ''}`}
            >
              <IconButton icon={<Menu size={size === 'sm' ? 16 : 24} />} />
            </div>
          </div>
        </div>
      </div>
    );
  }
);

PlayBar.displayName = 'PlayBar';

PlayBar.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg']).isRequired,
  title: PropTypes.string.isRequired,
  cover: PropTypes.string,
  artist: PropTypes.string,
  time: PropTypes.string.isRequired,
  album: PropTypes.string,
  clickHandler: PropTypes.func,
  isFavorite: PropTypes.bool,
  classNames: PropTypes.string,
};

export default PlayBar;
