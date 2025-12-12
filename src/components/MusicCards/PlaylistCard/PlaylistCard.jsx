import { memo } from 'react';
import PropTypes from 'prop-types';
import noCoverImg from '../../../assets/images/covers/no-cover.jpg';
import { Heart, Play } from 'iconsax-reactjs';
import { useDispatch, useSelector } from 'react-redux';
import { openMobilePanel } from '../../../redux/slices/mobilePanelSlice';
import { setSelectedCollection } from '../../../redux/slices/playContextSlice';
import { useMutation } from '@tanstack/react-query';
import { likePlaylistMutationOptions, unlikePlaylistMutationOptions } from '../../../queries/likes';
import NowPlayingIndicator from '../../NowPlayingIndicator/NowPlayingIndicator';
import { Link, useLocation } from 'react-router-dom';

const PlaylistCard = memo((playlist) => {
  const dispatch = useDispatch();
  const pathname = useLocation().pathname;
  const { title, totaltracks, cover, classNames, is_liked, id } = playlist;
  const { mutate, isPending } = useMutation(
    is_liked ? unlikePlaylistMutationOptions() : likePlaylistMutationOptions()
  );
  const playingTracklistId = useSelector((state) => state.playContext.currentCollection?.id);
  const isCurrentPlaylistPlaying = id === playingTracklistId;

  const showSelectedPlaylist = () => {
    dispatch(setSelectedCollection(playlist));
    dispatch(openMobilePanel('playlist'));
  };

  const onLikeChange = (e) => {
    e.stopPropagation(); // stop the click from bubbling to <Link/> so it doesn't open the mobile panel
    e.preventDefault(); // keep <Link/> from performing a full page navigation (fallback <a> behavior when bubbling is stopped)
    mutate(id);
  };

  return (
    <Link
      className={`group relative flex h-36 min-w-36 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-cover bg-center bg-no-repeat shadow-[2px_2px_15px_rgba(0,0,0,0.5)] outline outline-transparent transition-all duration-300 hover:outline-white lg:h-48 lg:min-w-[152px] lg:outline-none xl:min-w-[140px] ${classNames}`}
      style={{ backgroundImage: `url(${cover ?? noCoverImg})` }}
      title={title}
      onClick={showSelectedPlaylist}
      to={`${pathname}?type=playlist&id=${id}`}
    >
      <div className="flex size-full flex-col justify-between bg-gradient-to-t from-[rgba(0,0,0,.7)] to-transparent p-2">
        <div
          className={`items-center p-1 ${isCurrentPlaylistPlaying ? 'flex items-center justify-between' : 'ms-auto text-end'}`}
        >
          {isCurrentPlaylistPlaying && <NowPlayingIndicator />}
          <button className="size-8 lg:size-[26px]" disabled={isPending} onClick={onLikeChange}>
            <Heart
              size="100%"
              className={`transition-colors duration-300 ${is_liked ? 'fill-secondary-50 text-secondary-50' : ''}`}
            />
          </button>
        </div>

        <div className="text-white-50 hidden items-center justify-center opacity-0 transition-opacity group-hover:opacity-100 lg:flex">
          <button>
            <Play size={32} />
          </button>
        </div>

        <div>
          <h3 className="text-white-50 mb-1 cursor-pointer truncate text-base">{title}</h3>
          <p className="text-sm text-white">
            {totaltracks ? `${totaltracks} ${totaltracks > 1 ? 'tracks' : 'track'}` : 'No tracks'}
          </p>
        </div>
      </div>
    </Link>
  );
});
PlaylistCard.propTypes = {
  title: PropTypes.string,
  totaltracks: PropTypes.number,
  cover: PropTypes.string,
  is_liked: PropTypes.bool,
  classNames: PropTypes.string,
};

PlaylistCard.displayName = 'PlaylistCard';

export default PlaylistCard;
