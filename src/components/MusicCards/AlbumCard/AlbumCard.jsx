import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Heart, Music, Share } from 'iconsax-react';
import { useDispatch, useSelector } from 'react-redux';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { useMutation } from '@tanstack/react-query';
import { likeAlbumMutationOptions, unlikeAlbumMutationOptions } from '../../../queries/likes';
import NowPlayingIndicator from '../../NowPlayingIndicator/NowPlayingIndicator';
import { showNewSnackbar } from '../../../redux/slices/snackbarSlice';
import { Link, useLocation } from 'react-router-dom';

const AlbumCard = memo(({ size, album, classNames }) => {
  const { cover, totaltracks, artist, is_liked, title, id } = album;
  const dispatch = useDispatch();
  const playingTracklistId = useSelector((state) => state.playContext.currentCollection?.id);
  const isCurrentAlbumPlaying = id === playingTracklistId;
  const { mutate, isPending } = useMutation(
    is_liked ? unlikeAlbumMutationOptions() : likeAlbumMutationOptions()
  );
  const pathname = useLocation().pathname;

  const openMobilePanelHandler = () => {
    dispatch(setSelectedCollection(album));
    dispatch(openMobilePanel('album'));
  };

  const onLikeChangeHandler = (e) => {
    e.stopPropagation();
    mutate(id);
  };

  const copyLink = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BASE_URL;
      await navigator.clipboard.writeText(`${baseUrl}?type=album&id=${id}`);
      dispatch(showNewSnackbar({ message: 'Link copied to clipboard!', type: 'success' }));
    } catch (err) {
      dispatch(showNewSnackbar({ message: 'Error copying link', type: 'error' }));
      console.error('Error copying link : ', err);
    }
  };

  return (
    <div
      className={`lg:bg-secondary-700/40 lg:hover:border-secondary-300 lg:hover:bg-secondary-600/48 inset-shadow-secondary-400/70 group relative w-full overflow-hidden rounded-lg border border-transparent bg-black/80 shadow-[1px_1px_12px_rgba(0,0,0,.7)] transition-all duration-300 hover:border-white lg:inset-shadow-[1px_1px_7px] ${size === 'md' ? 'lg:max-w-[328px]' : ''} ${classNames}`}
    >
      <div className="flex items-center lg:p-3">
        <Link
          className="relative flex items-center justify-center lg:pe-10"
          onClick={openMobilePanelHandler}
          to={`${pathname}?type=album&id=${id}`}
        >
          <img
            className="z-[1] size-[85px] min-h-[85px] min-w-[85px] cursor-pointer rounded-sm object-cover transition-all group-hover:opacity-50 lg:group-hover:opacity-100"
            src={cover ?? noCoverImg}
            alt={title}
            loading="lazy"
          />
          <div
            className={`absolute z-[2] flex size-[70%] items-center justify-center rounded-full border border-white bg-cover bg-center bg-no-repeat opacity-0 transition-all duration-300 group-hover:opacity-100 lg:left-12 lg:z-auto lg:size-[80px] lg:border-white/60 lg:opacity-60 ${isCurrentAlbumPlaying ? 'animate-infinite-rotate' : 'group-hover:animate-infinite-rotate'}`}
            style={{
              backgroundImage: `url(${cover ?? noCoverImg})`,
              mask: 'radial-gradient(circle, transparent 8px, black 8px)',
              WebkitMask: 'radial-gradient(circle, transparent 8px, black 8px)',
            }}
          >
            <span className="size-[31%] rounded-full border border-white lg:size-[21px] lg:border"></span>
          </div>
        </Link>
        <div className="flex grow items-center justify-between overflow-hidden px-3.5 lg:block">
          <div className="overflow-hidden text-start">
            <Link
              className={`text-white-50 cursor-pointer truncate text-base ${size === 'lg' ? 'lg:text-lg' : ''}`}
              title={title}
              onClick={openMobilePanelHandler}
              to={`${pathname}?type=album&id=${id}`}
            >
              {title}
            </Link>
            <span title={artist} className="block truncate text-sm text-white">
              {artist}
            </span>
          </div>
          {size === 'md' && (
            <div className="mt-3 hidden items-center justify-between gap-4 text-sm lg:flex">
              <p className="flex items-center gap-1">
                <Music size={18} className="text-primary-50" />
                <span className="text-xs text-white">
                  {totaltracks ? `${totaltracks} Track${totaltracks > 1 && 's'}` : 'No tracks'}
                </span>
              </p>
              <div className="text-primary-50 flex items-center gap-2">
                {isCurrentAlbumPlaying && <NowPlayingIndicator />}
                <button className="hover:scale-110" onClick={copyLink}>
                  <Share size={18} />
                </button>
                <button
                  className="hover:scale-110"
                  disabled={isPending}
                  onClick={onLikeChangeHandler}
                >
                  <Heart
                    size={18}
                    className={`transition-colors duration-300 ${is_liked ? 'fill-secondary-50 text-secondary-50' : ''}`}
                  />
                </button>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            {isCurrentAlbumPlaying && size !== 'md' && (
              <div className="flex items-center gap-1 lg:ms-auto lg:-me-2">
                <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full"></div>
                <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full [animation-delay:250ms]"></div>
                <div className="bg-secondary-50 animate-expand h-3 w-0.75 origin-bottom rounded-full [animation-delay:450ms]"></div>
              </div>
            )}
            <button
              className="text-white-50 p-1 lg:hidden"
              disabled={isPending}
              onClick={onLikeChangeHandler}
            >
              <Heart className={is_liked ? 'fill-secondary-50 text-secondary-50' : ''} />
            </button>
          </div>
        </div>
      </div>
      {size === 'lg' && (
        <button
          className="absolute top-2 right-2 hidden p-1 lg:block"
          disabled={isPending}
          onClick={onLikeChangeHandler}
        >
          <Heart
            className={`transition-all duration-300 ${is_liked ? 'fill-secondary-50 text-secondary-50' : ''}`}
          />
        </button>
      )}
    </div>
  );
});

AlbumCard.displayName = 'AlbumCard';

AlbumCard.propTypes = {
  size: PropTypes.oneOf(['md', 'lg']).isRequired,
  is_liked: PropTypes.bool,
  album: PropTypes.object.isRequired,
  classNames: PropTypes.string,
};

export default AlbumCard;
