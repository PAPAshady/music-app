import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Heart, Music, Share } from 'iconsax-react';
import useSafeContext from '../../../hooks/useSafeContext';
import MusicPlayerContext from '../../../contexts/MusicPlayerContext';
import { useDispatch } from 'react-redux';
import { openMobilePlaylist } from '../../../redux/slices/mobilePlaylistSlice';

const AlbumCard = memo(({ size, isFavorite, album, classNames }) => {
  const { cover = noCoverImg, totaltracks, artist, title } = album;
  const dispatch = useDispatch();
  const { setSelectedPlaylist, playlist } = useSafeContext(MusicPlayerContext);
  const isCurrentAlbumPlaying = album.title === playlist.title && album.id === playlist.id;

  const openMobilePlaylistHandler = () => {
    setSelectedPlaylist(album);
    dispatch(openMobilePlaylist());
  };

  return (
    <div
      className={`lg:bg-secondary-700/40 lg:hover:border-secondary-300 lg:hover:bg-secondary-600/48 inset-shadow-secondary-400/70 group relative w-full overflow-hidden rounded-lg border border-transparent bg-black/80 shadow-[1px_1px_12px_rgba(0,0,0,.7)] transition-all duration-300 hover:border-white lg:inset-shadow-[1px_1px_7px] ${size === 'md' ? 'lg:max-w-[328px]' : ''} ${classNames}`}
    >
      <div className="flex items-center lg:p-3">
        <div
          className="relative flex items-center justify-center lg:pe-10"
          onClick={openMobilePlaylistHandler}
        >
          <img
            className="z-[1] size-[85px] min-h-[85px] min-w-[85px] cursor-pointer rounded-sm transition-all group-hover:opacity-50 lg:group-hover:opacity-100"
            src={cover}
            alt={title}
          />
          <div
            className={`absolute z-[2] flex size-[70%] items-center justify-center rounded-full border border-white bg-cover bg-center bg-no-repeat opacity-0 transition-all duration-300 group-hover:opacity-100 lg:left-12 lg:z-auto lg:size-[80px] lg:border-white/60 lg:opacity-60 ${isCurrentAlbumPlaying ? 'animate-infinite-rotate' : 'group-hover:animate-infinite-rotate'}`}
            style={{
              backgroundImage: `url(${cover})`,
              mask: 'radial-gradient(circle, transparent 8px, black 8px)',
              WebkitMask: 'radial-gradient(circle, transparent 8px, black 8px)',
            }}
          >
            <span className="size-[31%] rounded-full border border-white lg:size-[21px] lg:border"></span>
          </div>
        </div>
        <div className="flex grow items-center justify-between overflow-hidden px-3.5 lg:block">
          <div className="overflow-hidden">
            <p
              className={`text-white-50 cursor-pointer truncate text-base ${size === 'lg' ? 'lg:text-lg' : ''}`}
              title={title}
              onClick={openMobilePlaylistHandler}
            >
              {title}
            </p>
            <span title={artist} className="block truncate text-sm text-white">
              {artist}
            </span>
          </div>
          {size === 'md' && (
            <div className="mt-3 hidden items-center justify-between gap-4 text-sm lg:flex">
              <p className="flex items-center gap-1">
                <Music size={18} className="text-primary-50" />
                <span className="text-xs text-white">
                  {totaltracks} Track{totaltracks > 1 && 's'}
                </span>
              </p>
              <div className="text-primary-50 flex items-center gap-2">
                <button className="hover:scale-110">
                  <Share size={18} />
                </button>
                <button className="hover:scale-110">
                  <Heart size={18} className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
                </button>
              </div>
            </div>
          )}
          <button className="text-white-50 p-1 lg:hidden">
            <Heart className={isFavorite ? 'fill-red-500 text-red-500' : ''} />
          </button>
        </div>
      </div>
      {size === 'lg' && (
        <button className="absolute top-2 right-2 hidden p-1 lg:block">
          <Heart
            className={`transition-all duration-300 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`}
          />
        </button>
      )}
    </div>
  );
});

AlbumCard.displayName = 'AlbumCard';

AlbumCard.propTypes = {
  size: PropTypes.oneOf(['md', 'lg']).isRequired,
  isFavorite: PropTypes.bool,
  album: PropTypes.object.isRequired,
  classNames: PropTypes.string,
};

export default AlbumCard;
